/**
 * brand:icons — da `favicon.svg` alle icone e all'anteprima di un link.
 *
 * Ogni experience ha un marchio suo: una forma geometrica presa dal disegno che
 * regge il deck, mai una lettera (a 16px un glifo sembra un carattere che non
 * ha caricato). Quel marchio vive in `apps/<app>/public/favicon.svg`, scritto a
 * mano, ed è l'unica sorgente: qui si rende, non si ridisegna.
 *
 * Cosa produce, accanto al favicon:
 *   · `icon-192.png`          — Android / installazione come app
 *   · `apple-touch-icon.png`  — iOS, 180px, fondo pieno (iOS non ha trasparenza)
 *   · `og.png`                — 1200×630, l'anteprima quando il link finisce in
 *                               una chat. Senza, chi riceve il link vede un
 *                               rettangolo vuoto, e il deck sembra rotto prima
 *                               ancora di aprirsi.
 *
 * I colori NON si passano a mano: si leggono dal favicon stesso, che la palette
 * ce l'ha già. Così icone e anteprima non possono divergere dal marchio.
 *
 *   pnpm brand:icons <app> --title "Su scala umana" --sub "Adobe × Intesa Sanpaolo"
 *
 * Richiede Playwright (già dipendenza del monorepo per l'audit).
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const REPO = process.cwd();

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  const pre = process.argv.find((a) => a.startsWith(`--${name}=`));
  return pre ? pre.slice(name.length + 3) : undefined;
}

/** Il fondo del marchio e il suo accento: il primo `fill` pieno e l'ultimo. */
function paletteFromSvg(svg: string): { bg: string; accent: string } {
  const fills = [...svg.matchAll(/fill="(#[0-9a-fA-F]{3,8})"/g)].map((m) => m[1]);
  const strokes = [...svg.matchAll(/stroke="(#[0-9a-fA-F]{3,8})"/g)].map((m) => m[1]);
  return { bg: fills[0] ?? '#111111', accent: strokes[0] ?? fills[fills.length - 1] ?? '#ffffff' };
}

async function main() {
  const app = process.argv[2];
  if (!app || app.startsWith('--')) {
    console.error('uso: pnpm brand:icons <app> [--title "..."] [--sub "..."] [--font "Inter"]');
    process.exit(2);
  }
  const pub = path.join(REPO, 'apps', app, 'public');
  const svgFile = path.join(pub, 'favicon.svg');
  if (!fs.existsSync(svgFile)) {
    console.error(`manca ${path.relative(REPO, svgFile)} — il marchio si disegna a mano, questo script lo rende soltanto.`);
    process.exit(1);
  }
  const svg = fs.readFileSync(svgFile, 'utf8');
  const { bg, accent } = paletteFromSvg(svg);
  const title = flag('title') ?? app;
  const sub = flag('sub') ?? '';
  const font = flag('font') ?? 'Inter, system-ui, sans-serif';

  const browser = await chromium.launch();
  const made: string[] = [];

  /** Il marchio da solo, su fondo pieno: iOS non gestisce la trasparenza. */
  async function icon(size: number, out: string) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(
      `<html><body style="margin:0;background:${bg};display:grid;place-items:center;width:${size}px;height:${size}px">` +
      `<div style="width:${size}px;height:${size}px">${svg.replace('<svg', '<svg width="100%" height="100%"')}</div>` +
      `</body></html>`,
    );
    await page.screenshot({ path: out, type: 'png' });
    await page.close();
    made.push(`${path.basename(out)} (${size}×${size})`);
  }

  await icon(192, path.join(pub, 'icon-192.png'));
  await icon(180, path.join(pub, 'apple-touch-icon.png'));

  /* L'anteprima del link: il marchio, il titolo, una riga. Niente altro — una
     og image affollata si legge male nel riquadro di una chat. */
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0">
    <div style="width:1200px;height:630px;background:${bg};display:flex;flex-direction:column;justify-content:center;gap:34px;padding:0 96px;box-sizing:border-box;font-family:${font}">
      <div style="width:104px;height:104px">${svg.replace('<svg', '<svg width="100%" height="100%"')}</div>
      <div>
        <div style="font-size:76px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;line-height:1.05">${title}</div>
        ${sub ? `<div style="margin-top:20px;font-size:30px;font-weight:600;color:${accent};letter-spacing:0.08em;text-transform:uppercase">${sub}</div>` : ''}
      </div>
    </div></body></html>`);
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(pub, 'og.png'), type: 'png' });
  await page.close();
  made.push('og.png (1200×630)');

  await browser.close();
  console.log(`\n${app} · palette letta dal marchio: fondo ${bg}, accento ${accent}`);
  made.forEach((m) => console.log(`  · ${m}`));
  console.log(`\nRicorda il <head>: favicon.svg, icon-192.png, apple-touch-icon.png, og:image.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
