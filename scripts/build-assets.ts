/**
 * build-assets — reusable asset pipeline for the Experience Design Factory.
 *
 * Reads a per-client manifest and, with ONE command, fills every image slot:
 *   stock  → Pexels search (best orientation + highest resolution), download
 *   aigen  → local FLUX via `mflux-generate` (skipped with a warning if absent)
 *   code   → no-op (visual already built in components)
 * Then applies a brand color-grade (sharp), crops to the slot aspect, and writes
 * a high-res graded source to src/assets/generated/<id>.webp. Idempotent.
 *
 * Run from a client app dir:  pnpm assets:build
 * Env: PEXELS_API_KEY (build-time, local only — never shipped to the site/CI).
 *
 * Usage: tsx ../../scripts/build-assets.ts [--manifest <path>] [--out <dir>]
 */
import { writeFile, mkdir } from 'node:fs/promises';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import {
  aspectDimensions,
  pexelsOrientation,
  type AssetSlot,
  type Grade,
} from '../packages/core/src/assets/types';

const cwd = process.cwd();

// ── tiny arg parser ────────────────────────────────────────────────
function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const manifestPath = path.resolve(cwd, arg('manifest', 'assets.manifest.ts'));
const outDir = path.resolve(cwd, arg('out', 'src/assets/generated'));

