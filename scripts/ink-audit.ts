/**
 * ink-audit — il contrasto del TESTO, misurato sui pixel che si vedono.
 *
 * Perché esiste. Il check `h` di `deck-audit` guarda i bottoni e le CTA: è nato per
 * quelli. Il testo di una slide non lo guarda nessuno, e in una skin a dominante
 * ribaltata è proprio lì che le cose si rompono — un titolo che eredita
 * `--ink-inverse` su una superficie che nel frattempo è diventata scura esce
 * ardesia su ardesia, passa tutti gli undici check e in sala non si legge.
 * Successo su questa Prospettiva: la copertina di capitolo era illeggibile mentre
 * `audit:deck` stampava 0 HARD.
 *
 * Come misura. Niente CSS: per ogni blocco di testo ritaglia il suo rettangolo dallo
 * screenshot e guarda i pixel. Il colore di fondo è quello MODALE del ritaglio; il
 * colore del testo è il pixel più lontano dal fondo (su un glifo antialiasato è il
 * cuore della lettera). Così il gradiente, lo scrim e il backdrop sono già dentro la
 * misura, che è esattamente il problema dei contrasti calcolati sul CSS.
 *
 * Soglie WCAG 2.2 AA: 4,5:1 per il testo normale, 3:1 per il testo grande
 * (≥ 24px, oppure ≥ 18,66px se grassetto).
 *
 *   DECK_URL=http://localhost:4592 npx tsx scripts/ink-audit.ts --app <alias>
 *   … --only <rotta[,rotta]>      una pagina sola, mentre la si sistema
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { ROUTE_SETS, CWD_ALIAS } from './lib/deck-routes';

const flag = (name: string): string | undefined => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const appFlag = flag('app') ?? CWD_ALIAS[process.cwd().split('/').pop() ?? ''] ?? 'maxmara';
const ROUTE_SET = ROUTE_SETS[appFlag];
if (!ROUTE_SET) throw new Error(`ink-audit: nessun route set per «${appFlag}»`);
const only = flag('only');
const ROUTES = only ? ROUTE_SET.filter((r) => only.split(',').includes(r.name)) : ROUTE_SET;
if (!ROUTES.length) throw new Error(`ink-audit: --only ${only} non seleziona nessuna rotta`);

const BASE = process.env.DECK_URL ?? 'http://localhost:4321';
const VIEWPORT = { width: 1920, height: 1080 };

type RGB = [number, number, number];
const srgb = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]: RGB) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a: RGB, b: RGB) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const dist = (a: RGB, b: RGB) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const hex = (c: RGB) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');

/** Fondo = colore modale del ritaglio. Testo = il pixel più lontano dal fondo. */
function inkAndPaper(png: PNG): { ink: RGB; paper: RGB; coverage: number } {
  const bins = new Map<string, { n: number; c: RGB }>();
  const px: RGB[] = [];
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < 128) continue;
    const c: RGB = [png.data[i], png.data[i + 1], png.data[i + 2]];
    px.push(c);
    const k = `${c[0] >> 3}|${c[1] >> 3}|${c[2] >> 3}`;      // bin da 8 livelli: il gradiente non frantuma il modo
    const b = bins.get(k);
    if (b) b.n++; else bins.set(k, { n: 1, c });
  }
  if (!px.length) return { ink: [0, 0, 0], paper: [255, 255, 255], coverage: 0 };
  const paper = [...bins.values()].sort((a, b) => b.n - a.n)[0].c;
  let ink = paper, best = -1;
  for (const c of px) { const d = dist(c, paper); if (d > best) { best = d; ink = c; } }
  const coverage = px.filter((c) => dist(c, paper) > best * 0.5).length / px.length;
  return { ink, paper, coverage };
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await ctx.newPage();
let findings = 0, measured = 0;

for (const rotta of ROUTES) {
  await page.goto(BASE + rotta.route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const slides = await page.$$('[data-slide]');
  for (let i = 0; i < slides.length; i++) {
    await page.evaluate((n) => (window as unknown as { __edfDeck: { goTo(k: number): void } }).__edfDeck.goTo(n), i);
    await page.waitForTimeout(260);
    const id = (await slides[i].getAttribute('id')) || `#${i}`;

    const blocks = await page.evaluate((n) => {
      const slide = document.querySelectorAll('[data-slide]')[n] as HTMLElement;
      const out: Array<{ t: string; x: number; y: number; w: number; h: number; size: number; bold: boolean }> = [];
      slide.querySelectorAll('*').forEach((el) => {
        const e = el as HTMLElement;
        if (e.closest('[aria-hidden="true"]')) return;
        const direct = [...e.childNodes].filter((c) => c.nodeType === 3 && (c.textContent || '').trim()).length;
        if (!direct) return;
        const cs = getComputedStyle(e);
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.1) return;
        const r = e.getBoundingClientRect();
        if (r.width < 24 || r.height < 10) return;
        const size = parseFloat(cs.fontSize);
        if (size < 11) return;
        out.push({
          t: (e.textContent || '').trim().slice(0, 42), x: r.x, y: r.y, w: r.width, h: r.height,
          size, bold: +cs.fontWeight >= 700,
        });
      });
      return out;
    }, i);

    for (const b of blocks) {
      const clip = {
        x: Math.max(0, Math.round(b.x)), y: Math.max(0, Math.round(b.y)),
        width: Math.min(VIEWPORT.width - Math.round(b.x), Math.round(b.w)),
        height: Math.min(VIEWPORT.height - Math.round(b.y), Math.round(b.h)),
      };
      if (clip.width < 8 || clip.height < 6) continue;
      const png = PNG.sync.read(await page.screenshot({ clip }));
      const { ink, paper, coverage } = inkAndPaper(png);
      if (coverage < 0.004) continue;              // ritaglio praticamente vuoto
      const large = b.size >= 24 || (b.bold && b.size >= 18.66);
      const need = large ? 3 : 4.5;
      const got = ratio(ink, paper);
      measured++;
      if (got < need) {
        findings++;
        console.log(`✗ ${rotta.name} · ${id} — ${got.toFixed(2)}:1 (serve ${need}) ${hex(ink)} su ${hex(paper)}`);
        console.log(`     «${b.t}»  ${b.size.toFixed(0)}px${b.bold ? ' bold' : ''}`);
      }
    }
  }
}
await browser.close();
console.log(`\nBlocchi di testo misurati: ${measured} su ${ROUTES.length} rotte a ${VIEWPORT.width}×${VIEWPORT.height}`);
if (findings) { console.log(`${findings} blocco/blocchi sotto la soglia AA.`); process.exit(1); }
console.log('PULITO — ogni blocco di testo regge il contrasto AA sul fondo che ha davvero.');
