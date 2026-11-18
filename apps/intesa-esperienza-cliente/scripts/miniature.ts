/**
 * LE MINIATURE DELLA FINESTRA PRESENTATORE (18 nov 2026).
 *
 * Una foto per slide del registro (`src/data/slides.ts`), a racconto aperto: i
 * sotto-passi si rivelano tutti prima dello scatto, come in `scripts/deck-pdf.ts`
 * (uno scatto allo stato 0 mostra il titolo col vuoto sotto). Le riserve, che il
 * motore non conta, si accendono caricando la pagina con la loro ancora.
 *
 * Uscita: `public/miniature/<pagina>--<slide>.jpg`, 640×360. Si rilancia quando
 * cambia una slide; `--only <pagina[,pagina]>` rifà solo quelle.
 *
 *   pnpm --filter intesa-esperienza-cliente build
 *   (cd apps/intesa-esperienza-cliente && pnpm exec astro preview --port 4590) &
 *   DECK_URL=http://localhost:4590 npx tsx apps/intesa-esperienza-cliente/scripts/miniature.ts
 */
import { chromium, type Page } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_REGISTRY } from '../src/data/slides';
import { CHAPTERS } from '../src/data/chapters';

const QUI = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(QUI, '../public/miniature');
const ORIGINE = process.env.DECK_URL ?? 'http://localhost:4590';
const BASE = '/experience-design-factory/intesa-esperienza-cliente/';
const i = process.argv.indexOf('--only');
const SOLO = i !== -1 ? process.argv[i + 1].split(',') : null;

const ordine = ['index', ...CHAPTERS.map((c) => c.slug), 'approfondimenti'];
const pagine = ordine
  .map((s) => PAGE_REGISTRY.find((p) => p.slug === s))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))
  .filter((p) => !SOLO || SOLO.includes(p.slug));

type Deck = { slides: HTMLElement[]; goTo(i: number): void; revealSubstep(): boolean };
const indice = (page: Page, id: string) =>
  page.evaluate((x) => {
    const d = (window as unknown as { __edfDeck?: Deck }).__edfDeck;
    return d ? d.slides.findIndex((s) => s.id === x) : -1;
  }, id);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
// 1920×1080 a un terzo: la slide si compone come in sala, il file esce a 640×360.
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 / 3 });
const page = await ctx.newPage();
let fatte = 0;
const mancate: string[] = [];

for (const p of pagine) {
  const url = ORIGINE + BASE + (p.slug === 'index' ? '' : `${p.slug}/`);
  await page.goto(url, { waitUntil: 'networkidle' });
  for (const s of p.slides) {
    let k = await indice(page, s.id);
    if (k === -1) {
      // Una riserva: si accende solo arrivando con la sua ancora.
      await page.goto(`${url}#${s.id}`, { waitUntil: 'networkidle' });
      await page.reload({ waitUntil: 'networkidle' });
      k = await indice(page, s.id);
    }
    if (k === -1) { mancate.push(`${p.slug}#${s.id}`); continue; }
    await page.evaluate((n) => (window as unknown as { __edfDeck: Deck }).__edfDeck.goTo(n), k);
    await page.waitForTimeout(1100);
    const aperti = await page.evaluate(() => {
      const d = (window as unknown as { __edfDeck: Deck }).__edfDeck;
      let n = 0;
      while (d.revealSubstep() && n < 40) n++;
      return n;
    });
    if (aperti) await page.waitForTimeout(700);
    await page.screenshot({ path: resolve(OUT, `${p.slug}--${s.id}.jpg`), type: 'jpeg', quality: 72 });
    fatte++;
  }
  process.stdout.write(`  ${p.slug}: ${p.slides.length}\n`);
}
await browser.close();
console.log(`\nminiature · ${fatte} scatti → ${OUT}`);
if (mancate.length) { console.log(`⚠️ non raggiunte: ${mancate.join(', ')}`); process.exitCode = 1; }
