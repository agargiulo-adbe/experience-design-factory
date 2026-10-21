/**
 * deck-pptx — il deck come .pptx, una slide per pagina.
 *
 * PERCHÉ NON SI COMPONE SUL TEMPLATE ADOBE
 * La regola della Factory dice: un artefatto, un design system — del cliente →
 * experience HTML, di Adobe → .pptx sul template di Brand Center. Qui il design
 * system è quello del CLIENTE (verde di sistema letto dal CSS di produzione),
 * quindi l'artefatto resta l'experience, e questo file non è un deck ricomposto:
 * è lo STESSO rendering messo in un contenitore che si apre con PowerPoint.
 * Mettere queste slide sul template Adobe sarebbe l'ibrido che quella regola
 * esiste per impedire — marchio Adobe fuori, colore del cliente dentro.
 *
 * Quindi: nessun layout, nessun testo ricomposto, nessuna tipografia rifatta.
 * Una immagine a pagina piena per slide, nell'ordine del percorso, più il testo
 * della slide nelle NOTE DEL RELATORE — così il file resta cercabile e chi lo
 * riceve può copiare una frase senza riscriverla a mano.
 *
 *   DECK_URL=http://localhost:4877 npx tsx scripts/deck-pptx.ts \
 *     --app <alias> [--out <file.pptx>] [--lang it|en] [--only <rotta,rotta>]
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { ROUTE_SETS, CWD_ALIAS } from './lib/deck-routes';

const flag = (n: string): string | undefined => {
  const i = process.argv.indexOf(`--${n}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const asked = flag('app') ?? '';
const app = ROUTE_SETS[asked] ? asked : (CWD_ALIAS[asked] ?? '');
const ROUTE_SET = ROUTE_SETS[app];
if (!ROUTE_SET) throw new Error(`deck-pptx: nessun route set per «${asked}»`);
const only = flag('only');
const ROUTES = only ? ROUTE_SET.filter((r) => only.split(',').includes(r.name)) : ROUTE_SET;
if (!ROUTES.length) throw new Error(`deck-pptx: --only ${only} non seleziona nessuna rotta`);
const BASE = process.env.DECK_URL ?? 'http://localhost:4321';
const LANG = flag('lang');
const OUT = resolve(flag('out') ?? `${app}${LANG ? `-${LANG}` : ''}.pptx`);

/* ── Lo ZIP, scritto a mano ────────────────────────────────────────────────
   Un .pptx è uno ZIP di XML. Nessuna dipendenza nuova per una cosa che la
   libreria standard di Node sa già fare: `deflateRaw` più le due intestazioni
   dello standard. */
