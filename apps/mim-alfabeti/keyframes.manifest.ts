import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Alfabeti (MIM) — 4 keyframes for the "frammentazione → una voce" scroll page.
 * Crossfaded/scrubbed on scroll, one frame per transformation stage.
 *
 * CONCEPT (rev. 2026-09-04): a LIGHT-ORDERING arc, NOT letterforms. The prior
 * pass asked Firefly for "Italian letterforms" and got a wall of garbled 3D
 * pseudo-glyphs — classic AI slop. We keep the same four-beat narrative
 * (scattered → gathering → governed grid → composed) but tell it with points and
 * threads of institutional-blue light on deep navy: clean, cinematic, abstract,
 * on-brand, and impossible to read as fake alphabet. Same palette family as the
 * hero (navy + blu Italia + ivory). No people, faces, text, logos. Firefly + C2PA.
 *
 * Generate:  pnpm --filter mim-alfabeti assets:build --manifest keyframes.manifest.ts --out src/assets/generated/keyframes
 */
const COMMON_NEG =
  'letters, letterforms, alphabet, glyphs, characters, typography, printed type, words, ' +
  'runes, symbols, numbers, captions, legible text, watermarks, signatures, ' +
  'people, faces, hands, workers, brand logos, red, orange, garish colors, busy clutter, low quality';

export const assets: AssetSlot[] = [
  {
    id: 'kf-transform-1',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Deep navy void (#0A1A33): sparse, dim points and embers of cold institutional-blue light scattered in ' +
      'disorder across a vast dark field, faint drifting particles and thin broken threads of light, ' +
      'lots of empty dark space, quiet, cinematic, high detail, abstract, no text',
    negativePrompt: COMMON_NEG,
    aspect: '16:9', width: 2400, grade: 'none', seed: 21, alt: '',
  },
  {
    id: 'kf-transform-2',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Deep navy field (#0A1A33): points of luminous institutional-blue light (#0B4DA2, #2E6FD6) drifting ' +
      'together, converging streams of particles and connecting threads of light beginning to link up, ' +
      'a sense of gathering order emerging from the dark, cinematic soft light, high detail, abstract, no text',
    negativePrompt: COMMON_NEG,
    aspect: '16:9', width: 2400, grade: 'none', seed: 22, alt: '',
  },
  {
    id: 'kf-transform-3',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Deep navy field (#0A1A33): points of light resolved into a clear, coherent luminous geometric grid, ' +
      'ordered nodes connected by bright institutional-blue lines (#0B4DA2, #2E6FD6), calm and governed, ' +
      'architectural network composition, cinematic, high detail, abstract, no text',
    negativePrompt: COMMON_NEG,
    aspect: '16:9', width: 2400, grade: 'none', seed: 23, alt: '',
  },
  {
    id: 'kf-transform-4',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Deep navy field (#0A1A33): a single fully composed, radiant architecture of light — an ordered luminous ' +
      'structure of connected nodes and beams glowing in warm ivory and institutional blue (#F6F1E7, #0B4DA2), ' +
      'accomplished and serene, elegant and institutional, cinematic soft light, high detail, abstract, no text',
    negativePrompt: COMMON_NEG,
    aspect: '16:9', width: 2400, grade: 'none', seed: 24, alt: '',
  },
];
