import type { AssetSlot } from '@edf/core/assets/types';

/**
 * «Sei domande» (Adobe × Poste Italiane) — sfondi Adobe Firefly, uno per famiglia di slide.
 * Palette letta dal CSS di produzione di poste.it: blu di sistema #0047bb, blu #4270e4,
 * azzurro #f2f8ff, giallo di marchio #eedc00, inchiostro #1a1c1e.
 * Tre famiglie:
 *   notte-* → cover dei capitoli (fondo inchiostro, luce blu, un punto giallo = la risposta)
 *   carta-* → slide di contenuto chiare (bianco/azzurro, velature blu appena percettibili)
 *   giallo-* → cover di apertura e slide-firma (il giallo cresce)
 * Astratti per costruzione: niente persone, telefoni, schermi, loghi, testo, uffici postali.
 *
 * Generate: pnpm --filter poste-sei-domande assets:build --manifest backdrops.manifest.ts --out src/assets/generated/bg
 */
const NO_TEXT =
  'text, letters, words, typography, captions, watermarks, signatures, logos, brand marks, icons, ' +
  'people, faces, hands, phones, smartphones, screens, devices, cards, money, coins, buildings, envelopes, mailboxes, vans';
const NEG_DARK = NO_TEXT + ', bright center, blown highlights, harsh glare, busy clutter, noise, low quality, red, purple, pink, green, orange';
const NEG_LIGHT = NO_TEXT + ', dark areas, black, strong shapes, high contrast, saturated blocks, busy clutter, noise, low quality, red, purple, pink, green, orange';

const PALETTE_NOTTE =
  ', deep ink-black background (#1a1c1e), soft royal blue (#0047bb) and lighter blue (#4270e4) light, ' +
  'one single small warm yellow (#eedc00) point of light, cinematic soft glow, generous empty dark space, ' +
  'calm and precise, high detail, abstract, no text';
const PALETTE_CARTA =
  ', clean white background (#ffffff) with a very pale blue (#f2f8ff) tint, faint royal blue (#0047bb) haze, ' +
  'almost entirely empty bright space, very low contrast, airy, subtle, high detail, abstract, no text';
const PALETTE_GIALLO =
  ', deep ink-black background (#1a1c1e), a soft warm yellow (#eedc00) glow rising from one edge, ' +
  'royal blue (#0047bb) light far away, cinematic, generous empty dark space, calm, high detail, abstract, no text';

const notte = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art', prompt: prompt + PALETTE_NOTTE,
  negativePrompt: NEG_DARK, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});
const carta = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art', prompt: prompt + PALETTE_CARTA,
  negativePrompt: NEG_LIGHT, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});
const giallo = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art', prompt: prompt + PALETTE_GIALLO,
  negativePrompt: NEG_DARK, aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});

export const assets: AssetSlot[] = [
  // ── NOTTE (6) — una cover per capitolo ────────────────────────────────────
  notte('notte-1', 'a single thin line of blue light switching on across a dark field, from left to right, a small yellow point at its end', 401),
  notte('notte-2', 'a slow river of blue light bending along a low horizon, small yellow point far on the right, dark quiet sky above', 402),
  notte('notte-3', 'fine threads of blue light converging to one point low on the left, wide empty dark space on the right, one yellow point at the convergence', 403),
  notte('notte-4', 'a calm grid of faint blue lines receding into darkness, one cell softly lit in yellow, generous empty dark space', 404),
  notte('notte-5', 'two translucent layers of blue light one above the other, a thin sealed seam of light between them, dark empty space around', 405),
  notte('notte-6', 'a soft blue glow low at the bottom edge and a distant yellow point rising like a small dawn, dark quiet space above', 406),
  // ── CARTA (4) — slide di contenuto chiare ─────────────────────────────────
  carta('carta-1', 'a faint pale blue haze low at the bottom-left, everything else clean white', 421),
  carta('carta-2', 'a barely visible diagonal drift of pale blue from the top-right corner into white', 422),
  carta('carta-3', 'faint flowing topographic contour lines in pale blue across white, extremely subtle', 423),
  carta('carta-4', 'a soft pale blue horizontal band low in the frame, clean white space above', 424),
  // ── GIALLO (2) — apertura e firma ──────────────────────────────────────────
  giallo('giallo-1', 'a soft warm yellow glow rising from the bottom-right corner over a dark field, thin blue threads far on the left', 441),
  giallo('giallo-2', 'a single small warm yellow point of light at the lower centre with a soft halo, blue ribbons of light fading around it, dark quiet space above', 442),
];
