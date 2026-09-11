/**
 * seamless-loop — ricuce una clip perché il loop nativo non faccia stacco, e lo misura.
 *
 * Il problema: una clip generata (Firefly o altro) finisce su un fotogramma che con
 * il frame 0 non c'entra niente. Il browser la riavvolge correttamente, ma si vede un
 * salto. È un difetto del contenuto, non della riproduzione: si risolve sull'asset.
 *
 * Il rimedio: si prende la coda di `--fade` secondi e la si dissolve sulla testa
 * (ffmpeg xfade). La clip esce più corta di `--fade` e il suo ultimo fotogramma
 * prosegue nel primo, quindi `<video loop>` gira senza stacco.
 *
 * La misura: PSNR fra ultimo e primo fotogramma, confrontato col PSNR di due
 * fotogrammi adiacenti a metà clip. Se il giro è continuo quanto due frame
 * qualsiasi, il loop è a posto — ed è un numero, non un'impressione.
 *
 *   pnpm loop:seamless <clip.mp4> [--fade 0.75] [--out <file.mp4>] [--poster]
 *   pnpm loop:seamless --check <clip.mp4>      → solo verifica, exit ≠0 se il giro salta
 *
 * Richiede ffmpeg/ffprobe nel PATH.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';

const run = promisify(execFile);

/** Quanto il giro può stare sotto il PSNR di due fotogrammi adiacenti, in dB. */
const SEAM_TOLERANCE_DB = 6;

async function ffprobe(file: string, entries: string): Promise<string> {
  const { stdout } = await run('ffprobe', ['-v', 'error', '-show_entries', entries, '-of', 'default=noprint_wrappers=1:nokey=1', file]);
  return stdout.trim();
}

async function duration(file: string): Promise<number> {
  const v = parseFloat(await ffprobe(file, 'format=duration'));
  if (!Number.isFinite(v)) throw new Error(`durata non leggibile: ${file}`);
  return v;
}

async function frameCount(file: string): Promise<number> {
  const v = parseInt(await ffprobe(file, 'stream=nb_frames'), 10);
  if (!Number.isFinite(v)) throw new Error(`numero di fotogrammi non leggibile: ${file}`);
  return v;
}

/** Estrae un fotogramma per indice in un PNG temporaneo. */
async function extractFrame(file: string, n: number, out: string): Promise<void> {
  await run('ffmpeg', ['-y', '-v', 'error', '-i', file, '-vf', `select=eq(n\\,${n})`, '-fps_mode', 'passthrough', '-frames:v', '1', out]);
}

/** PSNR medio fra due immagini, in dB. Più alto = più simili. */
async function psnr(a: string, b: string): Promise<number> {
  const { stderr } = await run('ffmpeg', ['-v', 'info', '-i', a, '-i', b, '-lavfi', 'psnr', '-f', 'null', '-']).catch((e: { stderr?: string }) => ({ stderr: e.stderr ?? '' }));
  const m = /average:([0-9.]+|inf)/.exec(stderr ?? '');
  if (!m) throw new Error('PSNR non misurabile');
  return m[1] === 'inf' ? Number.POSITIVE_INFINITY : parseFloat(m[1]);
}

type Seam = { seam: number; adjacent: number; ok: boolean };

/** Misura il giro: ultimo→primo fotogramma contro due fotogrammi adiacenti a metà clip. */
async function measureSeam(file: string): Promise<Seam> {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'edf-loop-'));
  try {
    const n = await frameCount(file);
    const mid = Math.floor(n / 2);
    const f = (name: string) => path.join(tmp, name);
    await extractFrame(file, 0, f('first.png'));
    await extractFrame(file, n - 1, f('last.png'));
    await extractFrame(file, mid, f('mid.png'));
    await extractFrame(file, mid + 1, f('mid1.png'));
    const seam = await psnr(f('last.png'), f('first.png'));
    const adjacent = await psnr(f('mid.png'), f('mid1.png'));
    return { seam, adjacent, ok: seam >= adjacent - SEAM_TOLERANCE_DB };
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}

/** Coda dissolta sulla testa: l'output dura `D - fade` e il giro è continuo. */
async function stitch(input: string, output: string, fade: number): Promise<void> {
  const d = await duration(input);
  if (fade <= 0 || fade >= d / 2) throw new Error(`--fade ${fade}s non sta in una clip di ${d.toFixed(2)}s`);
  const offset = d - 2 * fade;
  const filter =
    `[0:v]split[body][pre];` +
    `[body]trim=start=${fade},setpts=PTS-STARTPTS[body];` +
    `[pre]trim=duration=${fade},setpts=PTS-STARTPTS[pre];` +
    `[body][pre]xfade=transition=fade:duration=${fade}:offset=${offset},format=yuv420p[v]`;
  await run('ffmpeg', [
    '-y', '-v', 'error', '-i', input,
    '-filter_complex', filter, '-map', '[v]', '-an',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    output,
  ]);
}

/** Il poster DEVE essere il primo fotogramma della clip ricucita, non dell'originale. */
async function writePoster(clip: string, poster: string): Promise<void> {
  await run('ffmpeg', ['-y', '-v', 'error', '-i', clip, '-frames:v', '1', '-q:v', '4', poster]);
}

function db(v: number): string {
  return Number.isFinite(v) ? `${v.toFixed(1)} dB` : '∞';
}

async function main() {
  const argv = process.argv.slice(2);
  const check = argv.includes('--check');
  const wantPoster = argv.includes('--poster');
  const flag = (name: string) => {
    const i = argv.indexOf(name);
    return i !== -1 && argv[i + 1] ? argv[i + 1] : undefined;
  };
  const fade = parseFloat(flag('--fade') ?? '0.75');
  const input = argv.find((a) => !a.startsWith('--') && a !== flag('--fade') && a !== flag('--out'));
  if (!input) {
    console.error('uso: pnpm loop:seamless <clip.mp4> [--fade 0.75] [--out <file>] [--poster]\n     pnpm loop:seamless --check <clip.mp4>');
    process.exit(2);
  }

  if (check) {
    const m = await measureSeam(input);
    console.log(`\n${path.basename(input)}`);
    console.log(`  giro (ultimo→primo) : ${db(m.seam)}`);
    console.log(`  fotogrammi adiacenti: ${db(m.adjacent)}  ← il riferimento`);
    if (m.ok) {
      console.log('\nPASS — il giro è continuo quanto due fotogrammi qualsiasi.\n');
      return;
    }
    console.log(`\nFAIL — sul giro si vede lo stacco. Ricuci con:\n  pnpm loop:seamless ${input} --poster\n`);
    process.exit(1);
  }

  const out = flag('--out') ?? input.replace(/\.mp4$/i, '.loop.mp4');
  const before = await measureSeam(input);
  await stitch(input, out, fade);
  const after = await measureSeam(out);
  if (wantPoster) await writePoster(out, out.replace(/\.loop\.mp4$/i, '.poster.jpg').replace(/\.mp4$/i, '.poster.jpg'));

  console.log(`\n${path.basename(input)} → ${path.basename(out)}  (coda di ${fade}s dissolta sulla testa)`);
  console.log(`  giro  prima : ${db(before.seam)}`);
  console.log(`  giro  dopo  : ${db(after.seam)}`);
  console.log(`  riferimento : ${db(after.adjacent)}  (due fotogrammi adiacenti)`);
  if (wantPoster) console.log('  poster      : primo fotogramma della clip ricucita');
  console.log(after.ok ? '\nPASS — il loop non fa più stacco.\n' : '\nATTENZIONE — il giro resta sotto il riferimento: prova un --fade più lungo.\n');
  if (!after.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
