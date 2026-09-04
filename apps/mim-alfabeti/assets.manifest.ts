import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Alfabeti (MIM) — bespoke backdrops generated with Adobe Firefly Services.
 * Palette blu Italia (#0B4DA2 / #2E6FD6) + carta calda (#F6F1E7) on deep navy
 * (#0A1A33).
 *
 * CONCEPT (rev. 2026-09-04): "archivio luminoso" WITHOUT drawn letterforms. The
 * prior pass asked Firefly for "Italian letterforms" and got scattered garbled
 * pseudo-letters (AI slop). We keep the institutional, archival, luminous mood
 * but express it through paper, ink strokes, ledger lines and threads/points of
 * light — never rendered alphabet. Content is fully abstract: no faces, people,
 * legible text or logos — commercially clear + C2PA-signed.
 *
 * The palette is locked in the PROMPT (the shared `duotone` grade maps to a
 * brown/ivory pair that belongs to other experiences, so MIM uses `grade: 'none'`
 * and trusts the prompt + a strong negative prompt).
 *
 * Slots map to the three backdrop roles used by the pages (see global.css):
 *   bg-navy       → `.alf-bg-navy`  (dark hero / quote slides)
 *   bg-carta      → `.alf-bg`       (light primary slides)
 *   bg-carta-soft → `.alf-bg-soft`  (light secondary slides)
 *
 * Regenerate with:  pnpm --filter mim-alfabeti assets:build
 */
const NO_LETTERS =
  'letters, letterforms, alphabet, glyphs, characters, typography, printed type, words, ' +
  'runes, symbols, legible text, captions, signatures, watermarks';

export const assets: AssetSlot[] = [
  {
    id: 'bg-navy',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Abstract institutional composition on a deep navy background (#0A1A33): fine luminous threads and soft ' +
      'points of institutional-blue light (#0B4DA2 and #2E6FD6) emerging from luminous depth, subtle archival ' +
      'paper grain and faint document textures dissolving into darkness, calm and sober, elegant, cinematic ' +
      'soft light, generous empty space, high detail, no text',
    negativePrompt:
      NO_LETTERS + ', people, faces, hands, brand logos, red, orange, garish colors, busy clutter, low quality',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    seed: 31,
    alt: '',
  },
  {
    id: 'bg-carta',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'A single flat sheet of warm ivory paper (#F6F1E7) filling the frame, very faint embossed texture and the ' +
      'softest raking light, a whisper of pale institutional-blue (#0B4DA2) tint, completely minimal and calm, ' +
      'abundant empty space, subtle matte grain, elegant and sober, high detail',
    negativePrompt:
      NO_LETTERS + ', open book, ledger, notebook, ruled lines, lined paper, page fold, book spine, border, ' +
      'frame, grid, flowers, leaves, plants, foliage, botanical, floral ornament, decorative scrollwork, ' +
      'people, faces, hands, brand logos, dark background, red, orange, garish colors, busy clutter, low quality',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    seed: 43,
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
      'shallow depth of field, no writing',
    negativePrompt:
      NO_LETTERS + ', blue wave, glossy plastic, 3d render wallpaper, water, liquid, saturated blue, teal, ' +
      'cold tones, people, faces, hands, brand logos, dark background, red, orange, garish colors, busy clutter, low quality',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    seed: 7,
    alt: '',
  },
];
