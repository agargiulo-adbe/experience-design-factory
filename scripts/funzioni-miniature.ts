/**
 * Le miniature delle card per funzione (edizione da distribuire): per ogni tappa
 * di `src/data/funzioni.ts`, la slide dalla build lettura con i passi aperti e
 * senza la cornice del deck (barra, firma, credito, navigazione).
 * Uso: LETTURA_URL=<base lettura> npx tsx scripts/funzioni-miniature.ts
 * Scrive apps/intesa-esperienza-cliente/public/miniature/funzioni/<pagina>--<slide>.jpg
 * Si rifà quando cambia una tappa o la slide di una tappa.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { CARD_FUNZIONI, nomeMiniatura } from '../apps/intesa-esperienza-cliente/src/data/funzioni.ts';

const L = (process.env.LETTURA_URL ?? '').replace(/\/?$/, '/');
const OUT = 'apps/intesa-esperienza-cliente/public/miniature/funzioni';
mkdirSync(OUT, { recursive: true });
const tappe = [...new Set(CARD_FUNZIONI.flatMap((c) => c.tappe.map((t) => t.href)))];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
for (const h of tappe) {
  const [pagina, slide] = h.split('#');
  await p.goto(`${L}${pagina}?v=${Date.now()}#${slide}`, { waitUntil: 'load' });
  // L'anello di lettura è pieno quando tutti i passi della slide sono aperti.
  await p.waitForFunction(() => (window as any).__edfDeck?.root.hasAttribute('data-lettura-pronta'), null, { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(1800);
  await p.addStyleTag({ content: '.fixed.top-0, [data-deck-controls], .edf-madewith, .edf-cobrand, .deck-chrome { visibility: hidden !important; }' });
  const f = `${OUT}/${nomeMiniatura(h)}`;
  await p.screenshot({ path: f, type: 'jpeg', quality: 80, clip: { x: 0, y: 64, width: 1440, height: 836 } });
  execFileSync('sips', ['-Z', '640', f], { stdio: 'ignore' });
  console.log('ok', h);
}
await b.close();
