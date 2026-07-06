import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Ferrari Racing — image slots. `stock` slots are filled from Pexels by
 * `pnpm --filter ferrari-racing assets:build` (needs PEXELS_API_KEY).
 * Queries avoid trademarks; motorsport/atmosphere imagery, graded dark.
 */
export const assets: AssetSlot[] = [
  // ── Backgrounds ───────────────────────────────────────────────────
  // Abstract, CAR-FREE atmospherics (Pexels motorsport photos often show
  // non-Ferrari/competitor cars — never depict an identifiable car here).
  { id: 'bg-track-night', type: 'stock', query: 'stadium floodlights night bokeh blur dark abstract lights', aspect: '16:9', width: 2400, grade: 'duotone', alt: '' },
  { id: 'bg-carbon', type: 'stock', query: 'carbon fiber texture dark macro weave black minimal', aspect: '16:9', width: 2400, grade: 'duotone', alt: '' },
  { id: 'bg-pit', type: 'stock', query: 'dark red glowing light streaks motion abstract technology', aspect: '16:9', width: 2400, grade: 'editorial', alt: '' },
  { id: 'bg-grid', type: 'stock', query: 'asphalt tarmac texture dark aerial abstract pattern road', aspect: '16:9', width: 2400, grade: 'duotone', alt: '' },
  // ── Story imagery ─────────────────────────────────────────────────
  { id: 'tifosi', type: 'stock', query: 'motorsport fans grandstand crowd red flags celebration passion', aspect: '16:9', width: 2400, grade: 'editorial', alt: 'Passionate motorsport fans in the grandstand' },
  { id: 'podium', type: 'stock', query: 'motorsport podium celebration champagne trophy crowd', aspect: '16:9', width: 2400, grade: 'editorial', alt: 'Podium celebration' },
  { id: 'data-telemetry', type: 'stock', query: 'abstract data visualization glowing lines red network dark analytics', aspect: '16:9', width: 2400, grade: 'duotone', alt: 'Abstract telemetry data visualization' },
  { id: 'content-studio', type: 'stock', query: 'creative content studio designer screens editing brand campaign', aspect: '16:9', width: 2400, grade: 'editorial', alt: 'A creative content studio' },
  { id: 'billboard', type: 'stock', query: 'digital billboard advertising city night brand campaign screens', aspect: '16:9', width: 2400, grade: 'editorial', alt: 'Digital advertising billboards at night' },
  { id: 'boardroom', type: 'stock', query: 'executive boardroom meeting partnership handshake modern office', aspect: '16:9', width: 2400, grade: 'editorial', alt: 'An executive partnership meeting' },
];
