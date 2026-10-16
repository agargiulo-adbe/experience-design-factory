/**
 * og:images — l'anteprima del link per OGNI artefatto della Factory.
 *
 * PERCHÉ ESISTE. Un link della Factory finisce in chat, non in un motore di
 * ricerca: su Teams, in una mail, in un messaggio. Lì il riquadro di anteprima è
 * la prima cosa che si vede, e senza immagine resta il rettangolo grigio con
 * l'icona del documento generico — il link sembra una cosa qualunque. Misurato
 * il 16 ott 2026: 4 app su 19 avevano un'immagine, 3 layout su 20 la
 * dichiaravano, e una app aveva il file generato e MAI dichiarato.
 *
 * CHE COSA COMPONE, e perché così:
 *   · la firma **Adobe × Cliente**, nell'ordine non invertibile del co-brand
 *     (`packages/core/src/blocks/CoBrand.astro`). Il marchio del cliente è
 *     l'**SVG ufficiale** quando il cliente lo distribuisce (`src/assets/brand/`),
 *     altrimenti il **ripiego wordmark**: il nome in carattere display. Mai un
 *     logo ricostruito a mano o preso da fonte non ufficiale — è la wrong-brand
 *     imagery che la Quality Bar vieta, e in un'anteprima che gira in chat
 *     sarebbe il posto peggiore per farlo.
 *   · la **sigla del tipo** (`EXPERIENCE_TYPES[t].mark`): Pr · S · B · Pb · I,
 *     più D per i dossier. Due lettere dove una sarebbe ambigua, perché
 *     Prospettiva e Playbook iniziano entrambe per P e nel riquadro di una chat
 *     non c'è spazio per una legenda.
 *   · il **titolo** dell'artefatto e il tipo per esteso.
 *   · il badge **Riservato** sui documenti gated.
 *
 * LA PALETTE NON SI INVENTA: l'accento arriva dal registro dello showcase, che a
 * sua volta lo prende dal design system letto dal sito del cliente
 * (`pnpm brand:tokens`). Il fondo è la sua versione notte, calcolata.
 *
 * USO
 *   pnpm og                 → tutti gli artefatti
 *   pnpm og --app <alias>   → uno solo
 *   pnpm og --list          → che cosa genererebbe, senza generare
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { EXPERIENCE_TYPES, type ExperienceType } from '../packages/core/src/data/experienceTypes';
import { EXPERIENCES } from '../apps/factory-showcase/src/data/experiences';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Il marchio corporate Adobe, lo stesso path del componente condiviso. */
const ADOBE_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:100%;height:100%;display:block">' +
  '<path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.876L24 22.624z"/></svg>';

interface Artefatto {
  /** cartella sotto apps/ */
  slug: string;
  /** nome dell'artefatto, quello che si legge grande */
  name: string;
  /** cliente, per la firma */
  client: string;
  /** sigla da mostrare */
  mark: string;
  /** tipo per esteso, sotto il titolo */
  kind: string;
  /** accento della skin */
  accent: string;
  /** i documenti riservati portano il badge */
  gated?: boolean;
  /** dove scrivere: di norma public/, ma un'app può avere più artefatti */
  out?: string;
}

/**
 * Gli artefatti che NON stanno nel registro dello showcase, dichiarati qui con
 * il motivo. I dossier gated ci sono perché il link gira fra colleghi ed è
 * proprio lì che l'anteprima serve; le app di servizio perché un collega che
 * riceve «la console» deve capire che cos'è prima di cliccare.
 */
