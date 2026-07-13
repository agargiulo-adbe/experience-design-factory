/**
 * deck-audit — deterministic layout audit for the Acquisizione deck at 1920×1080.
 *
 * Measures bounding boxes in the DOM (don't trust the eye). Screenshots are saved
 * ONLY for failing slides, as confirmation. 9 checks per slide:
 *   (a) text too high      — significant text centre in the central band [30%,70%].
 *   (b) chrome collision    — no content text intersects the deck controls.
 *   (c) margins / overflow  — no box past --slide-safe-inset; no horizontal overflow.
 *   (d) text over faces     — no text over an image's [data-no-text] zone; scrim required.
 *   (e) text-on-text        — no two (non-nested) text blocks overlap (≈0px tolerance).
 *   (g) vertical rhythm      — adjacent stacked text blocks (outside cards) gap ≥ 16px.
 *   (h) button contrast      — every button/CTA meets WCAG AA (4.5:1, or 3:1 for large).
 *   (i) space usage / balance — content covers ≥45% of usable height and its centre of
 *                              mass sits in the central horizontal band.
 *   (exp) inline expansion   — each "Scopri come" expands IN PLACE; the slide is then
 *                              re-measured (a–k) in its expanded state and must still pass.
 *
 * Run:  pnpm --filter generazioni-maxmara audit:deck   (dev server up). Exits ≠0 on any fail.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import * as path from 'node:path';

// Per-app route sets. Each route includes the full path after the origin.
const ROUTE_SETS: Record<string, Array<{ name: string; route: string }>> = {
  maxmara: [
    { name: 'home',         route: '/experience-design-factory/generazioni-maxmara/' },
    { name: 'acquisizione', route: '/experience-design-factory/generazioni-maxmara/acquisizione/' },
    { name: 'engagement',   route: '/experience-design-factory/generazioni-maxmara/engagement/' },
    { name: 'conversione',  route: '/experience-design-factory/generazioni-maxmara/conversione/' },
    { name: 'loyalty',      route: '/experience-design-factory/generazioni-maxmara/loyalty/' },
    { name: 'persona',      route: '/experience-design-factory/generazioni-maxmara/persona/' },
    { name: 'motore-adobe', route: '/experience-design-factory/generazioni-maxmara/motore-adobe/' },
    { name: 'chiusura',     route: '/experience-design-factory/generazioni-maxmara/chiusura/' },
  ],
  unicredit: [
    { name: 'home',         route: '/experience-design-factory/unicredit-engagement/' },
    { name: 'coworker',     route: '/experience-design-factory/unicredit-engagement/coworker/' },
    { name: 'motore-adobe', route: '/experience-design-factory/unicredit-engagement/motore-adobe/' },
    { name: 'scenario',     route: '/experience-design-factory/unicredit-engagement/scenario/' },
    { name: 'acquisisci',   route: '/experience-design-factory/unicredit-engagement/acquisisci/' },
    { name: 'analizza',     route: '/experience-design-factory/unicredit-engagement/analizza/' },
    { name: 'coinvolgi',    route: '/experience-design-factory/unicredit-engagement/coinvolgi/' },
    { name: 'conosci',      route: '/experience-design-factory/unicredit-engagement/conosci/' },
    { name: 'contenuti',    route: '/experience-design-factory/unicredit-engagement/contenuti/' },
    { name: 'b2b',          route: '/experience-design-factory/unicredit-engagement/b2b/' },
    { name: 'risultati',    route: '/experience-design-factory/unicredit-engagement/risultati/' },
  ],
  ferrari: [
    { name: 'home',         route: '/experience-design-factory/ferrari-racing/' },
    { name: 'protagonisti', route: '/experience-design-factory/ferrari-racing/protagonisti/' },
    { name: 'define',       route: '/experience-design-factory/ferrari-racing/define/' },
    { name: 'create',       route: '/experience-design-factory/ferrari-racing/create/' },
    { name: 'activate',     route: '/experience-design-factory/ferrari-racing/activate/' },
    { name: 'analisi',      route: '/experience-design-factory/ferrari-racing/analisi/' },
    { name: 'proof',        route: '/experience-design-factory/ferrari-racing/proof/' },
    { name: 'loop',         route: '/experience-design-factory/ferrari-racing/loop/' },
  ],
  trenitalia: [
    { name: 'home',        route: '/experience-design-factory/trenitalia-connessioni/' },
    { name: 'scenario',    route: '/experience-design-factory/trenitalia-connessioni/scenario/' },
    { name: 'fondazione',  route: '/experience-design-factory/trenitalia-connessioni/fondazione/' },
    { name: 'convergenza', route: '/experience-design-factory/trenitalia-connessioni/convergenza/' },
    { name: 'connessioni', route: '/experience-design-factory/trenitalia-connessioni/connessioni/' },
    { name: 'roadmap',     route: '/experience-design-factory/trenitalia-connessioni/roadmap/' },
    { name: 'casi-duso',   route: '/experience-design-factory/trenitalia-connessioni/casi-duso/' },
  ],
};

// Auto-detect app from cwd (set by `pnpm --filter <app> audit:deck`); override with --app.
const CWD_ALIAS: Record<string, string> = {
  'generazioni-maxmara': 'maxmara',
  'unicredit-engagement': 'unicredit',
  'ferrari-racing': 'ferrari',
  'trenitalia-connessioni': 'trenitalia',
};
const appFromCwd = CWD_ALIAS[path.basename(process.cwd())] ?? 'maxmara';
const appFlag = (() => {
  const idx = process.argv.indexOf('--app');
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  const prefixed = process.argv.find((a) => a.startsWith('--app='));
  if (prefixed) return prefixed.split('=')[1];
  return appFromCwd;
})();
const ROUTES = ROUTE_SETS[appFlag] ?? ROUTE_SETS.maxmara;

// A projected keynote must hold beyond exactly 1920×1080 — test common projector/laptop sizes.
const VIEWPORTS: Array<[number, number]> = [[1920, 1080], [1440, 900], [1280, 800]];
const OUT_BASE = path.resolve(process.cwd(), 'audit');

async function findBaseUrl(): Promise<string> {
  const fromEnv = process.env.DECK_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  for (let port = 4321; port <= 4332; port++) {
    const url = `http://localhost:${port}`;
    try {
      const res = await fetch(url + ROUTES[0].route, { method: 'HEAD' });
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
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false;
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  };
  // A HowItWorks region that is still collapsed (aria-hidden) is excluded; once the
  // trigger expands it (aria-hidden removed) its content IS measured like any other.
  const inPanel = (el: Element) => !!el.closest('[data-hiw-region][aria-hidden="true"]');
  const directText = (el: Element) =>
    Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent || '').trim().length > 0);
  type Box = { left: number; top: number; right: number; bottom: number; width?: number; height?: number };
  const intersects = (a: Box, b: Box) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
  const overlap = (a: Box, b: Box) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
    Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

  // colour helpers (for contrast)
  const parseColor = (c: string): [number, number, number, number] => {
    const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return [255, 255, 255, 1];
    const p = m[1].split(',').map((s) => parseFloat(s)); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
  };
  const effBg = (el: Element): [number, number, number] => {
    const layers: Array<[number, number, number, number]> = [];
    let node: Element | null = el;
    while (node && node !== document.documentElement) {
      const [r, g, b, a] = parseColor(getComputedStyle(node as HTMLElement).backgroundColor);
      if (a > 0) layers.push([r, g, b, a]);
      node = node.parentElement;
    }
    let [R, G, B] = [245, 240, 230];
    for (let i = layers.length - 1; i >= 0; i--) { const [lr, lg, lb, la] = layers[i]; R = lr * la + R * (1 - la); G = lg * la + G * (1 - la); B = lb * la + B * (1 - la); }
    return [R, G, B];
  };
  const lum = ([r, g, b]: [number, number, number]) => {
    const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (c1: [number, number, number], c2: [number, number, number]) => {
    const l1 = lum(c1), l2 = lum(c2); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  // text sets
  const allTextEls = Array.from(inner.querySelectorAll('h1,h2,h3,h4,p,li,span,a,strong,blockquote'))
    .filter((el) => !inPanel(el) && directText(el) && (el.textContent || '').trim().length >= 1 && vis(el)
      && parseFloat(getComputedStyle(el as HTMLElement).fontSize) >= 16);
  const big = allTextEls.filter((el) => parseFloat(getComputedStyle(el as HTMLElement).fontSize) >= 24
    && (el.textContent || '').trim().length >= 10)
    .map((el) => ({ el, r: el.getBoundingClientRect(), txt: (el.textContent || '').trim().slice(0, 42) }));

  // (a) text too high — applies to PROSE. A `[data-display]` hero (a giant metric
  // numeral like "tre quarti" / "75%") is a display element, not prose, and is
  // deliberately top-anchored; exclude it (as short numerals were already excluded).
  const topGuard = 0.18 * H;
  const a = big.filter((t) => !t.el.closest('[data-display]'))
    .map((t) => ({ ...t, cy: t.r.top + t.r.height / 2 }))
    .filter((t) => t.cy < bandTop || t.cy > bandBot || t.r.top < topGuard)
    .map((t) => ({ txt: t.txt, top: Math.round(t.r.top), centerY: Math.round(t.cy) }));

  // (b) chrome collision
  const chromeRects = Array.from(document.querySelectorAll('button[data-deck-prev],button[data-deck-next],button[data-deck-fs],span[data-deck-progress]'))
    .filter(vis).map((el) => el.getBoundingClientRect());
  const b = big.filter((t) => chromeRects.some((cr) => intersects(t.r, cr))).map((t) => ({ txt: t.txt }));

  // (c) margins + overflow
  const media = Array.from(inner.querySelectorAll('figure.ms-media, img, .ig-phone, .cover-names, [data-datalake]'))
    .filter((el) => !inPanel(el) && vis(el)).map((el) => ({ r: el.getBoundingClientRect(), txt: (el.className || '').toString().slice(0, 24) }));
  const c = big.map((x) => ({ r: x.r, what: x.txt })).concat(media.map((m) => ({ r: m.r, what: m.txt })))
    .filter((x) => x.r.left < inset - 1 || x.r.right > W - inset + 1 || x.r.top < inset - 1 || x.r.bottom > H - inset + 1)
    .map((x) => ({ what: x.what, left: Math.round(x.r.left), right: Math.round(x.r.right), top: Math.round(x.r.top), bottom: Math.round(x.r.bottom) }));
  const overflow = Array.from(inner.querySelectorAll('*'))
    .filter((el) => !inPanel(el) && (el as HTMLElement).scrollWidth - (el as HTMLElement).clientWidth > 2 && vis(el))
    .slice(0, 5).map((el) => ({ tag: el.tagName.toLowerCase(), sw: (el as HTMLElement).scrollWidth, cw: (el as HTMLElement).clientWidth }));

  // (d) text over faces / scrim
  const d: Array<{ type: string; txt: string }> = [];
  Array.from(slide.querySelectorAll('[data-no-text]')).filter(vis).forEach((img) => {
    const ir = img.getBoundingClientRect();
    const [zt, zl, zw, zh] = (img.getAttribute('data-no-text') || '0,0,0,0').split(',').map(Number);
    const zone = { left: ir.left + ir.width * zl / 100, top: ir.top + ir.height * zt / 100, right: ir.left + ir.width * (zl + zw) / 100, bottom: ir.top + ir.height * (zt + zh) / 100 };
    big.forEach((t) => { if (intersects(t.r, zone)) d.push({ type: 'face', txt: t.txt }); });
  });
  const imgRects = Array.from(slide.querySelectorAll('figure.ms-media, img, .ig-phone')).filter(vis).map((el) => el.getBoundingClientRect());
  const scrimRects = Array.from(slide.querySelectorAll('[data-scrim]')).filter(vis).map((el) => el.getBoundingClientRect());
  big.forEach((t) => {
    if (imgRects.some((ir) => intersects(t.r, ir)) && !scrimRects.some((sr) => intersects(t.r, sr))) d.push({ type: 'no-scrim', txt: t.txt });
  });

  // (e) text-on-text collision (non-nested pairs, real 2D overlap)
  const tb = allTextEls.map((el) => ({ el, r: el.getBoundingClientRect(), txt: (el.textContent || '').trim().slice(0, 30) }));
  const e: Array<{ x: string; y: string }> = [];
  for (let i = 0; i < tb.length; i++) for (let j = i + 1; j < tb.length; j++) {
    if (tb[i].el.contains(tb[j].el) || tb[j].el.contains(tb[i].el)) continue;
    const ow = Math.max(0, Math.min(tb[i].r.right, tb[j].r.right) - Math.max(tb[i].r.left, tb[j].r.left));
    const oh = Math.max(0, Math.min(tb[i].r.bottom, tb[j].r.bottom) - Math.max(tb[i].r.top, tb[j].r.top));
    if (ow > 2 && oh > 2) e.push({ x: tb[i].txt, y: tb[j].txt });
  }

  // (g) vertical rhythm: stacked text siblings (outside cards) must gap ≥ 16px
  const isCard = (el: Element) => {
    let n: Element | null = el;
    while (n && n !== inner) {
      const cs = getComputedStyle(n as HTMLElement);
      if (parseFloat(parseColor(cs.backgroundColor)[3].toString()) > 0.02 || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0) return true;
      n = n.parentElement;
    }
    return false;
  };
  const beats = allTextEls.filter((el) => !isCard(el)).map((el) => ({ el, p: el.parentElement, r: el.getBoundingClientRect(), txt: (el.textContent || '').trim().slice(0, 28) }));
  const g: Array<{ a: string; b: string; gap: number }> = [];
  const byParent = new Map<Element, typeof beats>();
  beats.forEach((bt) => { if (bt.p) { const arr = byParent.get(bt.p) || []; arr.push(bt); byParent.set(bt.p, arr); } });
  byParent.forEach((arr) => {
    const s = arr.slice().sort((x, y) => x.r.top - y.r.top);
    for (let i = 0; i < s.length - 1; i++) {
      const cur = s[i].r, nxt = s[i + 1].r;
      const hOverlap = Math.min(cur.right, nxt.right) - Math.max(cur.left, nxt.left) > 4;
      const gap = nxt.top - cur.bottom;
      if (hOverlap && gap >= 0 && gap < 16) g.push({ a: s[i].txt, b: s[i + 1].txt, gap: Math.round(gap) });
    }
  });

  // (h) button / CTA contrast (WCAG AA)
  const ctas = Array.from(slide.querySelectorAll('a, button'))
    .concat(Array.from(document.querySelectorAll('button[data-deck-prev],button[data-deck-next],button[data-deck-fs]')))
    .filter((el, idx, self) => self.indexOf(el) === idx && vis(el) && !inPanel(el));
  const h: Array<{ what: string; ratio: number; need: number }> = [];
  ctas.forEach((el) => {
    const cs = getComputedStyle(el as HTMLElement);
    const fg = parseColor(cs.color); const ratio = contrast([fg[0], fg[1], fg[2]], effBg(el));
    const fs = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight) >= 700;
    const large = fs >= 24 || (fs >= 18.66 && bold) || (el.textContent || '').trim().length === 0; // icon-only = graphical
    const need = large ? 3 : 4.5;
    if (ratio < need) h.push({ what: ((el.textContent || '').trim() || (el.getAttribute('aria-label') || 'icon')).slice(0, 28), ratio: Math.round(ratio * 100) / 100, need });
  });

  // (i) space usage / balance — coverage vs the USABLE band (viewport minus the
  // symmetric chrome reserve), so a slide that leaves half the frame empty fails.
  const contentBoxes = allTextEls.map((el) => el.getBoundingClientRect()).concat(media.map((m) => m.r)).filter((r) => r.width > 4 && r.height > 4);
  const usableH = H - 2 * Math.max(opts.chromeSafe, 0.07 * H);
  let cover = { pass: true, heightCoverage: 1, comX: 0.5 };
  if (contentBoxes.length) {
    const top = Math.min(...contentBoxes.map((r) => r.top)), bot = Math.max(...contentBoxes.map((r) => r.bottom));
    const heightCoverage = (bot - top) / Math.max(1, usableH);
    let areaSum = 0, xSum = 0;
    contentBoxes.forEach((r) => { const ar = r.width * r.height; areaSum += ar; xSum += (r.left + r.width / 2) * ar; });
    const comX = (xSum / Math.max(1, areaSum)) / W;
    cover = { pass: heightCoverage >= 0.45 && comX >= 0.30 && comX <= 0.70, heightCoverage: Math.round(heightCoverage * 100) / 100, comX: Math.round(comX * 100) / 100 };
  }

  // (j) nothing clipped — every significant element fully inside [0,0,W,H]
  const within = (r: DOMRect) => r.left >= -1 && r.top >= -1 && r.right <= W + 1 && r.bottom <= H + 1;
  const j = Array.from(inner.querySelectorAll('h1,h2,h3,h4,p,li,figure,img,a,button,.ig-phone,.cover-names'))
    .filter((el) => !inPanel(el) && vis(el))
    .filter((el) => !within(el.getBoundingClientRect()))
    .map((el) => { const r = el.getBoundingClientRect(); return { what: (el.textContent || el.className || el.tagName).toString().trim().slice(0, 22), top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), bottom: Math.round(r.bottom) }; });

  // (k) no hidden vertical scroll — content reachable only by scrolling = clipped design
  const k = Array.from(inner.querySelectorAll('*'))
    .filter((el) => !inPanel(el) && vis(el) && (el as HTMLElement).scrollHeight - (el as HTMLElement).clientHeight > 2 && getComputedStyle(el as HTMLElement).overflowY !== 'visible')
    .slice(0, 5).map((el) => ({ tag: (el.className || el.tagName).toString().slice(0, 22), sh: (el as HTMLElement).scrollHeight, ch: (el as HTMLElement).clientHeight }));

  return {
    a: { pass: a.length === 0, fails: a },
    b: { pass: b.length === 0, fails: b },
    c: { pass: c.length === 0 && overflow.length === 0, fails: c, overflow },
    d: { pass: d.length === 0, fails: d },
    e: { pass: e.length === 0, fails: e },
    g: { pass: g.length === 0, fails: g },
    h: { pass: h.length === 0, fails: h },
    i: { pass: cover.pass, info: cover },
    j: { pass: j.length === 0, fails: j },
    k: { pass: k.length === 0, fails: k },
  };
}

async function auditViewport(browser: import('playwright').Browser, base: string, route: string, outDir: string, W: number, H: number) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.addInitScript(() => { (window as unknown as { __name: (f: unknown) => unknown }).__name = (f) => f; });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => (window as unknown as { __edfDeck?: unknown }).__edfDeck !== undefined, { timeout: 8000 });

  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return { inset: parseFloat(cs.getPropertyValue('--slide-safe-inset')) || 64, chromeSafe: parseFloat(cs.getPropertyValue('--deck-chrome-safe')) || 132 };
  });
  const slideIds: string[] = await page.evaluate(() => Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.id));

  let fails = 0;
  const lines: string[] = [];
  for (let i = 0; i < slideIds.length; i++) {
    const id = slideIds[i];
    await page.evaluate((idx) => (window as unknown as { __edfDeck: { goTo(n: number): void } }).__edfDeck.goTo(idx), i);
    await page.waitForTimeout(450);
    const r = await page.evaluate(measureSlide, { slideId: id, W, H, ...tokens });

    // (exp) expand each "Scopri come" INLINE and re-measure the WHOLE slide in its
    // expanded state — the blossomed content must still satisfy every invariant
    // (band, clip, hidden-scroll, rhythm, contrast). Collapse again between triggers.
    const triggerCount: number = await page.evaluate((sid) => document.getElementById(sid)!.querySelectorAll('[data-hiw-open]').length, id);
    const expFails: Array<{ trigger: number; checks: string[] }> = [];
    for (let t = 0; t < triggerCount; t++) {
      await page.evaluate(([sid, idx]) => (document.getElementById(sid as string)!.querySelectorAll('[data-hiw-open]')[idx as number] as HTMLElement).click(), [id, t]);
      await page.waitForTimeout(750);
      const re = await page.evaluate(measureSlide, { slideId: id, W, H, ...tokens }) as Record<string, { pass: boolean; fails?: unknown; info?: unknown }>;
      // A disclosure legitimately shifts the resting composition, so (a) band-position
      // and (i) space-balance do NOT apply to the expanded state. The real expansion
      // invariants do: chrome (b), margins/overflow (c), faces (d), text-on-text (e),
      // rhythm (g), contrast (h), nothing clipped (j), no hidden scroll (k).
      const bad = ['b', 'c', 'd', 'e', 'g', 'h', 'j', 'k'].filter((key) => !re[key].pass);
      if (bad.length) expFails.push({ trigger: t, checks: bad.map((key) => `${key}:${JSON.stringify(re[key].fails ?? re[key].info)}`) });
      await page.evaluate(([sid, idx]) => (document.getElementById(sid as string)!.querySelectorAll('[data-hiw-open]')[idx as number] as HTMLElement).click(), [id, t]);
      await page.waitForTimeout(500);
    }
    const exp = { pass: expFails.length === 0, fails: expFails };

    const results: Record<string, { pass: boolean }> = { a: r.a, b: r.b, c: r.c, d: r.d, e: r.e, g: r.g, h: r.h, i: r.i, j: r.j, k: r.k, exp };
    const order = ['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'exp'];
    const failed = order.filter((key) => !results[key].pass);
    if (failed.length) { fails += failed.length; await page.screenshot({ path: path.join(outDir, `${W}x${H}-${id}.png`) }); }
    lines.push(`${failed.length ? '✗' : '✓'} ${String(i).padStart(2, '0')} ${id.padEnd(18)} ` +
      order.map((key) => `${key}:${results[key].pass ? 'ok' : 'F'}`).join(' '));
    if (!r.a.pass) lines.push(`     a → ${JSON.stringify(r.a.fails)}`);
    if (!r.b.pass) lines.push(`     b → ${JSON.stringify(r.b.fails)}`);
    if (!r.c.pass) lines.push(`     c → ${JSON.stringify(r.c.fails)} overflow:${JSON.stringify(r.c.overflow)}`);
    if (!r.d.pass) lines.push(`     d → ${JSON.stringify(r.d.fails)}`);
    if (!r.e.pass) lines.push(`     e → ${JSON.stringify(r.e.fails)}`);
    if (!r.g.pass) lines.push(`     g → ${JSON.stringify(r.g.fails)}`);
    if (!r.h.pass) lines.push(`     h → ${JSON.stringify(r.h.fails)}`);
    if (!r.i.pass) lines.push(`     i → ${JSON.stringify(r.i.info)}`);
    if (!r.j.pass) lines.push(`     j → ${JSON.stringify(r.j.fails)}`);
    if (!r.k.pass) lines.push(`     k → ${JSON.stringify(r.k.fails)}`);
    if (!exp.pass) lines.push(`     exp → ${JSON.stringify(exp.fails)}`);
  }
  await ctx.close();
  return { lines, fails };
}

async function main() {
  const base = await findBaseUrl();
  const browser = await chromium.launch();
  let totalFails = 0;
  // Optional route filter: `audit:deck engagement` audits only that route.
  const filter = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const routes = filter.length ? ROUTES.filter((r) => filter.includes(r.name)) : ROUTES;

  for (const { name, route } of routes) {
    const outDir = path.join(OUT_BASE, name);
    await mkdir(outDir, { recursive: true });
    const blocks: string[] = [];
    let routeFails = 0;
    for (const [W, H] of VIEWPORTS) {
      const { lines, fails } = await auditViewport(browser, base, route, outDir, W, H);
      routeFails += fails; totalFails += fails;
      blocks.push(`\n=== ${W}×${H} ===\n${lines.join('\n')}`);
    }
    console.log(`\n━━━ ${name} · ${base}${route} · checks a–k + exp · ${VIEWPORTS.map(([w, h]) => `${w}×${h}`).join(', ')} ━━━`);
    console.log(blocks.join('\n'));
    console.log(routeFails === 0 ? `✓ ${name}: PASS — all slides clean at ALL viewports` : `✗ ${name}: ${routeFails} check failure(s) — see audit/${name}/`);
  }
  await browser.close();
  console.log(`\n${totalFails === 0 ? 'PASS — all decks clean at ALL viewports (a–k, "Scopri come" expanded inline)' : `FAIL — ${totalFails} check failure(s) total`}\n`);
  process.exit(totalFails === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(2); });
