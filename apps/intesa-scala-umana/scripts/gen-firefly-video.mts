/**
 * Le clip di sfondo per «Su scala umana».
 *
 * Stessa famiglia degli sfondi fermi: macro, un gesto solo, composizione
 * asimmetrica, verde desaturato, niente persone e niente testo. La differenza
 * è che qui il gesto deve essere QUASI FERMO — una clip di sfondo che si muove
 * ruba lo sguardo al testo che le sta sopra, ed è il difetto tipico delle clip
 * generate: il modello, se lo lasci fare, ti dà una carrellata.
 *
 * Ogni clip va poi ricucita con `pnpm loop:seamless <file> --poster`, se no il
 * giro si vede. La misura (PSNR prima/dopo) finisce in `provenance.video.json`.
 *
 * Uso:  npx tsx apps/intesa-scala-umana/scripts/gen-firefly-video.mts [--only id]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fireflyCredentialsFromEnv, generateVideo } from '../../../scripts/lib/firefly.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
/** Le sorgenti stanno fuori da `src`: i .mp4 non entrano nel repo. */
const OUT = path.join(HERE, '..', 'media');

function loadEnv(): void {
  for (const rel of [
    'apps/unicredit-engagement/.env',
    'apps/isybank-momento/.env',
    'apps/poste-sei-domande/.env',
    'apps/atelier/.env',
    'apps/mim-alfabeti/.env',
  ]) {
    const p = path.join(REPO, rel);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
    if (process.env.FIREFLY_CLIENT_ID) {
      console.log(`credenziali da ${rel}`);
      return;
    }
  }
}

const NEG =
  'camera movement, pan, tilt, zoom, dolly, tracking shot, fast motion, ' +
  'denim, jeans, indigo, blue grey, steel grey, ' +
  'text, letters, words, numbers, logo, brand, watermark, signature, people, faces, hands, ' +
  'buildings, architecture, office interior, desk, laptop, handshake, stock photo, money, ' +
  'collage, clipart, 3d render, cartoon, neon, cyberpunk, rainbow colours, ' +
  'grass, field, meadow, landscape, horizon, sky, trees, plants, nature scene, ' +
  'laser beam, light beam, light trail, glow, bloom, neon green, acid green, saturated green, ' +
  'centered composition, mirrored, symmetrical composition, dense pattern, busy, cluttered, ' +
  'glossy, reflective, wet, saturated cyan, blue, glowing grid, circuit board';

const SLOTS = [
  {
    // La copertina: la stessa materia dello sfondo fermo `cover-scala`, ma che
    // respira. Due terzi di fotogramma quasi neri, dove va il titolo.
    id: 'isu-cover',
    prompt:
      'Extreme macro, almost still: dark green mineral strata with fine layered bands running ' +
      'diagonally from the lower left toward the upper right, one single pale edge catching a ' +
      'grazing light high on the right that brightens and fades almost imperceptibly over five ' +
      'seconds. The lower left two thirds stay in near-black green shadow throughout. Deep ' +
      'desaturated forest green, matte, geological, no gloss. Locked-off camera, barely-there ' +
      'motion, fine film grain, strongly asymmetric, abstract',
    seed: 3340,
  },
];

async function main() {
  loadEnv();
  const creds = fireflyCredentialsFromEnv();
  if (!creds) {
    console.error('FIREFLY_CLIENT_ID / FIREFLY_CLIENT_SECRET non trovate in nessun .env.');
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });

  const onlyArg = process.argv.find((a) => a.startsWith('--only='))
    ?? (process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : undefined);
  const only = onlyArg?.replace(/^--only=/, '').split(',').map((s) => s.trim()).filter(Boolean);
  const todo = only?.length ? SLOTS.filter((s) => only.includes(s.id)) : SLOTS;

  for (const slot of todo) {
    process.stdout.write(`· ${slot.id} … (il render video richiede minuti) `);
    const r = await generateVideo(creds, {
      prompt: slot.prompt,
      negativePrompt: NEG,
      size: { width: 1920, height: 1080 },
      seconds: 5,
      seed: slot.seed,
    });
    const file = path.join(OUT, `${slot.id}.mp4`);
    fs.writeFileSync(file, r.buffer);
    console.log(`${(r.buffer.length / 1024 / 1024).toFixed(1)} MB → ${path.relative(REPO, file)}`);
    console.log(`  prossimo passo: pnpm loop:seamless ${path.relative(REPO, file)} --poster`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