const FUORI_REGISTRO: Artefatto[] = [
  { slug: 'factory-hub', name: 'Experience Design Factory', client: 'Adobe Italia', mark: 'F', kind: 'Il punto di partenza', accent: '#EB1000' },
  { slug: 'factory-showcase', name: 'La Factory', client: 'Adobe Italia', mark: 'I', kind: 'Interno · come funziona', accent: '#EB1000' },
  { slug: 'console', name: 'Super Admin Console', client: 'Adobe Italia', mark: 'A', kind: 'Interno · amministrazione', accent: '#EB1000' },
  { slug: 'intesa-scala-umana', name: 'Su scala umana', client: 'Intesa Sanpaolo', mark: 'D', kind: 'Dossier interno', accent: '#258900', gated: true },
  { slug: 'intesa-dopo-la-firma', name: 'Dopo la firma', client: 'Intesa Assicurazioni', mark: 'D', kind: 'Dossier interno', accent: '#258900', gated: true },
  { slug: 'mef-giustizia-tributaria', name: 'Giustizia Tributaria', client: 'MEF', mark: 'D', kind: 'Dossier interno', accent: '#093696', gated: true },
];

function dalRegistro(): Artefatto[] {
  return EXPERIENCES.map((e) => {
    const t = EXPERIENCE_TYPES[e.type as ExperienceType];
    return {
      slug: e.slug,
      name: e.name,
      client: e.client,
      mark: t?.mark ?? '·',
      kind: t?.label.it ?? '',
      accent: e.accent,
    };
  });
}

/** L'SVG ufficiale del cliente, se l'app ne ha uno. Altrimenti: ripiego wordmark. */
function marchioCliente(slug: string): string | null {
  const dir = path.join(REPO, 'apps', slug, 'src/assets/brand');
  if (!fs.existsSync(dir)) return null;
  const f = fs.readdirSync(dir).find((x) => x.endsWith('.svg'));
  if (!f) return null;
  return fs
    .readFileSync(path.join(dir, f), 'utf8')
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<svg/, '<svg style="width:100%;height:100%;display:block" fill="currentColor"');
}

