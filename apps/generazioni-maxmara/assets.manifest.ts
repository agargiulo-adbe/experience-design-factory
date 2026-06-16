/**
 * Asset manifest — Generazioni / Max Mara (per-client).
 * One entry per image slot. `pnpm assets:build` fills `stock` (and optional
 * `aigen`) slots into src/assets/generated/<id>.webp. `code` slots are visuals
 * already built in components (no fetch). Extend by adding entries per phase.
 */
import type { AssetSlot } from '@edf/core/assets/types';

export const assets: AssetSlot[] = [
  // ── Acquisizione ──────────────────────────────────────────────────
  {
    id: 'acquisizione-atmosfera',
    type: 'stock',
    query: 'elegant woman camel coat autumn editorial fashion neutral',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: 'Atmosfera editoriale: donna elegante in cappotto cammello',
  },
  {
    id: 'monogram-post',
    type: 'stock',
    query: 'luxury beige leather handbag still life minimal neutral',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Borsa Monogram in pelle su fondo neutro — post social',
  },
  {
    id: 'persona-giulia',
    type: 'stock',
    query: 'young professional woman portrait natural light minimal serene',
    aspect: '4:5',
    width: 1000,
    grade: 'editorial',
    alt: 'Ritratto di Giulia, 29 anni — la nuova generazione',
  },
  {
    id: 'persona-francesca',
    type: 'stock',
    query: 'elegant mature woman portrait sophisticated grey hair soft light',
    aspect: '4:5',
    width: 1000,
    grade: 'editorial',
    alt: 'Ritratto di Francesca, 52 anni — la cliente storica',
  },
  // Visual già realizzato in codice (animazione data-lake): nessun fetch.
  {
    id: 'acquisizione-datalake',
    type: 'code',
    aspect: '16:9',
    width: 1100,
    grade: 'none',
    alt: 'Animazione: dal data lake ai profili unificati',
  },

  // ── Altre fasi — estendi qui con la stessa struttura ──────────────
  // {
  //   id: 'engagement-editoriale',
  //   type: 'stock',
  //   query: 'fashion editorial teddy coat texture detail',
  //   aspect: '4:5', width: 1200, grade: 'editorial',
  //   alt: 'Dettaglio editoriale del Teddy Bear Coat',
  // },
  // {
  //   id: 'loyalty-boutique',
  //   type: 'aigen',
  //   prompt: 'interior of a Max Mara boutique, warm camel tones, cinematic, editorial',
  //   aspect: '16:9', width: 2000, grade: 'editorial',
  //   alt: 'Interno boutique, toni cammello',
  // },
];

export default assets;
