import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Alfabeti (MIM) — bespoke backdrops generated with Adobe Firefly Services.
 * Concept A+C ("alfabeto astratto-tipografico" + "archivio luminoso"), palette
 * blu Italia (#0B4DA2 / #2E6FD6) + carta calda (#F6F1E7) on deep navy (#0A1A33).
 *
 * The palette is locked in the PROMPT (the shared `duotone` grade maps to a
 * brown/ivory pair that belongs to other experiences, so MIM uses `grade: 'none'`
 * and trusts the prompt + a strong negative prompt). Content is fully abstract:
 * no faces, no people, no legible text, no logos — safe by construction and
 * commercially clear + C2PA-signed.
 *
 * Slots map to the three backdrop roles used by the pages (see global.css):
 *   bg-navy       → `.alf-bg-navy`  (dark hero / quote slides)
 *   bg-carta      → `.alf-bg`       (light primary slides)
 *   bg-carta-soft → `.alf-bg-soft`  (light secondary slides)
 *
 * Spike-first: generate 2-3 candidates per slot by varying `seed`, review at
 * 1920, then lock the winners. Regenerate with:  pnpm --filter mim-alfabeti assets:build
 */
export const assets: AssetSlot[] = [
  {
    id: 'bg-navy',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Abstract institutional composition: Italian letterforms and ink strokes emerging from luminous depth, ' +
      'deep navy background (#0A1A33) lit by institutional blue (#0B4DA2 and #2E6FD6), fragments of handwritten ' +
      'and printed alphabet interleaved with subtle archival paper grain and document textures dissolving into ' +
      'darkness, calm and sober, elegant, cinematic soft light, generous empty space, high detail, no text blocks',
    negativePrompt:
      'people, faces, hands, brand logos, watermarks, signatures, legible words, red, orange, garish colors, ' +
      'busy clutter, low quality',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    seed: 1,
    alt: '',
  },
  {
    id: 'bg-carta',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Warm ivory paper field (#F6F1E7) covered with faint embossed Italian letterforms of a printed alphabet and ' +
      'delicate ink strokes, subtle archival document lines and typographic marginalia, gentle folds and soft ' +
      'raking light, very subtle institutional blue accents (#0B4DA2), minimal, airy, sober and institutional, ' +
      'abundant empty space in the centre, high detail, no legible words',
    negativePrompt:
      'flowers, leaves, plants, foliage, vines, botanical, floral ornament, decorative scrollwork, ' +
      'people, faces, hands, brand logos, watermarks, legible words, dark background, red, orange, garish colors, ' +
      'busy clutter, low quality',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    seed: 7,
    alt: '',
  },
  {
    id: 'bg-carta-soft',
    type: 'firefly',
    contentClass: 'photo',
    prompt:
      'Stacked sheets of warm ivory archival paper seen at a soft angle, edges of documents and ledgers layered ' +
      'in a calm minimal field, warm cream and ivory tones dominant (#F6F1E7) with only a faint hint of pale ' +
      'institutional blue, quiet raking light, matte paper texture, elegant and sober, lots of empty space, ' +
      'shallow depth of field, no legible writing',
    negativePrompt:
      'blue wave, glossy plastic, 3d render wallpaper, water, liquid, saturated blue, teal, cold tones, ' +
      'people, faces, hands, brand logos, watermarks, legible words, dark background, red, orange, garish colors, ' +
      'busy clutter, low quality',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    seed: 7,
    alt: '',
  },
];
