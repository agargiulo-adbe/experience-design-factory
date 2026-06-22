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

  // ── Engagement ────────────────────────────────────────────────────
  {
    id: 'engagement-editoriale',
    // Garment still-life (camel coat), framed on the coat — no recurring face.
    type: 'stock',
    query: 'beige camel wool coat minimalist still life neutral',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Editoriale: il cappotto in lana cammello',
  },

  // ── Conversione ───────────────────────────────────────────────────
  {
    id: 'conversione-pelle',
    // Fine-leather texture (no face): the cart-card hero. The card caption carries
    // the Whitney Bag specificity; this conveys the "pelle martellata" craftsmanship.
    type: 'stock',
    query: 'brown leather texture macro stitching detail warm',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Dettaglio editoriale: pelle pregiata, lavorazione artigianale',
  },

  // ── Francesca (cliente storica) — ritratto reale, matura ed elegante ──
  // Sorgente locale (AdobeStock_461205310), graded 'editorial' a mano e croppata
  // ai due aspect esatti dei box: 1:1 per gli avatar, 4:5 per i ritratti.
  {
    id: 'francesca-volto',
    type: 'stock',
    query: 'elegant mature woman portrait natural light urban',
    aspect: '1:1',
    width: 1600,
    grade: 'editorial',
    alt: 'Ritratto ravvicinato di Francesca, 52 anni — la cliente storica',
  },
  {
    id: 'francesca-ritratto',
    type: 'stock',
    query: 'elegant mature woman portrait natural light urban',
    aspect: '4:5',
    width: 1600,
    grade: 'editorial',
    alt: 'Ritratto di Francesca, 52 anni — la cliente storica',
  },
  // Slot atmosfera precedente (silk scarf, no-volto): non più referenziato,
  // lasciato per eventuale riuso. Vedi francesca-volto / francesca-ritratto.
  {
    id: 'francesca-atmosfera',
    type: 'stock',
    query: 'silk scarf folds elegant warm neutral still life',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Dettaglio sartoriale: la cura che dura nel tempo',
  },

  // ── Loyalty ───────────────────────────────────────────────────────
  {
    id: 'loyalty-boutique',
    // Boutique/atelier ambiance (no face): backdrop for the clienteling slide.
    type: 'stock',
    query: 'elegant boutique interior warm minimal neutral light',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: '',
  },

  // ── LP cliente Max Mara × Adobe (/maxmara-adobe/) ─────────────────
  {
    id: 'deck-poster',
    // Poster 16:9 on-brand dietro al player video finché l'MP4 non è caricato
    // (o come <video poster>). Degrada al placeholder MediaSlot senza webp.
    type: 'stock',
    query: 'elegant fashion atelier warm camel light cinematic still',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: 'Anteprima della presentazione Max Mara × Adobe',
  },

  // ── Estendi qui con la stessa struttura ──
  // {
  //   id: 'loyalty-boutique',
  //   type: 'aigen',
  //   prompt: 'interior of a Max Mara boutique, warm camel tones, cinematic, editorial',
  //   aspect: '16:9', width: 2000, grade: 'editorial',
  //   alt: 'Interno boutique, toni cammello',
  // },
];

export default assets;
