/**
 * shots.mjs — screenshot di OGNI slide a una lingua e un viewport, per leggerle.
 * L'audit misura; questo serve agli occhi (contratto Type & legibility).
 *
 *   pnpm --filter __SLUG__ build && pnpm --filter __SLUG__ preview --port 4402
 *   DECK_URL=http://localhost:4402 node scripts/shots.mjs            # tutte le pagine
 *   LANG_DECK=en VIEWPORT=1280x800 node scripts/shots.mjs home __FIRST_CHAPTER__
 *
 * Output: shots/<lang>-<width>/<pagina>-<nn>-<slide-id>.png (cartella git-ignorata).
 * Nota: apps/* /scripts/shots.mjs è git-ignorato dal repo; questo file vive solo in locale.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import * as path from 'node:path';

const BASE = process.env.DECK_URL || 'http://localhost:4402';
const PREFIX = '/experience-design-factory/__SLUG__';
const LANG = process.env.LANG_DECK || '__DEFAULT_LANG__';
const [W, H] = (process.env.VIEWPORT || '1920x1080').split('x').map(Number);
const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2).map((p) => (p === 'home' ? '' : p))
  : ['', __PAGES_LIST__];
const OUT = path.resolve(process.cwd(), 'shots', `${LANG}-${W}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await ctx.addInitScript((l) => { try { localStorage.setItem('edf:lang', l); } catch (_) {} }, LANG);
const page = await ctx.newPage();
await mkdir(OUT, { recursive: true });

for (const p of PAGES) {
  const route = `${PREFIX}/${p ? p + '/' : ''}`;
  const name = p || 'home';
  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__edfDeck !== undefined, { timeout: 8000 }).catch(() => {});
  const ids = await page.evaluate(() => Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.id));
  for (let i = 0; i < ids.length; i++) {
    await page.evaluate((idx) => window.__edfDeck.goTo(idx), i);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT, `${name}-${String(i).padStart(2, '0')}-${ids[i]}.png`) });
  }
  console.log(`${name}: ${ids.length} slides`);
}
await browser.close();
