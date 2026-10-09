#!/usr/bin/env node
/**
 * wall-tile — cattura un tile del wall dell'Atelier.
 *
 * I tile sono 1280×720, ma **non si catturano a 1280×720**: è un viewport più
 * basso di qualunque risoluzione di proiezione che l'audit verifica, e la
 * copertina ci sta stretta. È così che il tile di Isybank è finito col testo
 * della nota tagliato dalla barra di avanzamento. Si cattura a **1920×1080**,
 * cioè la composizione che il deck è disegnato per reggere, e si riduce a
 * 1280×720: stesso rapporto, stessa pagina, nessun taglio.
 *
 * Playwright non disegna il puntatore del mouse, quindi il cursore nel
 * fotogramma — l'altro difetto del vecchio tile — non può più succedere; e
 * nessuno stato di hover si attiva, perché il mouse non si muove mai.
 *
 * Uso:
 *   node scripts/wall-tile.mjs <slug> <url> [--out <file.webp>] [--wait 4000]
 * Esempio:
 *   node scripts/wall-tile.mjs isybank-momento \
 *     http://localhost:7801/experience-design-factory/isybank-momento/
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const [slug, url, ...rest] = process.argv.slice(2);
if (!slug || !url) {
  console.error('uso: node scripts/wall-tile.mjs <slug> <url> [--out file] [--wait ms]');
  process.exit(2);
}
const flag = (n, d) => { const i = rest.indexOf(`--${n}`); return i === -1 ? d : rest[i + 1]; };
const out = flag('out', `apps/atelier/src/assets/wall/${slug}.webp`);
const wait = Number(flag('wait', 4500));

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce', // niente fotogramma colto a metà di una transizione
});
await page.goto(url, { waitUntil: 'networkidle' });
// La chrome del deck si nasconde da sola dopo un po' di inattività, e le clip
// di sfondo hanno bisogno di qualche secondo per arrivare al primo fotogramma
// buono. Qui non si tocca il mouse: nessun hover, nessun bottone «acceso».
await page.waitForTimeout(wait);

const shot = await page.screenshot({ type: 'png' });
await browser.close();

const buf = await sharp(shot)
  .resize(1280, 720, { fit: 'cover', kernel: 'lanczos3' })
  .webp({ quality: 82 })
  .toBuffer();
writeFileSync(out, buf);
const { width, height } = await sharp(buf).metadata();
console.log(`${out} — ${width}×${height}, ${(buf.length / 1024).toFixed(0)} KB (catturato a 1920×1080)`);
