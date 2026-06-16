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
    query: 'elegant woman camel coat minimal',
    aspect: '16:9',
    width: 2400,
    grade: 'duotone',
    alt: 'Atmosfera editoriale: donna elegante in cappotto cammello',
  },
  {
    id: 'whitney-post',
    type: 'stock',
    query: 'structured leather handbag camel minimal',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Whitney Bag in pelle cammello su fondo neutro — post social',
  },
  {
    id: 'persona-giulia',
    type: 'stock',
    query: 'young woman portrait natural light neutral',
    aspect: '4:5',
    width: 1000,
    grade: 'editorial',
    alt: 'Ritratto di Giulia, 29 anni — la nuova generazione',
  },
  {
    id: 'persona-francesca',
    // Sober studio profile, coherent with Giulia (not an evocative campaign shot).
    type: 'stock',
    query: 'elegant mature woman portrait natural light neutral',
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

  // ── Sfondi atmosferici (textile, quiet-luxury) — sempre dietro a uno scrim ──
  {
    id: 'bg-cashmere',
    type: 'stock',
    query: 'cashmere fabric texture warm light macro',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: '',
  },
  {
    id: 'bg-linen',
    type: 'stock',
    query: 'soft linen folds beige natural light',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: '',
  },
  {
    id: 'bg-wool',
    type: 'stock',
    query: 'camel wool textile macro warm',
    aspect: '16:9',
    width: 2400,
    grade: 'duotone',
    alt: '',
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
