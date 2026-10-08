/**
 * Gli sfondi generati per «Su scala umana» (Prospettiva, 22 ottobre 2026).
 *
 * UNA SOLA FAMIGLIA, un gesto per immagine. Le regole sono quelle imparate sui
 * deck precedenti, e si pagano buttando via il primo giro se non si seguono:
 *  · UN gesto solo. Il tunnel di velocità, la griglia luminosa e il campo di
 *    righe sono il cliché da cui stare lontani, e si somigliano fra loro.
 *  · Composizione ASIMMETRICA, con metà fotogramma quasi vuoto: lì va il testo,
 *    e senza quel vuoto il check `d` dell'audit salta.
 *  · Luce fotografica, non grafica vettoriale luminosa.
 *  · Niente persone, niente architetture, niente scrivanie: è una banca, e
 *    l'immagine d'archivio con la stretta di mano è esattamente ciò che la
 *    Quality Bar vieta.
 *
 * PALETTE: il verde notte #0d2901 è il fondo, il verde di sistema #258900 e la
 * sua schiaritura #4fc21f sono la luce, l'arancio #fa9600 è l'unico accento
 * caldo. Sono i valori letti dal CSS di produzione di intesasanpaolo.com, non
 * inventati: gli sfondi appartengono alla stessa skin delle slide.
 *
 * Credenziali: lette da un .env di app esistente (gitignorato). Nessun segreto
 * entra qui dentro.
 *
 * Uso:  npx tsx apps/intesa-scala-umana/scripts/gen-firefly.mts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fireflyCredentialsFromEnv, generateImage } from '../../../scripts/lib/firefly.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const OUT = path.join(HERE, '..', 'src', 'assets', 'generated', 'bg');

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
  'text, letters, words, numbers, logo, brand, watermark, signature, people, faces, hands, ' +
  'buildings, architecture, office interior, desk, laptop, handshake, stock photo, money, ' +
  'collage, clipart, 3d render, cartoon, neon, cyberpunk, rainbow colours, ' +
  'grass, field, meadow, landscape, horizon, sky, trees, plants, nature scene, ' +
  'laser beam, light beam, light trail, light streak, long exposure streaks, glow, bloom, ' +
  'neon green, acid green, saturated green, fluorescent, emerald, lime, ' +
  'centered composition, mirrored, symmetrical composition, stripes, parallel lines, ' +
  'dense pattern, wallpaper, busy, cluttered, glossy, reflective, wet, ' +
  'saturated cyan, blue, glowing grid, circuit board';

const SIZE = { width: 2688, height: 1512 };

const SLOTS = [
  {
    // Copertina. Carta fatta a mano, luce radente da destra: la materia a scala
    // umana, e due terzi di fotogramma in ombra dove va il testo.
    id: 'cover-scala',
    prompt:
      'Extreme macro photograph of dark green mineral strata, fine layered bands flowing ' +
      'diagonally from the lower left toward the upper right, one single pale edge catching ' +
      'a grazing light high on the right, the lower left two thirds sinking into near-black ' +
      'green shadow. Deep desaturated forest green, matte, geological, no gloss. Fine film ' +
      'grain, strongly asymmetric, abstract, no central spine, no chevron, no mirror',
    seed: 3310,
  },
  {
    // «Il vostro anno, visto da fuori»: i bordi impilati di molti fogli — il tempo
    // che si accumula — con una banda di luce sola in basso a destra.
    id: 'stacco-anno',
    prompt:
      'Extreme macro photograph of the stacked edges of many sheets of dark paper seen almost ' +
      'edge-on, receding into deep shadow, a single soft band of cool light grazing the top ' +
      'edges in the lower right of the frame. Deep desaturated green-black, matte and tactile. ' +
      'Fine film grain, shallow depth of field, strongly asymmetric, abstract',
    seed: 3211,
  },
  {
    // «La domanda»: lino scuro, una lama di luce sola che taglia l'angolo basso.
    id: 'stacco-domanda',
    prompt:
      'Extreme macro photograph of dark woven linen, a single soft shaft of light crossing the ' +
      'lower right corner at a shallow angle, the rest of the frame falling into near-black ' +
      'deep green shadow. Matte, tactile, woven texture visible only where the light grazes. ' +
      'Fine film grain, strongly asymmetric, abstract',
    seed: 3212,
  },
  {
    // «Le idee»: pietra scura con una vena naturale, luce ambra calda da destra.
    id: 'stacco-idee',
    prompt:
      'Extreme macro photograph of a dark matte stone surface with one fine natural vein ' +
      'running through the lower right, lit by a single warm amber light grazing from the ' +
      'right edge, the left two thirds in near-black deep green shadow. Geological, tactile, ' +
      'no gloss. Fine film grain, strongly asymmetric, abstract',
    seed: 3213,
  },
  {
    // «La rotta»: una piega sola che continua oltre il bordo del fotogramma.
    id: 'stacco-rotta',
    prompt:
      'Extreme macro photograph of dark paper with one clean folded crease running diagonally ' +
      'from the lower right and continuing beyond the upper edge of the frame, a soft light ' +
      'grazing along the fold. Everything else near-black deep green shadow. Matte, tactile, ' +
      'minimal. Fine film grain, strongly asymmetric, abstract',
    seed: 3214,
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
  const provenance: unknown[] = [];

  for (const slot of SLOTS) {
    process.stdout.write(`· ${slot.id} … `);
    const r = await generateImage(creds, {
      prompt: slot.prompt,
      negativePrompt: NEG,
      contentClass: 'photo',
      size: SIZE,
      seed: slot.seed,
    });
    const file = path.join(OUT, `${slot.id}.jpg`);
    fs.writeFileSync(file, r.buffer);
    console.log(`${(r.buffer.length / 1024).toFixed(0)} KB · seed ${r.seed ?? slot.seed}`);
    provenance.push({
      id: slot.id,
      file: path.basename(file),
      model: r.model,
      seed: r.seed ?? slot.seed,
      contentCredentials: r.contentCredentials,
      prompt: slot.prompt,
      negativePrompt: NEG,
      size: SIZE,
      generatedAt: new Date().toISOString(),
    });
  }

  fs.writeFileSync(
    path.join(OUT, 'provenance.json'),
    JSON.stringify({ tool: 'Adobe Firefly', slots: provenance }, null, 2) + '\n',
  );
  console.log(`\n${SLOTS.length} sfondi in ${path.relative(REPO, OUT)} + provenance.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
