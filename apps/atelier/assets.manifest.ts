import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Experience Atelier — the three photographic backdrops the deck really uses, generated
 * with Adobe Firefly on the Atelier's own palette (warm carbon #12100C + champagne
 * #C9A96A). Until 2026-09-14 these were Pexels stock; the deck that tells the story of
 * a Factory built on Adobe capabilities now has its backdrops made the same way the
 * client experiences do. Abstract by construction: threads, light and cloth — no
 * people, no faces, no text, no logos. Provenance (model, seed) lands in provenance.json.
 *
 * Generate: pnpm --filter atelier assets:build
 */
const NO_TEXT =
  'text, letters, words, typography, captions, watermarks, signatures, logos, brand marks, ' +
  'people, faces, hands, figures, silhouettes, screens, devices, buildings, furniture';
const NEG =
  NO_TEXT + ', bright center, blown highlights, harsh glare, neon, blue, cyan, purple, pink, ' +
  'saturated colors, busy clutter, noise, low quality';

const PALETTE =
  ', warm near-black background (#12100C), fine champagne gold (#C9A96A) and bronze (#9A7B45) light, ' +
  'soft cinematic glow, generous empty dark space, calm and premium, high detail, abstract, no text';

const loom = (id: string, prompt: string, seed: number, alt: string): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art', prompt: prompt + PALETTE,
  negativePrompt: NEG, aspect: '16:9', width: 2400, grade: 'none', seed, alt,
});

export const assets: AssetSlot[] = [
  // Overture cover — the warp: many fine golden threads under tension on the dark loom.
  loom(
    'bg-atelier',
    'fine golden warp threads of light stretched horizontally across a dark warm loom, soft raking light from one side, shallow depth of field, threads fading into darkness at the edges',
    501,
    'Fine golden threads of light stretched across a dark loom, fading into warm darkness.',
  ),
  // The multiplication cover — one thread fanning into many.
  loom(
    'bg-loom',
    'one single bright golden thread of light entering from the left edge and fanning out into many fine threads toward the right, on warm near-black, slow soft glow along each thread',
    502,
    'One golden thread of light fanning out into many across warm darkness.',
  ),
  // Closing — the next step: a single pool of warm spotlight on an empty dark stage floor.
  loom(
    'bg-stage',
    'a single soft pool of warm golden spotlight falling on an empty dark stage floor, seen from the side at a low angle, faint haze in the beam, the floor fading into warm darkness, wide empty dark space above',
    503,
    'A single pool of warm spotlight on an empty dark stage, haze in the beam.',
  ),
];