interface Voce { nome: string; dati: Buffer }
const crcTab = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (b: Buffer): number => {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = crcTab[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

function zip(voci: Voce[]): Buffer {
  const locali: Buffer[] = [];
  const centrali: Buffer[] = [];
  let offset = 0;
  for (const v of voci) {
    const nome = Buffer.from(v.nome, 'utf8');
    const compresso = deflateRawSync(v.dati, { level: 9 });
    const crc = crc32(v.dati);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(8, 8); lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(compresso.length, 18);
    lh.writeUInt32LE(v.dati.length, 22); lh.writeUInt16LE(nome.length, 26); lh.writeUInt16LE(0, 28);
    locali.push(lh, nome, compresso);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0, 8); ch.writeUInt16LE(8, 10); ch.writeUInt16LE(0, 12); ch.writeUInt16LE(0, 14);
    ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(compresso.length, 20); ch.writeUInt32LE(v.dati.length, 24);
    ch.writeUInt16LE(nome.length, 28); ch.writeUInt32LE(0, 42 - 4); ch.writeUInt32LE(offset, 42);
    centrali.push(ch, nome);
    offset += lh.length + nome.length + compresso.length;
  }
  const corpo = Buffer.concat(locali);
  const dir = Buffer.concat(centrali);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(voci.length, 8); eocd.writeUInt16LE(voci.length, 10);
  eocd.writeUInt32LE(dir.length, 12); eocd.writeUInt32LE(corpo.length, 16);
  return Buffer.concat([corpo, dir, eocd]);
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* 1920×1080 in EMU: 12192000 × 6858000, cioè il 16:9 largo di PowerPoint. */
const W = 12192000, H = 6858000;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

const slide: { jpg: Buffer; note: string }[] = [];
for (const rotta of ROUTES) {
  await page.goto(BASE + rotta.route, { waitUntil: 'networkidle' });
  if (LANG) await page.evaluate((l) => document.documentElement.setAttribute('data-lang', l), LANG);
  await page.waitForTimeout(1000);
  const n = await page.evaluate(() => document.querySelectorAll('[data-slide]').length);
  for (let i = 0; i < n; i++) {
    await page.evaluate((k) => (window as any).__edfDeck?.goTo(k), i);
    await page.waitForTimeout(1200);
    const note = await page.evaluate((k) => {
      const s = document.querySelectorAll('[data-slide]')[k];
      if (!s) return '';
      const attiva = document.documentElement.getAttribute('data-lang') || 'it';
      const c = s.cloneNode(true) as HTMLElement;
      c.querySelectorAll(attiva === 'it' ? '[data-lang-en]' : '[data-lang-it]').forEach((e) => e.remove());
      /* Gli <script> inline finirebbero nelle note del relatore: sulle slide
         con una clip in loop sono novecento caratteri di JavaScript prima
         della prima parola vera. */
      c.querySelectorAll('script, style, noscript').forEach((e) => e.remove());
      return (c.innerText || '').split('\n').map((r) => r.trim()).filter(Boolean).join('\n');
    }, i);
    let jpg: Buffer;
    try {
      jpg = await page.screenshot({ type: 'jpeg', quality: 92, animations: 'disabled', timeout: 20000 });
    } catch { continue; }
    slide.push({ jpg, note });
  }
  process.stdout.write(`  ${rotta.name}: ${n} slide\n`);
}
await browser.close();

const voci: Voce[] = [];
const rels: string[] = [];
const sldIds: string[] = [];
const overrides: string[] = [];

slide.forEach((s, k) => {
  const n = k + 1;
  voci.push({ nome: `ppt/media/image${n}.jpeg`, dati: s.jpg });
  voci.push({ nome: `ppt/slides/slide${n}.xml`, dati: Buffer.from(
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:pic><p:nvPicPr><p:cNvPr id="2" name="slide${n}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${W}" cy="${H}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`, 'utf8') });
  voci.push({ nome: `ppt/slides/_rels/slide${n}.xml.rels`, dati: Buffer.from(
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${n}.jpeg"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide" Target="../notesSlides/notesSlide${n}.xml"/></Relationships>`, 'utf8') });
  voci.push({ nome: `ppt/notesSlides/notesSlide${n}.xml`, dati: Buffer.from(
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:notes xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:sp><p:nvSpPr><p:cNvPr id="2" name="Notes"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/>${
    s.note.split('\n').map((r) => `<a:p><a:r><a:t>${esc(r)}</a:t></a:r></a:p>`).join('')
  }</p:txBody></p:sp></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>`, 'utf8') });
  voci.push({ nome: `ppt/notesSlides/_rels/notesSlide${n}.xml.rels`, dati: Buffer.from(
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="../slides/slide${n}.xml"/></Relationships>`, 'utf8') });
  rels.push(`<Relationship Id="rId${n + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${n}.xml"/>`);
  sldIds.push(`<p:sldId id="${255 + n}" r:id="rId${n + 1}"/>`);
  overrides.push(`<Override PartName="/ppt/slides/slide${n}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/><Override PartName="/ppt/notesSlides/notesSlide${n}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"/>`);
});

const vuotoMaster = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`;

voci.push(
  { nome: '[Content_Types].xml', dati: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${overrides.join('')}</Types>`, 'utf8') },
  { nome: '_rels/.rels', dati: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`, 'utf8') },
  { nome: 'ppt/presentation.xml', dati: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>${sldIds.join('')}</p:sldIdLst><p:sldSz cx="${W}" cy="${H}"/><p:notesSz cx="${H}" cy="${W}"/></p:presentation>`, 'utf8') },
  { nome: 'ppt/_rels/presentation.xml.rels', dati: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>${rels.join('')}</Relationships>`, 'utf8') },
  { nome: 'ppt/slideMasters/slideMaster1.xml', dati: Buffer.from(vuotoMaster, 'utf8') },
  { nome: 'ppt/slideMasters/_rels/slideMaster1.xml.rels', dati: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`, 'utf8') },
  { nome: 'ppt/slideLayouts/slideLayout1.xml', dati: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank"><p:cSld name="Vuoto"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`, 'utf8') },
  { nome: 'ppt/slideLayouts/_rels/slideLayout1.xml.rels', dati: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`, 'utf8') },
  { nome: 'ppt/theme/theme1.xml', dati: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="vuoto"><a:themeElements><a:clrScheme name="v"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="000000"/></a:dk2><a:lt2><a:srgbClr val="FFFFFF"/></a:lt2><a:accent1><a:srgbClr val="258900"/></a:accent1><a:accent2><a:srgbClr val="258900"/></a:accent2><a:accent3><a:srgbClr val="258900"/></a:accent3><a:accent4><a:srgbClr val="258900"/></a:accent4><a:accent5><a:srgbClr val="258900"/></a:accent5><a:accent6><a:srgbClr val="258900"/></a:accent6><a:hlink><a:srgbClr val="258900"/></a:hlink><a:folHlink><a:srgbClr val="258900"/></a:folHlink></a:clrScheme><a:fontScheme name="v"><a:majorFont><a:latin typeface="Open Sans"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Open Sans"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme><a:fmtScheme name="v"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`, 'utf8') },
);

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, zip(voci));
console.log(`\ndeck-pptx · ${app}${LANG ? ` · ${LANG}` : ''} — ${slide.length} slide, testo nelle note\n→ ${OUT}`);
