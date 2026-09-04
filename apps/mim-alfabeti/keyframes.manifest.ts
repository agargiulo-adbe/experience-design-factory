import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Alfabeti (MIM) — 4 keyframes for the "alfabeto → competenza" scroll page.
 * Crossfaded on scroll (a smooth, lightweight stand-in for a Firefly Video clip
 * while the Video API isn't enabled on the key). Each frame = one transformation
 * stage. Same visual family as the hero (navy + blu Italia + ivory), abstract:
 * no people, no faces, no legible text, no logos. Firefly-generated + C2PA.
 *
 * Generate:  pnpm --filter mim-alfabeti assets:build --manifest keyframes.manifest.ts
 */
const COMMON_NEG =
  'people, faces, hands, workers, brand logos, watermarks, legible words, captions, ' +
  'red, orange, garish colors, busy clutter, low quality';

export const assets: AssetSlot[] = [
  {
    id: 'kf-transform-1',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Deep navy field (#0A1A33): scattered, dim Italian letterforms drifting apart in disorder, faint and ' +
      'fragmented, sparse cold institutional blue glow, lots of empty dark space, quiet, cinematic, high detail',
    negativePrompt: COMMON_NEG,
    aspect: '16:9', width: 2400, grade: 'none', seed: 11, alt: '',
  },
  {
    id: 'kf-transform-2',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Deep navy field (#0A1A33): luminous Italian letterforms drifting together, some beginning to align into ' +
      'short words, growing institutional blue light (#0B4DA2, #2E6FD6), a sense of gathering order, cinematic ' +
      'soft light, high detail',
    negativePrompt: COMMON_NEG,
    aspect: '16:9', width: 2400, grade: 'none', seed: 12, alt: '',
  },
  {
    id: 'kf-transform-3',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Deep navy field (#0A1A33): Italian letterforms organized into a clear, coherent geometric grid structure, ' +
      'ordered and institutional, bright institutional blue light (#0B4DA2, #2E6FD6), calm and governed, ' +
      'architectural composition, cinematic, high detail',
    negativePrompt: COMMON_NEG,
    aspect: '16:9', width: 2400, grade: 'none', seed: 13, alt: '',
  },
  {
    id: 'kf-transform-4',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Deep navy field (#0A1A33): a fully composed, luminous ordered structure of Italian letterforms resolved ' +
      'into a single coherent form, radiant warm ivory and institutional blue highlights (#F6F1E7, #0B4DA2), ' +
      'accomplished and serene, elegant institutional, cinematic soft light, high detail',
    negativePrompt: COMMON_NEG,
    aspect: '16:9', width: 2400, grade: 'none', seed: 14, alt: '',
  },
];
