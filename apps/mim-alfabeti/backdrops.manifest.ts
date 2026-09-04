import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Alfabeti (MIM) — a DISTINCT backdrop per slide, so the deck never tiles the
 * same three images. Three tonal families, all calm/institutional/no-letters:
 *   navy-*  → dark, low-key, blu Italia on deep navy (hero/quote slides)
 *   carta-* → flat warm-ivory paper (light primary slides)
 *   soft-*  → ivory archival paper, airy (light secondary slides)
 * Every prompt forces generous empty space + low contrast so body text stays
 * legible under the CSS scrim. Firefly + C2PA.
 *
 * Generate: pnpm --filter mim-alfabeti assets:build --manifest backdrops.manifest.ts --out src/assets/generated/bg
 */
const NO_LETTERS =
  'letters, letterforms, alphabet, glyphs, characters, typography, printed type, words, ' +
  'runes, symbols, legible text, captions, signatures, watermarks';
const NEG_NAVY =
  NO_LETTERS + ', bright center, harsh glare, blown highlights, neon, people, faces, hands, ' +
  'brand logos, red, orange, garish colors, busy clutter, low quality';
const NEG_PAPER =
  NO_LETTERS + ', open book, ledger, notebook, ruled lines, lined paper, page fold, book spine, ' +
  'border, frame, grid, flowers, foliage, botanical, people, faces, hands, brand logos, dark background, ' +
  'red, orange, garish colors, busy clutter, low quality';

const navy = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art',
  prompt: prompt + ', deep navy background (#0A1A33), institutional blue accents (#0B4DA2, #2E6FD6), dark and low-key, calm, cinematic soft light, generous empty dark space, high detail, abstract, no text',
  negativePrompt: NEG_NAVY, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});
const paper = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art',
  prompt: prompt + ', warm ivory tones (#F6F1E7), a whisper of pale institutional blue (#0B4DA2), minimal, airy, sober and institutional, abundant empty space, subtle matte grain, high detail, no words',
  negativePrompt: NEG_PAPER, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});

export const assets: AssetSlot[] = [
  // ── NAVY (8) ──────────────────────────────────────────────────────
  navy('navy-1', 'fine converging streams of light receding to a distant low horizon', 101),
  navy('navy-2', 'a soft aurora of blue light low across the field, wide empty dark sky above', 102),
  navy('navy-3', 'a sparse scatter of faint points of light on near-black, very quiet', 103),
  navy('navy-4', 'gentle diagonal shafts of pale blue light through a deep navy haze', 104),
  navy('navy-5', 'faint architectural contour lines receding into darkness, blueprint depth, empty upper space', 105),
  navy('navy-6', 'a soft low radial glow near the bottom edge, dark quiet space above', 106),
  navy('navy-7', 'fine flowing topographic contour lines across near-black, subtle and calm', 107),
  navy('navy-8', 'layered translucent planes of deep blue fading into darkness, soft depth', 108),
  // ── CARTA (8) — flat paper ────────────────────────────────────────
  paper('carta-1', 'a flat sheet of warm ivory paper, soft raking light from the top-left, faint matte grain', 121),
  paper('carta-2', 'a warm ivory paper surface with soft even light and the faintest embossed texture', 122),
  paper('carta-3', 'a warm ivory paper field with a soft gentle highlight toward the centre', 123),
  paper('carta-4', 'a smooth ivory paper field with a faint cool tint drifting in from the edges', 124),
  paper('carta-5', 'warm ivory paper with the softest diagonal raking light and quiet matte texture', 125),
  paper('carta-6', 'near-white ivory paper with a barely-there fibrous texture and even soft light', 126),
  paper('carta-7', 'warm ivory paper with a faint cool vignette in the corners, very calm', 127),
  paper('carta-8', 'ivory paper with a soft glow along one edge and a quiet matte surface', 128),
  // ── SOFT (7) — archival paper, airy ───────────────────────────────
  paper('soft-1', 'stacked sheets of warm ivory archival paper at a soft angle, shallow depth of field', 141),
  paper('soft-2', 'a few overlapping ivory sheets seen softly from above, generous empty space', 142),
  paper('soft-3', 'the soft curved edge of a single ivory sheet casting a gentle shadow', 143),
  paper('soft-4', 'layered translucent ivory vellum sheets, soft light, airy and quiet', 144),
  paper('soft-5', 'a soft-focus surface of warm ivory paper, blurred, calm and minimal', 145),
  paper('soft-6', 'a calm minimal wash of warm ivory tones with a soft diagonal shadow gradient, abstract and quiet', 246),
  paper('soft-7', 'two ivory cards overlapping on an ivory surface with a soft shadow', 147),
];