/** Luminanza relativa, per misurare il contrasto invece di sperarlo. */
function lum(hex: string): number {
  const h = hex.replace('#', '');
  const v = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
function contrasto(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/**
 * Un accento non è un inchiostro. Il blu di marchio del MEF (#093696) sul suo
 * fondo notte misura 1,7:1: in pagina sarebbe invisibile, e in un'anteprima di
 * 1200×630 vista da 3 cm in una chat anche peggio. Qui l'accento si schiarisce
 * finché non raggiunge la soglia AA sul fondo — misurando, non a occhio.
 */
function inchiostroAccento(accent: string, bg: string): string {
  let h = accent.replace('#', '');
  let [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  for (let i = 0; i < 24 && contrasto(`#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`, bg) < 4.5; i++) {
    r = Math.min(255, Math.round(r + (255 - r) * 0.18));
    g = Math.min(255, Math.round(g + (255 - g) * 0.18));
    b = Math.min(255, Math.round(b + (255 - b) * 0.18));
  }
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/** Il fondo: la versione notte dell'accento, calcolata e non scelta a occhio. */
function fondo(accent: string): { bg: string; bg2: string } {
  const h = accent.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const mix = (c: number, f: number) => Math.round(c * f);
  return {
    bg: `rgb(${mix(r, 0.1) + 6}, ${mix(g, 0.1) + 8}, ${mix(b, 0.1) + 14})`,
    bg2: `rgb(${mix(r, 0.22) + 10}, ${mix(g, 0.22) + 12}, ${mix(b, 0.22) + 22})`,
  };
}

function html(a: Artefatto): string {
  const { bg, bg2 } = fondo(a.accent);
  // L'occhiello sta sul fondo scuro: accento schiarito fino alla soglia AA.
  const ink = inchiostroAccento(a.accent, bg);
  // Il riquadro della sigla: l'accento pieno, a meno che sia così scuro da
  // sparire nel fondo — allora si usa la sua schiaritura.
  const fondoSigla = contrasto(a.accent, bg) < 1.6 ? ink : a.accent;
  // E l'inchiostro della sigla si calcola su QUEL fondo, non sull'accento puro:
  // è l'errore che aveva reso la «D» del MEF scura su blu scuro.
  const inkSigla = contrasto('#ffffff', fondoSigla) >= contrasto(bg, fondoSigla) ? '#ffffff' : bg;
  const svg = marchioCliente(a.slug);
  const brand = svg
    ? `<span style="display:block;height:38px;width:auto;color:#fff">${svg}</span>`
    : `<span style="font:700 30px/1 Inter,system-ui,sans-serif;letter-spacing:-0.01em;color:#fff">${a.client}</span>`;
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap">
  <style>*{margin:0;padding:0;box-sizing:border-box}</style></head><body>
  <div style="width:1200px;height:630px;background:linear-gradient(135deg,${bg} 0%,${bg2} 100%);position:relative;overflow:hidden;font-family:Inter,system-ui,sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:68px 76px">
    <div style="position:absolute;right:-90px;bottom:-150px;width:560px;height:560px;border-radius:50%;background:${a.accent};opacity:0.14"></div>
    <div style="position:relative;display:flex;align-items:center;gap:22px">
      <span style="display:block;width:34px;height:34px;color:#fff">${ADOBE_SVG}</span>
      <span style="font:700 30px/1 Inter;color:rgba(255,255,255,0.42)">×</span>
      ${brand}
      ${a.gated ? `<span style="margin-left:auto;font:700 15px/1 Inter;letter-spacing:0.12em;text-transform:uppercase;color:${bg};background:#d39e00;padding:9px 15px;border-radius:5px">Riservato</span>` : ''}
    </div>
    <div style="position:relative;display:flex;align-items:flex-end;gap:40px">
      <div style="flex-shrink:0;width:152px;height:152px;border-radius:26px;background:${fondoSigla};display:flex;align-items:center;justify-content:center">
        <span style="font:800 ${a.mark.length > 1 ? 68 : 86}px/1 Inter;letter-spacing:-0.04em;color:${inkSigla}">${a.mark}</span>
      </div>
      <div style="min-width:0;padding-bottom:6px">
        <p style="font:600 19px/1 Inter;letter-spacing:0.14em;text-transform:uppercase;color:${ink};margin-bottom:18px">${a.kind}</p>
        <h1 style="font:800 62px/1.04 Inter;letter-spacing:-0.025em;color:#fff">${a.name}</h1>
      </div>
    </div>
  </div></body></html>`;
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.includes('--app') ? args[args.indexOf('--app') + 1] : null;
  const list = args.includes('--list');

  // Il registro dello showcase vince: se un artefatto è lì, la sua riga qui sotto
  // sarebbe una seconda verità che diverge. Si scarta, non si sovrascrive.
  const reg = dalRegistro();
  const noti = new Set(reg.map((a) => a.slug));
  const tutti = [...reg, ...FUORI_REGISTRO.filter((a) => !noti.has(a.slug))];
  const da = only ? tutti.filter((a) => a.slug === only) : tutti;
  if (!da.length) {
    console.error(only ? `nessun artefatto «${only}». Con --list l'elenco.` : 'nessun artefatto.');
    process.exit(2);
  }
  if (list) {
    console.log(`\n${da.length} artefatti:\n`);
    for (const a of da) {
      const svg = marchioCliente(a.slug) ? 'SVG ufficiale' : 'ripiego wordmark';
      console.log(`  ${a.mark.padEnd(3)} ${a.slug.padEnd(30)} ${a.client.padEnd(22)} ${svg}${a.gated ? ' · riservato' : ''}`);
    }
    console.log();
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  let fatti = 0;
  const mancanti: string[] = [];
  for (const a of da) {
    const pub = path.join(REPO, 'apps', a.slug, 'public');
    if (!fs.existsSync(pub)) { mancanti.push(a.slug); continue; }
    await page.setContent(html(a), { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(pub, a.out ?? 'og.png'), type: 'png' });
    const svg = marchioCliente(a.slug) ? '' : ' (wordmark)';
    console.log(`  ✓ ${a.slug.padEnd(30)} ${a.mark.padEnd(3)} ${a.client}${svg}`);
    fatti++;
  }
  await browser.close();
  console.log(`\n${fatti} anteprime scritte in apps/<app>/public/og.png (1200×630).`);
  if (mancanti.length) console.log(`senza cartella public/: ${mancanti.join(', ')}`);
  console.log(`I meta li dichiara il motore: <SocialMeta> nel <head> del layout. Verifica con pnpm audit:og\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
