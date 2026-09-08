import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Regeneration subset (2026-09-08 critique pass): the eight backdrops that read as
 * generic "AI tech" (light tunnel, bokeh, starfield, silk waves, A4 piles) become
 * abstract textures of ministerial paperwork — protocol paper, ink, form screens,
 * paper fibre, the light of an empty school desk. Same ids as backdrops.manifest.ts
 * so the pages keep their imports. Run with --out to a scratch dir, then copy the
 * webp files over and MERGE provenance.json (the pipeline rewrites it with only the
 * processed slots).
 */
const NO_LETTERS =
  'letters, letterforms, alphabet, glyphs, characters, typography, printed type, words, ' +
  'runes, symbols, legible text, captions, signatures, watermarks, stamps with text, logos';
const NEG_NAVY = NO_LETTERS + ', tunnel, bokeh, starfield, galaxy, silk, satin, fabric, cloth, waves, curves, folds, drapery, book, open book, pages, notebook, monitor, screen, television, laptop, desk objects, plant, vase, furniture, neon, glare, people, faces, hands, buildings, flag, red, orange, garish colors, busy clutter, low quality';
const NEG_PAPER = NO_LETTERS + ', open book, ledger, notebook, ruled lines, page fold, book spine, stacked A4 piles, flowers, foliage, people, faces, hands, buildings, flag, dark background, red, orange, garish colors, busy clutter, low quality';

const navy = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art',
  prompt: prompt + ', deep navy background (#0A1A33), a single institutional blue accent (#0066CC), dark and low-key, calm, soft cinematic light, generous empty dark space, matte, abstract, no text',
  negativePrompt: NEG_NAVY, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});
const paper = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art',
  prompt: prompt + ', cool near-white paper (#F4F6F9), a whisper of institutional blue (#0066CC), minimal, sober, abundant empty space, subtle matte grain, high detail, no words',
  negativePrompt: NEG_PAPER, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});

export const assets: AssetSlot[] = [
  navy('navy-1', 'flat top-down extreme macro of matte paper fibre texture in deep shadow, one thin perfectly straight horizontal line of pale blue light lying on the surface, flat, no depth, no curves', 301),
  navy('navy-3', 'flat dark matte paper field with a faint cool dot-screen retino texture, a soft diffuse pool of pale light in the lower-left corner, empty, flat, top-down', 303),
  navy('navy-7', 'a soft pale blue gradient glow rising from the bottom edge across a flat dark matte paper texture, abstract, flat, top-down, nothing else', 307),
  navy('navy-8', 'flat top-down view of dark matte paper with one precise thin straight horizontal line of blue ink, ruled, minimal, flat, no curves, nothing else', 308),
];
