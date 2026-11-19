/**
 * Le miniature della pagina breve (edizione da distribuire): per ogni momento,
 * il solo mockup di Giulia, ritagliato dalla build lettura con i passi aperti.
 * Uso: LETTURA_URL=<base lettura> npx tsx scripts/edizione-miniature.ts
 * Scrive apps/intesa-esperienza-cliente/public/miniature/lettura/m-0N.jpg
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const L = (process.env.LETTURA_URL ?? '').replace(/\/?$/, '/');
const OUT = 'apps/intesa-esperienza-cliente/public/miniature/lettura';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1512, height: 860 }, deviceScaleFactor: 2 });
for (let i = 1; i <= 7; i++) {
  const id = `slide-m-0${i}`;
  await p.goto(`${L}momenti/#${id}`, { waitUntil: 'load' });
  await p.waitForTimeout(4200);
  // Solo il mockup: l'icona del canale (Azione) sborda dal riquadro e verrebbe tagliata.
  await p.addStyleTag({ content: '.im-due-mock > :not(:first-child) { visibility: hidden !important; }' });
  const mock = p.locator(`#${id} .im-due-mock > :first-child`).first();
  await mock.screenshot({ path: `${OUT}/m-0${i}.jpg`, type: 'jpeg', quality: 82 });
  console.log('ok', id);
}
// Le schermate della versione intera, per la pagina «Questo è solo il riassunto»: la
// slide a passi aperti, senza la barra in alto e senza i comandi in basso.
const dp = await b.newPage({ viewport: { width: 1512, height: 860 }, deviceScaleFactor: 1.5 });
for (const [pagina, id, nome, attesa] of [['messa-a-terra', 'slide-innesto', 'd-innesto', 9000], ['messa-a-terra', 'slide-flusso', 'd-flusso', 11000], ['messa-a-terra', 'slide-attribuzione', 'd-attribuzione', 8000]] as const) {
  await dp.goto(`${L}${pagina}/#${id}`, { waitUntil: 'load' });
  await dp.waitForTimeout(attesa);
  await dp.screenshot({ path: `${OUT}/${nome}.jpg`, type: 'jpeg', quality: 80, clip: { x: 0, y: 62, width: 1512, height: 690 } });
  console.log('ok', nome);
}
await b.close();
