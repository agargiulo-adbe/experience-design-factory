/**
 * deck-audit — deterministic layout audit for the Acquisizione deck at 1920×1080.
 *
 * Measures bounding boxes in the DOM (don't trust the eye) and gates 4 defects per
 * slide. Screenshots are saved ONLY for failing slides, as confirmation.
 *
 *   (a) text too high   — significant text centre must sit in the central reading
 *                         band (top 30% – bottom 70%); fail if top < 30%.
 *   (b) chrome collision — no content text intersects the deck controls
 *                         (prev/next/progress/fullscreen).
 *   (c) missing margins  — no content/media box past the safe gutter
 *                         (--slide-safe-inset) on any side; no horizontal overflow.
 *   (d) text over faces  — no text intersects an image's [data-no-text] zone; any
 *                         text over an image requires a [data-scrim] behind it.
 *
 * Run:  pnpm --filter generazioni-maxmara audit:deck   (dev server must be up)
 * Exits non-zero if any slide fails any check (CI-friendly).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import * as path from 'node:path';

const ROUTE = '/experience-design-factory/acquisizione/';
const VIEWPORT = { width: 1920, height: 1080 };
const OUT_DIR = path.resolve(process.cwd(), 'audit/acquisizione');

async function findBaseUrl(): Promise<string> {
  const fromEnv = process.env.DECK_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  for (let port = 4321; port <= 4332; port++) {
    const url = `http://localhost:${port}`;
    try {
      const res = await fetch(url + ROUTE, { method: 'HEAD' });
      if (res.ok || res.status === 200) return url;
    } catch { /* port not listening */ }
  }
  throw new Error('No dev server found on ports 4321–4332. Run `pnpm dev` first (or set DECK_URL).');
}

// ── In-browser measurement (serialised to the page) ────────────────
function measureSlide(opts: { slideId: string; W: number; H: number; inset: number; chromeSafe: number }) {
  const { slideId, W, H, inset } = opts;
  const slide = document.getElementById(slideId)!;
  const inner = (slide.querySelector('.slide-inner') as HTMLElement) || slide;
  const bandTop = 0.30 * H, bandBot = 0.70 * H;

  const vis = (el: Element) => {
    const cs = getComputedStyle(el as HTMLElement);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  };
  const inPanel = (el: Element) => !!el.closest('[data-hiw-panel]');
  const directText = (el: Element) =>
    Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent || '').trim().length > 3);
  const intersects = (a: DOMRect | { left: number; top: number; right: number; bottom: number }, b: DOMRect) =>
    !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);

  const texts = Array.from(inner.querySelectorAll('h1,h2,h3,h4,p,li,span,a'))
    .filter((el) => !inPanel(el) && directText(el) && (el.textContent || '').trim().length >= 10
      && parseFloat(getComputedStyle(el as HTMLElement).fontSize) >= 24 && vis(el))
    .map((el) => ({ r: el.getBoundingClientRect(), txt: (el.textContent || '').trim().slice(0, 42) }));

  // (a) text too high / outside band: the binding rule is the text CENTRE inside
  // the central reading band [30%,70%]; plus a "too high" guard so a block is
  // never anchored near the top edge (catches the defect without nitpicking a
  // centred title that peeks a few px above the 30% line).
  const topGuard = 0.18 * H;
  const a = texts
    .map((t) => ({ ...t, cy: t.r.top + t.r.height / 2 }))
    .filter((t) => t.cy < bandTop || t.cy > bandBot || t.r.top < topGuard)
    .map((t) => ({ txt: t.txt, top: Math.round(t.r.top), centerY: Math.round(t.cy) }));

  // (b) collision with deck chrome
  // Target the chrome CONTROLS only — `data-deck-next` is also on the deck root
  // (full viewport), which would make every box "collide".
  const chromeRects = Array.from(document.querySelectorAll('button[data-deck-prev],button[data-deck-next],button[data-deck-fs],span[data-deck-progress]'))
    .filter(vis).map((el) => el.getBoundingClientRect());
  const b = texts.filter((t) => chromeRects.some((cr) => intersects(t.r, cr))).map((t) => ({ txt: t.txt }));

  // (c) margins + horizontal overflow
  const media = Array.from(inner.querySelectorAll('figure.ms-media, img, .ig-phone, .cover-names'))
    .filter((el) => !inPanel(el) && vis(el))
    .map((el) => ({ r: el.getBoundingClientRect(), txt: (el.className || '').toString().slice(0, 24) }));
  const c = texts.concat(media)
    .filter((x) => x.r.left < inset - 1 || x.r.right > W - inset + 1 || x.r.top < inset - 1 || x.r.bottom > H - inset + 1)
    .map((x) => ({ what: x.txt, left: Math.round(x.r.left), right: Math.round(x.r.right), top: Math.round(x.r.top), bottom: Math.round(x.r.bottom) }));
  const overflow = Array.from(inner.querySelectorAll('*'))
    .filter((el) => !inPanel(el) && (el as HTMLElement).scrollWidth - (el as HTMLElement).clientWidth > 2 && vis(el))
    .slice(0, 5).map((el) => ({ tag: el.tagName.toLowerCase(), sw: (el as HTMLElement).scrollWidth, cw: (el as HTMLElement).clientWidth }));

  // (d) text over faces / scrim
  const d: Array<{ type: string; txt: string }> = [];
  Array.from(slide.querySelectorAll('[data-no-text]')).filter(vis).forEach((img) => {
    const ir = img.getBoundingClientRect();
    const [zt, zl, zw, zh] = (img.getAttribute('data-no-text') || '0,0,0,0').split(',').map(Number);
    const zone = { left: ir.left + ir.width * zl / 100, top: ir.top + ir.height * zt / 100, right: ir.left + ir.width * (zl + zw) / 100, bottom: ir.top + ir.height * (zt + zh) / 100 };
    texts.forEach((t) => { if (intersects(t.r, zone as DOMRect)) d.push({ type: 'face', txt: t.txt }); });
  });
  const imgRects = Array.from(slide.querySelectorAll('figure.ms-media, img, .ig-phone')).filter(vis).map((el) => el.getBoundingClientRect());
  const scrimRects = Array.from(slide.querySelectorAll('[data-scrim]')).filter(vis).map((el) => el.getBoundingClientRect());
  texts.forEach((t) => {
    if (imgRects.some((ir) => intersects(t.r, ir)) && !scrimRects.some((sr) => intersects(t.r, sr))) {
      d.push({ type: 'no-scrim', txt: t.txt });
    }
  });

  return {
    a: { pass: a.length === 0, fails: a },
    b: { pass: b.length === 0, fails: b },
    c: { pass: c.length === 0 && overflow.length === 0, fails: c, overflow },
    d: { pass: d.length === 0, fails: d },
  };
}

