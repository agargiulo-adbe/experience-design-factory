/**
 * build-video — Firefly Video Model clips for the Experience Design Factory.
 *
 * Reads a per-app video manifest, generates each clip with Adobe Firefly
 * Services (text-to-video, async job), then re-encodes with ffmpeg for smooth
 * scroll-scrubbing (dense keyframes `-g 1` + faststart) and writes:
 *   public/media/<id>.mp4          — scrub-friendly clip
 *   public/media/<id>.poster.jpg   — last frame (reduced-motion / preload poster)
 *   public/media/provenance.video.json
 *
 * Build-time only: FIREFLY_CLIENT_ID / FIREFLY_CLIENT_SECRET from the app's .env
 * (gitignored; never shipped to the site or CI).
 *
 * Run from a client app dir:  pnpm --filter <app> video:build
 * Usage: tsx ../../scripts/build-video.ts [--manifest <path>] [--out <dir>]
 */
import { writeFile, mkdir } from 'node:fs/promises';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import {
  fireflyCredentialsFromEnv,
  generateVideo,
  getAccessToken,
} from './lib/firefly';

const cwd = process.cwd();
function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const manifestPath = path.resolve(cwd, arg('manifest', 'video.manifest.ts'));
const outDir = path.resolve(cwd, arg('out', 'public/media'));

try { process.loadEnvFile(path.join(cwd, '.env')); } catch { /* rely on shell */ }
const CREDS = fireflyCredentialsFromEnv();

const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  ok: (s: string) => `\x1b[32m${s}\x1b[0m`,
  warn: (s: string) => `\x1b[33m${s}\x1b[0m`,
  err: (s: string) => `\x1b[31m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

interface VideoSlot {
  id: string;
  prompt: string;
  negativePrompt?: string;
  aspect: string;
  size?: { width: number; height: number };
  seconds?: number;
  seed?: number;
}

function hasCommand(cmd: string): boolean {
  return spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd]).status === 0;
}

/** Re-encode for smooth scrubbing: every frame a keyframe (-g 1) + faststart. */
function scrubEncode(inPath: string, outPath: string): boolean {
  const r = spawnSync('ffmpeg', [
    '-y', '-i', inPath,
    '-an',                         // no audio (web scrub)
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-g', '1', '-keyint_min', '1', // all keyframes → seekable
    '-crf', '20', '-preset', 'slow',
    '-movflags', '+faststart',
    outPath,
  ], { stdio: 'inherit' });
  return r.status === 0 && fs.existsSync(outPath);
}

/** Grab the last frame as a poster for reduced-motion / preload. */
function posterFrame(inPath: string, outPath: string): boolean {
  // -sseof -0.1 seeks near the end; take one frame.
  const r = spawnSync('ffmpeg', [
    '-y', '-sseof', '-0.1', '-i', inPath, '-frames:v', '1', '-q:v', '3', outPath,
  ], { stdio: 'inherit' });
  return r.status === 0 && fs.existsSync(outPath);
}

async function main() {
  console.log(c.bold(`\nbuild-video · ${path.relative(path.resolve(cwd, '../..'), manifestPath)}`));

  if (!hasCommand('ffmpeg')) {
    console.log(c.err('\n  ffmpeg not found — install it (brew install ffmpeg) and re-run.\n'));
    process.exit(1);
  }
  const mod = await import(pathToFileURL(manifestPath).href);
  const videos: VideoSlot[] = mod.videos ?? mod.default;
  if (!Array.isArray(videos)) throw new Error(`Manifest must export a "videos" array: ${manifestPath}`);

  if (!CREDS) {
    console.log(c.warn(`\n  Missing FIREFLY_CLIENT_ID / FIREFLY_CLIENT_SECRET.`));
    console.log(`  ${videos.length} video slot(s) need them. Add to ${c.bold(path.join(cwd, '.env'))} and re-run.`);
    console.log(c.dim(`  Build-time only — the keys never ship to the site or CI.\n`));
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const token = await getAccessToken(CREDS);
  const provenance: Array<Record<string, unknown>> = [];

  for (const slot of videos) {
    console.log(c.dim(`  · generating "${slot.id}" (may take a few minutes)…`));
    try {
      const r = await generateVideo(
        CREDS,
        { prompt: slot.prompt, negativePrompt: slot.negativePrompt, size: slot.size, seconds: slot.seconds, seed: slot.seed },
        token,
      );
      const raw = path.join(os.tmpdir(), `edf-video-${slot.id}.mp4`);
      fs.writeFileSync(raw, r.buffer);

      const outMp4 = path.join(outDir, `${slot.id}.mp4`);
      const outPoster = path.join(outDir, `${slot.id}.poster.jpg`);
      if (!scrubEncode(raw, outMp4)) { console.log(c.err(`  ✗ ffmpeg scrub-encode failed for "${slot.id}"`)); continue; }
      posterFrame(outMp4, outPoster);

      const sizeMB = (fs.statSync(outMp4).size / 1e6).toFixed(1);
      provenance.push({
        id: slot.id, source: 'adobe/firefly-video',
        license: 'Adobe Firefly — commercially safe, Content Credentials (C2PA)',
        prompt: slot.prompt, model: r.model, seed: slot.seed,
        contentCredentials: r.contentCredentials,
        aspect: slot.aspect, seconds: slot.seconds ?? null,
        output: `${slot.id}.mp4`, poster: `${slot.id}.poster.jpg`,
        sizeMB: Number(sizeMB), generatedAt: new Date().toISOString(),
      });
      console.log(c.ok(`  ✓ ${slot.id} → ${path.relative(cwd, outMp4)} (${sizeMB} MB, scrub-encoded)`));
      if (Number(sizeMB) > 8) console.log(c.warn(`    ⚠ ${sizeMB} MB > 8 MB — consider hosting on the GitHub Release "media" tag instead of committing.`));
    } catch (e) {
      console.log(c.err(`  ✗ firefly-video "${slot.id}": ${String((e as Error)?.message ?? e)}`));
    }
  }

  await writeFile(path.join(outDir, 'provenance.video.json'), JSON.stringify(provenance, null, 2) + '\n');
  console.log(c.bold(`\n${provenance.length} video(s) generated · provenance.video.json written\n`));
}

main().catch((e) => { console.error(c.err(String(e?.stack ?? e))); process.exit(1); });
