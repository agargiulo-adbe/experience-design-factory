/**
 * deck-replica — il deck HTML come .pptx MODIFICABILE (stadio 1 di 2: la lettura).
 *
 * PERCHÉ ESISTE ACCANTO A `deck-pptx.ts`
 * `deck-pptx` mette in un .pptx un'immagine per slide: perfetto da proiettare,
 * inutile da modificare. Quando l'experience è la PRIMA VERSIONE di un deck su
 * cui un team lavora in PowerPoint, serve l'opposto: testi veri, card vere,
 * animazioni vere. Questo script legge ogni slide nel browser e ne scrive una
 * descrizione; `scripts/pptx/replica.py` la trasforma in forme native.
 *
 * Il design system resta quello dell'experience (del cliente): è la sua replica,
 * non un deck ricomposto sul template Adobe — vedi la regola «un artefatto, un
 * design system» in CLAUDE.md.
 *
 * COME SI LEGGE UNA SLIDE (1920×1080, reduced-motion = stato finale)
 *   1. SFONDO — la slide fotografata con il contenuto «svuotato»: testo
 *      trasparente, card a colore pieno trasparenti, immagini nascoste. Restano
 *      foto, sfumature, velature e le decorazioni in ::before/::after, che non
 *      hanno un nodo DOM da leggere. È un'immagine sola, sotto tutto.
 *   2. FORME — ogni elemento con un fondo a COLORE PIENO (anche semitrasparente)
 *      o un bordo diventa un rettangolo nativo (raggio, bordo, trasparenza); un
 *      `clip-path: polygon` a 5 o 6 punti diventa una freccia nativa. I fondi a
 *      sfumatura restano nello sfondo.
 *   3. TESTO — ogni blocco che contiene solo contenuto in linea diventa una
 *      casella di testo: run con carattere, corpo, peso, corsivo, colore,
 *      maiuscole, spaziatura, link. Le lingue nascoste non si leggono.
 *   4. IMMAGINI — <img>, <svg>, maschere e fondi `url()` del contenuto: ritaglio
 *      a 2× dello stato reso.
 *   5. ANIMAZIONI — ogni `[data-reveal]` e ogni figlio di `[data-stagger]` è un
 *      gruppo; il gruppo che contiene tutto è la base (compare con la slide).
 *   6. NOTE — da `apps/<app>/src/data/relatore.ts` (NOTE[pagina][id]) se c'è.
 *
 *   DECK_URL=http://127.0.0.1:4521 npx tsx scripts/deck-replica.ts --app <alias> --out <cartella>
 *   uv run --with python-pptx python scripts/pptx/replica.py <cartella> <file.pptx>
 */
import { chromium, type Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROUTE_SETS, CWD_ALIAS } from './lib/deck-routes';

