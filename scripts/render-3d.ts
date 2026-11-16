/**
 * render-3d — rende una scena 3D di `scripts/3d/render.py` nei colori di un'experience.
 *
 *   pnpm render:3d --app <cartella-app> --scena fondo|innesto|rta|decisioning|cja|genstudio [--secondi 8] [--fps 24]
 *                  [--anteprima] [--out <cartella>]
 *
 * Che cosa fa, in ordine:
 *  1. legge la palette dal `global.css` dell'app, risolvendo le catene di var() — il
 *     colore si LEGGE, non si ricorda (stessa regola di `brand:tokens`);
 *  2. lancia Blender senza interfaccia sullo script della scena;
 *  3. monta i fotogrammi in MP4 (H.264) e WebM (VP9) più un poster JPG (come `loop:seamless`);
 *  4. su una scena in loop, misura la chiusura con `loop:seamless --check`;
 *  5. scrive `provenance.json` accanto: da dove viene, con quali colori, con che versione.
 *
 * Il default scrive in `docs/Factory/3d/<app>/<scena>/` (git-ignorato): un asset entra
 * in un'app solo dopo che qualcuno l'ha guardato, e lo si copia a mano in
 * `src/assets/generated/` con la sua riga di provenienza.
 *
 * Richiede Blender (`brew install --cask blender`) e ffmpeg nel PATH.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BLENDER = process.env.BLENDER_BIN ?? '/Applications/Blender.app/Contents/MacOS/Blender';

function arg(name: string, def?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : 'true';
}

const app = arg('app');
const scena = arg('scena', 'fondo')!;
const anteprima = arg('anteprima') === 'true';
if (!app) {
  console.error('uso: pnpm render:3d --app <cartella-app> --scena fondo|innesto|rta|decisioning|cja|genstudio [--anteprima]');
  process.exit(2);
}
if (!existsSync(BLENDER)) {
  console.error(`Blender non trovato in ${BLENDER}: brew install --cask blender, oppure BLENDER_BIN=…`);
  process.exit(2);
}

// ── 1. la palette, letta ─────────────────────────────────────────────────────
const cssPath = join(ROOT, 'apps', app, 'src/styles/global.css');
const css = readFileSync(cssPath, 'utf8');
const vars = new Map<string, string>();
for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
  if (!vars.has(m[1])) vars.set(m[1], m[2].trim()); // la prima definizione: :root, tema chiaro
}
function risolvi(nome: string, giro = 0): string {
  const v = vars.get(nome);
  if (!v) throw new Error(`${nome} non definito in ${cssPath}`);
  const r = v.match(/^var\((--[a-z0-9-]+)\)$/i);
  if (r && giro < 10) return risolvi(r[1], giro + 1);
  if (!/^#[0-9a-f]{6}$/i.test(v)) throw new Error(`${nome} = «${v}»: serve un hex a sei cifre`);
  return v;
}
// Il contratto dei token (CLAUDE.md, Code Conventions): inverse = scuro, accent = marchio.
const notte = risolvi('--surface-inverse');
const palette = {
  notte,
  notte2: vars.has('--color-night-2') ? risolvi('--color-night-2') : notte,
  accento: risolvi('--accent-primary'),
  accentoTenue: risolvi('--accent-secondary'),
  chiaro: risolvi('--ink-inverse'),
};

// ── 2. Blender ───────────────────────────────────────────────────────────────
const out = resolve(arg('out', join(ROOT, 'docs/Factory/3d', app, scena))!);
const frames = join(out, 'frames');
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const fps = Number(arg('fps', '24'));
const params = {
  scena,
  palette,
  fps,
  secondi: Number(arg('secondi', '8')),
  larghezza: anteprima ? 960 : 1920,
  altezza: anteprima ? 540 : 1080,
  campioni: anteprima ? 8 : 48,
  cartella: frames,
};
console.log(`render:3d · ${app} · ${scena}${anteprima ? ' · anteprima' : ''}`);
console.log(`  palette ${Object.entries(palette).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
const t0 = Date.now();
execFileSync(
  BLENDER,
  ['-b', '--factory-startup', '-noaudio', '-P', join(ROOT, 'scripts/3d/render.py'), '--', JSON.stringify(params)],
  { stdio: ['ignore', 'ignore', 'inherit'] },
);
const info = JSON.parse(readFileSync(join(frames, 'scena.json'), 'utf8'));
const resi = readdirSync(frames).filter((f) => f.endsWith('.png')).length;
if (resi !== info.fotogrammi) throw new Error(`attesi ${info.fotogrammi} fotogrammi, resi ${resi}`);
console.log(`  ${resi} fotogrammi in ${Math.round((Date.now() - t0) / 1000)} s`);

// ── 3. montaggio ─────────────────────────────────────────────────────────────
const seq = join(frames, 'f_%04d.png');
const ff = (a: string[]) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const mp4 = join(out, `${scena}.mp4`);
const webm = join(out, `${scena}.webm`);
const poster = join(out, `${scena}.poster.jpg`);
ff(['-framerate', String(fps), '-i', seq, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20',
  '-preset', 'slow', '-movflags', '+faststart', mp4]);
ff(['-framerate', String(fps), '-i', seq, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-row-mt', '1', webm]);
// Il poster di un loop è il fotogramma 0; quello di una scena a fasi è l'ULTIMO, lo
// stato completo, che è ciò che resta se il video non parte (riduzione del movimento).
const fPoster = info.loop ? 'f_0000.png' : `f_${String(info.fotogrammi - 1).padStart(4, '0')}.png`;
ff(['-i', join(frames, fPoster), '-q:v', '3', poster]);

// ── 4. la chiusura del giro ──────────────────────────────────────────────────
let giro = 'non si applica (scena a fasi)';
if (info.loop) {
  try {
    execFileSync('npx', ['tsx', join(ROOT, 'scripts/seamless-loop.ts'), '--check', mp4], { stdio: 'pipe' });
    giro = 'PASS';
  } catch (e: any) {
    giro = `FAIL — ${String(e.stdout ?? e.message).trim().split('\n').pop()}`;
  }
}

// ── 5. provenienza ───────────────────────────────────────────────────────────
const blenderVer = execFileSync(BLENDER, ['--version']).toString().split('\n')[0].trim();
const kb = (p: string) => Math.round(readFileSync(p).length / 1024);
writeFileSync(join(out, 'provenance.json'), JSON.stringify({
  id: `3d-${scena}`,
  type: 'blender',
  source: `scripts/3d/render.py · scena «${scena}»`,
  license: 'Prodotto in casa (Blender, GPL: l\'output è nostro). Nessun servizio esterno di generazione.',
  palette, palettePresaDa: `apps/${app}/src/styles/global.css`,
  motore: blenderVer, fps, fotogrammi: info.fotogrammi,
  capitoli: info.capitoli ?? null,
  anteprima,
  creatoIl: new Date().toISOString(),
}, null, 2));
if (info.capitoli) writeFileSync(join(out, 'capitoli.json'), JSON.stringify(info.capitoli, null, 2));
if (info.etichette) writeFileSync(join(out, 'etichette.json'), JSON.stringify(info.etichette, null, 2));
if (!arg('tieni-fotogrammi')) rmSync(frames, { recursive: true, force: true });

console.log(`  ${mp4} (${kb(mp4)} KB) · webm ${kb(webm)} KB · poster ${kb(poster)} KB`);
console.log(`  giro: ${giro}`);
if (info.capitoli) console.log(`  capitoli: ${info.capitoli.map((c: any) => `${c.fase} ${c.da}–${c.a}`).join(' · ')}`);
