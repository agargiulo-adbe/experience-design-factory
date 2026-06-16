/**
 * Asset pipeline — shared types and geometry helpers.
 * Used by: the per-client manifest, the MediaSlot engine component, and the
 * reusable build-assets script.
 */

export type AssetType = 'stock' | 'aigen' | 'code';
export type Aspect = '16:9' | '9:16' | '1:1' | '4:5';
export type Grade = 'editorial' | 'duotone' | 'none';

export interface AssetSlot {
  /** Stable id — also the output filename (`<id>.webp`). */
  id: string;
  /** stock = fetch from Pexels · aigen = local FLUX · code = visual already in code. */
  type: AssetType;
  /** Search query for `stock`. */
  query?: string;
  /** Generation prompt for `aigen`. */
  prompt?: string;
  aspect: Aspect;
  /** Intended display width (px) — drives responsive `widths`. */
  width: number;
  /** Brand color-grade preset applied to the generated source. */
  grade?: Grade;
  /** Accessible description (also the placeholder aria-label). */
  alt: string;
}

export const ASPECT_RATIO: Record<Aspect, number> = {
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  '1:1': 1,
  '4:5': 4 / 5,
};

/** CSS `aspect-ratio` value, e.g. "16 / 9". */
export const ASPECT_CSS: Record<Aspect, string> = {
  '16:9': '16 / 9',
  '9:16': '9 / 16',
  '1:1': '1 / 1',
  '4:5': '4 / 5',
};

/** Output dimensions for a high-res graded source (long edge = `long`). */
export function aspectDimensions(aspect: Aspect, long = 2400): { width: number; height: number } {
  const r = ASPECT_RATIO[aspect];
  if (r >= 1) return { width: long, height: Math.round(long / r) };
  return { width: Math.round(long * r), height: long };
}

/** Pexels `orientation` parameter best matching an aspect. */
export function pexelsOrientation(aspect: Aspect): 'landscape' | 'portrait' | 'square' {
  const r = ASPECT_RATIO[aspect];
  if (Math.abs(r - 1) < 0.01) return 'square';
  return r > 1 ? 'landscape' : 'portrait';
}