// ── env (.env in the client app dir; never committed) ──────────────
try { process.loadEnvFile(path.join(cwd, '.env')); } catch { /* no .env — rely on shell */ }
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// ── logging ────────────────────────────────────────────────────────
const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  ok: (s: string) => `\x1b[32m${s}\x1b[0m`,
  warn: (s: string) => `\x1b[33m${s}\x1b[0m`,
  err: (s: string) => `\x1b[31m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

interface Provenance {
  id: string;
  source: string;
  type: string;
  author?: string;
  authorUrl?: string;
  sourceUrl?: string;
  license?: string;
  query?: string;
  prompt?: string;
  aspect: string;
  grade: string;
  output: string;
  downloadedAt: string;
}

// ── color grade ────────────────────────────────────────────────────
function applyGrade(img: sharp.Sharp, grade: Grade): sharp.Sharp {
  if (grade === 'editorial') {
    // Slight desaturation + warm balance toward cammello + soft contrast.
    return img
      .modulate({ saturation: 0.9 })
      .linear([1.05, 1.0, 0.93], [0, 0, 0]) // warm: +R, -B
      .linear(1.06, -8);                      // gentle S-ish contrast
  }
  if (grade === 'duotone') {
    // Map luminance from testa-di-moro (#3E2C20) to avorio (#F5F0E6).
    // modulate(saturation:0) desaturates while KEEPING 3 bands, so the
    // per-channel linear can remap to the two brand colours (grayscale()
    // collapses to 1 band and linear can't expand it).
    const dark = [62, 44, 32];
    const light = [245, 240, 230];
    const mul = light.map((l, i) => (l - dark[i]) / 255) as [number, number, number];
    return img.modulate({ saturation: 0 }).linear(mul, dark as [number, number, number]);
  }
  return img; // none
}

// ── sources ────────────────────────────────────────────────────────
interface Fetched { buffer: Buffer; prov: Partial<Provenance>; }

async function fromPexels(slot: AssetSlot): Promise<Fetched | null> {
  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', slot.query ?? '');
  url.searchParams.set('orientation', pexelsOrientation(slot.aspect));
  url.searchParams.set('per_page', '24');
  url.searchParams.set('size', 'large');
  const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY! } });
  if (!res.ok) {
    console.log(c.err(`  ✗ Pexels ${res.status} for "${slot.query}"`));
    return null;
  }
  const data = (await res.json()) as { photos?: PexelsPhoto[] };
  const photos = data.photos ?? [];
  if (!photos.length) {
    console.log(c.warn(`  ⚠ no Pexels results for "${slot.query}" — left as placeholder`));
    return null;
  }
  // Highest resolution wins (already orientation-filtered).
  photos.sort((a, b) => b.width * b.height - a.width * a.height);
  const best = photos[0];
  const dl = await fetch(best.src.original);
  const buffer = Buffer.from(await dl.arrayBuffer());
  return {
    buffer,
    prov: {
      source: 'pexels',
      author: best.photographer,
      authorUrl: best.photographer_url,
      sourceUrl: best.url,
      license: 'Pexels License (https://www.pexels.com/license/)',
      query: slot.query,
    },
  };
}

interface PexelsPhoto {
  width: number; height: number; url: string;
  photographer: string; photographer_url: string;
  src: { original: string };
}

function hasCommand(cmd: string): boolean {
  const which = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(which, [cmd]).status === 0;
}

function fromMflux(slot: AssetSlot): Fetched | null {
  if (!hasCommand('mflux-generate')) {
    console.log(c.warn(`  ⚠ mflux not installed — skipping aigen "${slot.id}" (pip install mflux)`));
    return null;
  }
  const { width, height } = aspectDimensions(slot.aspect, 1024);
  const tmp = path.join(os.tmpdir(), `edf-${slot.id}.png`);
  const r = spawnSync('mflux-generate', [
    '--model', 'schnell', '--prompt', slot.prompt ?? '',
    '--width', String(width), '--height', String(height),
    '--steps', '2', '--output', tmp,
  ], { stdio: 'inherit' });
  if (r.status !== 0 || !fs.existsSync(tmp)) {
    console.log(c.err(`  ✗ mflux failed for "${slot.id}"`));
    return null;
  }
  return { buffer: fs.readFileSync(tmp), prov: { source: 'mflux/flux', license: 'FLUX (locally generated)', prompt: slot.prompt } };
}

// ── per-slot pipeline ──────────────────────────────────────────────
async function processSlot(slot: AssetSlot, provenance: Provenance[]) {
  if (slot.type === 'code') {
    console.log(c.dim(`  · ${slot.id} — code visual, skip`));
    return;
  }
  const fetched = slot.type === 'aigen' ? fromMflux(slot) : await fromPexels(slot);
  if (!fetched) return;

  const { width, height } = aspectDimensions(slot.aspect, 2400);
  const outPath = path.join(outDir, `${slot.id}.webp`);
  const base = sharp(fetched.buffer, { failOn: 'none' })
    .rotate()
    .resize(width, height, { fit: 'cover', position: 'attention' });
  await applyGrade(base, slot.grade ?? 'none')
    .webp({ quality: 82 })
    .toFile(outPath);

  provenance.push({
    id: slot.id,
    type: slot.type,
    source: fetched.prov.source ?? 'unknown',
    author: fetched.prov.author,
    authorUrl: fetched.prov.authorUrl,
    sourceUrl: fetched.prov.sourceUrl,
    license: fetched.prov.license,
    query: fetched.prov.query,
    prompt: fetched.prov.prompt,
    aspect: slot.aspect,
    grade: slot.grade ?? 'none',
    output: `${slot.id}.webp`,
    downloadedAt: new Date().toISOString(),
  });
  console.log(c.ok(`  ✓ ${slot.id} → ${path.relative(cwd, outPath)} (${width}×${height}, ${slot.grade ?? 'none'})`));
}

// ── main ───────────────────────────────────────────────────────────
async function main() {
  console.log(c.bold(`\nbuild-assets · ${path.relative(path.resolve(cwd, '../..'), manifestPath)}`));
  const mod = await import(pathToFileURL(manifestPath).href);
  const assets: AssetSlot[] = mod.assets ?? mod.default;
  if (!Array.isArray(assets)) throw new Error(`Manifest must export an "assets" array: ${manifestPath}`);

  const stockCount = assets.filter((s) => s.type === 'stock').length;
  if (stockCount > 0 && !PEXELS_API_KEY) {
    console.log(c.err(`\n  Missing PEXELS_API_KEY.`));
    console.log(`  ${stockCount} stock slot(s) need it. Get a free key at https://www.pexels.com/api/`);
    console.log(`  Then add it to ${c.bold(path.join(cwd, '.env'))} (PEXELS_API_KEY=...) and re-run.`);
    console.log(c.dim(`  The key is build-time only — it never ships to the site or CI.\n`));
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const provenance: Provenance[] = [];
  for (const slot of assets) await processSlot(slot, provenance);

  await writeFile(path.join(outDir, 'provenance.json'), JSON.stringify(provenance, null, 2) + '\n');
  console.log(c.bold(`\n${provenance.length} asset(s) generated · provenance.json written\n`));
}

main().catch((e) => { console.error(c.err(String(e?.stack ?? e))); process.exit(1); });