const flag = (n: string): string | undefined => {
  const i = process.argv.indexOf(`--${n}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const asked = flag('app') ?? '';
const app = ROUTE_SETS[asked] ? asked : (CWD_ALIAS[asked] ?? '');
const ROUTES = ROUTE_SETS[app];
if (!ROUTES) throw new Error(`deck-replica: nessun route set per «${asked}»`);
const BASE = process.env.DECK_URL ?? 'http://localhost:4321';
const OUT = resolve(flag('out') ?? `replica-${app}`);
await mkdir(OUT, { recursive: true });

/* Le note del relatore, se l'app le tiene in un file di dati. */
type Nota = { dire: string; attenzione?: string; seChiedono?: string };
let NOTE: Record<string, Record<string, Nota>> = {};
const notePath = resolve(`apps/${app}/src/data/relatore.ts`);
if (existsSync(notePath)) {
  try { NOTE = (await import(pathToFileURL(notePath).href)).NOTE ?? {}; } catch { /* note facoltative */ }
}
const testoNota = (n?: Nota) => !n ? '' : [n.dire, n.attenzione && `Attenzione: ${n.attenzione}`, n.seChiedono && `Se chiedono: ${n.seChiedono}`].filter(Boolean).join('\n');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
const page = await ctx.newPage();

/* ── Il lettore, eseguito nella pagina ───────────────────────────────────── */
const LETTORE = String.raw`
(() => {
  const slide = [...document.querySelectorAll('[data-slide]')].find((s) => !s.hasAttribute('aria-hidden'));
  if (!slide) return null;
  const root = [...slide.children].find((c) => c.matches('div.absolute.inset-0')) || slide;
  const cs = (e) => getComputedStyle(e);
  const vis = (e) => { const s = cs(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width > 0.5 && r.height > 0.5; };
  const alpha = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return 0; const p = m[1].split(/[ ,\/]+/).filter(Boolean); return p.length > 3 ? parseFloat(p[3]) : 1; };
  const rgba = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const BLOCCO = /^(block|flex|grid|list-item|table|flow-root|table-row|table-cell)$/;
  const oggetti = []; let seq = 0;
  const box = (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };

  /* Il gruppo d'animazione: il più vicino [data-reveal] o figlio di [data-stagger]. */
  const unita = [];
  const gruppo = (e) => {
    for (let n = e; n && n !== root.parentElement; n = n.parentElement) {
      const su = n.parentElement && n.parentElement.hasAttribute('data-stagger');
      if (n.hasAttribute && (n.hasAttribute('data-reveal') || su)) {
        let k = unita.indexOf(n); if (k < 0) { unita.push(n); k = unita.length - 1; }
        return k;
      }
    }
    return -1;
  };
  const immagine = (e, s) => e.tagName === 'IMG' || e.tagName === 'svg' || e.tagName === 'CANVAS' || e.tagName === 'VIDEO'
    || (s.maskImage && s.maskImage !== 'none') || (s.webkitMaskImage && s.webkitMaskImage !== 'none')
    || /url\(/.test(s.backgroundImage);
  const soloInLinea = (e) => {
    for (const c of e.querySelectorAll('*')) { if (!vis(c)) continue; const s = cs(c); if (BLOCCO.test(s.display)) return false; if (immagine(c, s)) return false; }
    return true;
  };
  const haTesto = (e) => { const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let t; while ((t = w.nextNode())) { if (t.textContent.trim() && t.parentElement && vis(t.parentElement)) return true; } return false; };

  const runs = (e) => {
    const out = []; const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 1) { if (n.tagName === 'BR' && cs(n.parentElement).display !== 'none') out.push({ br: true }); continue; }
      const p = n.parentElement; if (!p || !vis(p)) continue;
      let hidden = false; for (let x = p; x && x !== e.parentElement; x = x.parentElement) { if (cs(x).display === 'none') { hidden = true; break; } }
      if (hidden) continue;
      let t = n.textContent.replace(/[\t\n\r ]+/g, ' ');
      if (!t) continue;
      const s = cs(p);
      if (s.textTransform === 'uppercase') t = t.toUpperCase();
      const a = p.closest('a');
      out.push({ t, node: n, upper: s.textTransform === 'uppercase', size: parseFloat(s.fontSize), weight: parseInt(s.fontWeight, 10) || 400, italic: s.fontStyle === 'italic',
        color: rgba(s.color), font: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
        ls: s.letterSpacing === 'normal' ? 0 : parseFloat(s.letterSpacing), href: a ? a.href : null,
        u: /underline/.test(s.textDecorationLine) });
    }
    /* GLI A CAPO DEL BROWSER, fissati. Le metriche di PowerPoint non sono quelle
       di Chrome, e \`text-wrap: balance\` non esiste lì: senza questo, un titolo
       su due righe in pagina diventa una riga sola (o tre) nel .pptx. Si misura
       la riga di ogni carattere e si spezza il run dove la riga cambia. */
    const spezzati = []; let lastTop = null;
    for (const r of out) {
      if (r.br || !r.node) { spezzati.push(r); continue; }
      const tn = r.node; const testo = tn.textContent; let buf = '';
      for (let i = 0; i < testo.length; i++) {
        const rg = document.createRange(); rg.setStart(tn, i); rg.setEnd(tn, i + 1);
        const rc = rg.getClientRects()[0];
        const ch = testo[i];
        if (rc && /\S/.test(ch)) {
          if (lastTop !== null && lastTop !== undefined && rc.top > lastTop + rc.height * 0.5) {
            if (buf) spezzati.push({ ...r, t: buf, node: null });
            /* dopo un <br> la riga è già nuova: niente secondo a capo */
            if (!(spezzati.length && spezzati[spezzati.length - 1].br && !buf.trim())) spezzati.push({ br: true, soft: true });
            buf = '';
          }
          lastTop = rc.top;
        }
        buf += ch;
      }
      if (buf) spezzati.push({ ...r, t: buf, node: null });
    }
    out.length = 0;
    for (const r of spezzati) {
      if (r.t !== undefined) { r.t = r.t.replace(/[\t\n\r ]+/g, ' '); if (r.upper) r.t = r.t.toUpperCase(); }
      delete r.node; delete r.upper; out.push(r);
    }
    /* niente spazio prima o dopo un a capo */
    for (let i = 0; i < out.length; i++) {
      if (out[i].br) { if (i > 0 && out[i - 1].t) out[i - 1].t = out[i - 1].t.replace(/ +$/, ''); if (out[i + 1] && out[i + 1].t) out[i + 1].t = out[i + 1].t.replace(/^ +/, ''); }
    }
    /* spazi ai bordi */
    while (out.length && out[0].t !== undefined && !out[0].t.trim()) out.shift();
    if (out.length && out[0].t) out[0].t = out[0].t.replace(/^ +/, '');
    const last = out[out.length - 1]; if (last && last.t) last.t = last.t.replace(/ +$/, '');
    return out.filter((r) => r.br || r.t);
  };

  const visita = (e) => {
    if (!vis(e)) return;
    const s = cs(e);
    if (e !== root && immagine(e, s)) {
      oggetti.push({ k: 'img', ...box(e), g: gruppo(e), id: 'i' + (seq++) });
      e.setAttribute('data-replica-img', '');
      return;
    }
    if (e !== root) {
      const bg = rgba(s.backgroundColor); const pieno = bg && bg[3] > 0.01 && !/gradient/.test(s.backgroundImage);
      const lati = ['Top', 'Right', 'Bottom', 'Left'].map((l) => ({ l, w: parseFloat(s['border' + l + 'Width']) || 0, c: rgba(s['border' + l + 'Color']) }))
        .filter((b) => b.w > 0 && b.c && b.c[3] > 0 && s['border' + b.l + 'Style'] !== 'none');
      const clip = s.clipPath && s.clipPath.startsWith('polygon') ? s.clipPath.split(',').length : 0;
      if (pieno || lati.length) {
        oggetti.push({ k: 'box', ...box(e), g: gruppo(e), fill: pieno ? bg : null,
          radius: parseFloat(s.borderTopLeftRadius) || 0, lati, clip, first: clip === 5 });
        e.setAttribute('data-replica-box', '');
      }
    }
    if (haTesto(e) && soloInLinea(e) && e !== root) {
      const r = document.createRange(); r.selectNodeContents(e); const rr = r.getBoundingClientRect();
      const b = e.getBoundingClientRect();
      const pl = parseFloat(s.paddingLeft) + parseFloat(s.borderLeftWidth), pr = parseFloat(s.paddingRight) + parseFloat(s.borderRightWidth);
      const lh = s.lineHeight === 'normal' ? parseFloat(s.fontSize) * 1.36 : parseFloat(s.lineHeight);
      /* Un contenitore che CENTRA il suo testo con la griglia o il flex
         (il numero nel cerchio) in PowerPoint si centra sul riquadro intero. */
      const centra = /grid|flex/.test(s.display) && /center/.test(s.alignItems) && (/center/.test(s.justifyItems) || /center/.test(s.justifyContent));
      oggetti.push(centra
        ? { k: 'text', x: b.left, y: b.top, w: b.width, h: b.height, g: gruppo(e), align: 'center', middle: true, lh, runs: runs(e) }
        : { k: 'text', x: b.left + pl, y: rr.top, w: b.width - pl - pr, h: rr.height, g: gruppo(e), align: s.textAlign, lh, runs: runs(e) });
      return;
    }
    for (const c of e.children) visita(c);
  };
  visita(root);
  /* Il gruppo che contiene tutti gli altri è la base: compare con la slide. */
  const base = unita.findIndex((u) => unita.every((v) => v === u || u.contains(v)) && oggetti.every((o) => o.g === -1 || unita[o.g] === u || u.contains(unita[o.g])));
  for (const o of oggetti) if (o.g === base) o.g = -1;
  /* ordine dei gruppi = ordine nel documento */
  const usati = [...new Set(oggetti.map((o) => o.g).filter((g) => g >= 0))];
  usati.sort((a, b) => (unita[a].compareDocumentPosition(unita[b]) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
  for (const o of oggetti) o.g = o.g < 0 ? -1 : usati.indexOf(o.g);
  return { id: slide.id, oggetti };
})()
`;

/* Lo sfondo: si spegne tutto ciò che diventerà nativo. */
const SVUOTA = `
  document.documentElement.setAttribute('data-replica', '');
  const st = document.createElement('style'); st.id = 'replica-svuota';
  st.textContent = \`
    [data-replica] .ex-nav, [data-replica] .deck-chrome, [data-replica] .edf-cobrand--chrome, [data-replica] .edf-madewith { visibility: hidden !important; }
    [data-replica] [data-slide] * { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; text-decoration-color: transparent !important; caret-color: transparent !important; }
    [data-replica] [data-replica-box] { background-color: transparent !important; border-color: transparent !important; }
    [data-replica] [data-replica-img] { visibility: hidden !important; }
  \`;
  document.head.appendChild(st);
`;
const RIPRISTINA = `document.getElementById('replica-svuota')?.remove(); document.documentElement.removeAttribute('data-replica');
  document.querySelectorAll('[data-replica-box],[data-replica-img]').forEach((e) => { e.removeAttribute('data-replica-box'); e.removeAttribute('data-replica-img'); });`;

const manifest: unknown[] = [];
let n = 0;
for (const rotta of ROUTES) {
  await page.goto(BASE + rotta.route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const pagina = rotta.name === 'home' ? 'index' : rotta.route.replace(/\/$/, '').split('/').pop()!;
  const tot = await page.evaluate(() => document.querySelectorAll('[data-slide]').length);
  for (let i = 0; i < tot; i++) {
    await page.evaluate((k) => (window as any).__edfDeck?.goTo(k), i);
    await page.waitForTimeout(900);
    n++;
    const letto = await page.evaluate(LETTORE) as { id: string; oggetti: any[] } | null;
    if (!letto) continue;
    // immagini: ritaglio dello stato reso
    for (const o of letto.oggetti.filter((x) => x.k === 'img')) {
      const f = `s${n}-${o.id}.png`;
      await page.screenshot({ path: join(OUT, f), clip: { x: o.x, y: o.y, width: o.w, height: o.h }, omitBackground: false });
      o.file = f;
    }
    // la firma fissa (co-brand) e il credito, se visibili: si portano come immagini
    const chrome = await page.evaluate(() => [...document.querySelectorAll('.edf-cobrand--chrome, .edf-madewith')].map((e) => {
      const s = getComputedStyle(e); const r = e.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05 && r.width > 1 ? { x: r.left, y: r.top, w: r.width, h: r.height } : null;
    }).filter(Boolean));
    let c = 0;
    for (const r of chrome as any[]) {
      const f = `s${n}-chrome${c++}.png`;
      await page.screenshot({ path: join(OUT, f), clip: { x: r.x, y: r.y, width: r.w, height: r.h } });
      letto.oggetti.push({ k: 'img', ...r, g: -1, file: f, chrome: true });
    }
    // lo sfondo, svuotato
    await page.evaluate(SVUOTA);
    await page.waitForTimeout(150);
    const bg = `s${n}-bg.jpg`;
    await page.screenshot({ path: join(OUT, bg), type: 'jpeg', quality: 90 });
    await page.evaluate(RIPRISTINA);
    manifest.push({ n, pagina, id: letto.id, bg, oggetti: letto.oggetti, note: testoNota(NOTE[pagina]?.[letto.id]) });
    process.stdout.write(`  ${pagina} · ${letto.id}: ${letto.oggetti.length} oggetti\n`);
  }
}
await browser.close();
await writeFile(join(OUT, 'manifest.json'), JSON.stringify({ w: 1920, h: 1080, slides: manifest }, null, 1));
console.log(`deck-replica: ${n} slide → ${OUT}/manifest.json`);