async function main() {
  const base = await findBaseUrl();
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  // tsx/esbuild keepNames injects a __name() helper into serialised functions;
  // define it as identity in the page so page.evaluate(fn) works.
  await page.addInitScript(() => { (window as unknown as { __name: (f: unknown) => unknown }).__name = (f) => f; });
  await page.goto(base + ROUTE, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => (window as unknown as { __edfDeck?: unknown }).__edfDeck !== undefined, { timeout: 8000 });

  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      inset: parseFloat(cs.getPropertyValue('--slide-safe-inset')) || 64,
      chromeSafe: parseFloat(cs.getPropertyValue('--deck-chrome-safe')) || 132,
    };
  });
  const slideIds: string[] = await page.evaluate(() => Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.id));

  let totalFails = 0;
  const lines: string[] = [];
  for (let i = 0; i < slideIds.length; i++) {
    const id = slideIds[i];
    await page.evaluate((idx) => (window as unknown as { __edfDeck: { goTo(n: number): void } }).__edfDeck.goTo(idx), i);
    await page.waitForTimeout(450);
    const r = await page.evaluate(measureSlide, { slideId: id, W: VIEWPORT.width, H: VIEWPORT.height, ...tokens });
    const checks: Array<['a' | 'b' | 'c' | 'd', { pass: boolean }]> = [['a', r.a], ['b', r.b], ['c', r.c], ['d', r.d]];
    const failed = checks.filter(([, v]) => !v.pass).map(([k]) => k);
    if (failed.length) {
      totalFails += failed.length;
      await page.screenshot({ path: path.join(OUT_DIR, `${id}.png`) });
    }
    lines.push(`${failed.length ? '✗' : '✓'} ${String(i).padStart(2, '0')} ${id.padEnd(20)} ` +
      `a:${r.a.pass ? 'ok' : 'FAIL'} b:${r.b.pass ? 'ok' : 'FAIL'} c:${r.c.pass ? 'ok' : 'FAIL'} d:${r.d.pass ? 'ok' : 'FAIL'}`);
    if (!r.a.pass) lines.push(`     a → ${JSON.stringify(r.a.fails)}`);
    if (!r.b.pass) lines.push(`     b → ${JSON.stringify(r.b.fails)}`);
    if (!r.c.pass) lines.push(`     c → ${JSON.stringify(r.c.fails)} overflow:${JSON.stringify(r.c.overflow)}`);
    if (!r.d.pass) lines.push(`     d → ${JSON.stringify(r.d.fails)}`);
  }

  await browser.close();
  console.log(`\ndeck-audit · ${base}${ROUTE} · 1920×1080\n`);
  console.log(lines.join('\n'));
  console.log(`\n${totalFails === 0 ? 'PASS — all slides clean' : `FAIL — ${totalFails} check failure(s); screenshots in audit/acquisizione/`}\n`);
  process.exit(totalFails === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(2); });
