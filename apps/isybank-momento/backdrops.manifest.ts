import type { AssetSlot } from '@edf/core/assets/types';

/**
 * «Il momento giusto» (Isybank × Adobe) — a DISTINCT Firefly backdrop per slide.
 * Palette locked in the prompt: nero inchiostro (#101318) + blu (#1B99FB) +
 * menta (#26E5AE) + a single warm arancio (#FF6200) point = "il momento".
 * Three tonal families:
 *   ink-*  → hero/cover slides: flowing ribbons of light, one orange point
 *   soft-* → content slides with panels: very quiet, faint glow, mostly empty dark
 *   warm-* → rotta cover + chiusura: the orange moment grows
 * Every prompt forces generous empty dark space + low contrast so body text stays
 * legible under the CSS scrim. Abstract by construction: no people, faces, phones,
 * screens, logos or text (Isybank/Adobe brand safety). Firefly + Content Credentials.
 *
 * Generate: pnpm --filter isybank-momento assets:build --manifest backdrops.manifest.ts --out src/assets/generated/bg
 */
const NO_TEXT =
  'text, letters, words, typography, captions, watermarks, signatures, logos, brand marks, icons, ' +
  'people, faces, hands, phones, smartphones, screens, devices, cards, money, coins, buildings';
const NEG_INK = NO_TEXT + ', bright center, blown highlights, harsh glare, busy clutter, noise, low quality, red, purple, pink, yellow';
const NEG_SOFT = NO_TEXT + ', bright areas, strong shapes, high contrast, busy clutter, noise, low quality, red, purple, pink, yellow';

const PALETTE =
  ', deep ink-black background (#101318), electric blue (#1B99FB) and mint green (#26E5AE) light, ' +
  'one single tiny warm orange (#FF6200) point of light, cinematic soft glow, generous empty dark space, ' +
  'calm and premium, high detail, abstract, no text';
const PALETTE_SOFT =
  ', deep ink-black background (#101318), very faint electric blue (#1B99FB) and mint (#26E5AE) glow, ' +
  'almost entirely empty dark space, very low contrast, subtle, calm, high detail, abstract, no text';
const PALETTE_WARM =
  ', deep ink-black background (#101318), a soft warm orange (#FF6200) glow rising from one edge, faint electric blue (#1B99FB) ' +
  'and mint (#26E5AE) accents far away, cinematic, generous empty dark space, calm, high detail, abstract, no text';

const ink = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art', prompt: prompt + PALETTE,
  negativePrompt: NEG_INK, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});
const soft = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art', prompt: prompt + PALETTE_SOFT,
  negativePrompt: NEG_SOFT, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});
const warm = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art', prompt: prompt + PALETTE_WARM,
  negativePrompt: NEG_INK, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});

export const assets: AssetSlot[] = [
  // ── INK (4) — covers ────────────────────────────────────────────
  ink('ink-1', 'two wide translucent ribbons of blue and mint light flowing slowly toward each other across the lower third, meeting at a single point', 301),
  ink('ink-2', 'a slow river of blue light bending into mint light along a low horizon, dark quiet sky above', 302),
  ink('ink-3', 'fine converging threads of blue and mint light receding to a distant point on the left, wide empty dark space on the right', 303),
  ink('ink-4', 'six soft points of blue and mint light scattered along a gentle curve, one of them warm orange, dark empty space above', 304),
  // ── SOFT (11) — content slides ─────────────────────────────────
  soft('soft-1', 'a faint blue glow low at the bottom-left edge, mint haze far top-right, everything else near-black', 321),
  soft('soft-2', 'a barely visible diagonal drift of blue haze from the top-left corner into darkness', 322),
  soft('soft-3', 'a faint mint glow along the bottom edge, quiet dark field above', 323),
  soft('soft-4', 'two faint soft orbs of blue and mint light far apart near the bottom corners, dark centre', 324),
  soft('soft-5', 'a faint blue veil rising from the bottom-right, near-black elsewhere', 325),
  soft('soft-6', 'a whisper of mint light along the left edge fading into darkness', 326),
  soft('soft-7', 'a faint soft radial blue glow near the top-right corner, dark quiet space', 327),
  soft('soft-8', 'faint flowing topographic contour lines in blue and mint across near-black, extremely subtle', 328),
  soft('soft-9', 'a faint horizontal band of blue haze low in the frame, empty dark space above', 329),
  soft('soft-10', 'three faint diagonal shafts of pale blue light through a deep dark haze, very subtle', 330),
  soft('soft-11', 'a faint mint glow low at the bottom-right edge, blue haze far top-left, everything else near-black', 331),
  // ── WARM (2) — rotta cover + chiusura ──────────────────────────
  warm('warm-1', 'a soft warm orange glow rising from the bottom-right corner like a distant dawn over a dark field, blue and mint threads far on the left', 341),
  warm('warm-2', 'a single small warm orange point of light at the lower centre with a soft halo, blue and mint ribbons of light fading around it, dark quiet space above', 342),
];
