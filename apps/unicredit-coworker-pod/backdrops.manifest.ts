import type { AssetSlot } from '@edf/core/assets/types';

/**
 * «Da dove partiamo» (Adobe × UniCredit) — sfondi generati, uno per famiglia di slide.
 *
 * Il deck generato NON ha sfondi: `.ex-bg-night` e `.ex-bg-paper` sono solo
 * gradienti. Quando il design system vero è stato letto (`pnpm brand:tokens`),
 * si descrivono qui le famiglie di sfondo con la palette del cliente e si lancia:
 *
 *   pnpm --filter unicredit-coworker-pod assets:build
 *
 * che scrive `src/assets/generated/bg/<id>.webp` + `provenance.json`. In pagina:
 *   import bg from '../assets/generated/bg/<id>.webp';
 *   <div slot="backdrop" class="ex-bg-night" style={`--bg-src: url(${bg.src})`}></div>
 * e sulla slide `data-made-with="Firefly" data-made-with-for="sfondo"` — il
 * credito è un fatto verificabile in provenance.json, non una decorazione.
 *
 * Astratti per costruzione: niente persone, loghi, testo, prodotti del cliente
 * (wrong-brand imagery). Esempio (commentato) di uno slot Firefly:
 */
// const NO_TEXT = 'text, letters, words, typography, captions, watermarks, logos, brand marks, icons, people, faces, hands';
// const night = (id: string, prompt: string, seed: number): AssetSlot => ({
//   id, type: 'firefly', contentClass: 'art',
//   prompt: prompt + ', deep ink-black background, soft accent-coloured light, generous empty dark space, calm, high detail, abstract, no text',
//   negativePrompt: NO_TEXT + ', bright center, blown highlights, busy clutter, noise, low quality',
//   aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
// });

/* 20 nov 2026 — LE FOTO NON SONO PIÙ GENERATE. Le cinque Firefly del 19 nov
   (piazze e atri «di architettura», una scrivania con un grafico finto) erano
   generiche e, nel campo stretto del divisore, illeggibili (owner: «brutta e
   incomprensibile»). Ora sono FOTOGRAFIE VERE di Adobe Stock, licenziate, una
   per capitolo e ognuna un gancio sul suo tema: il molo (da dove si parte), una
   città dall'alto (il quadro), un attraversamento pedonale (dove si fermano le
   persone), il testimone (gli step in fila), i sassi nel fiume (il primo passo).
   Id, titolo e motivo in `src/assets/generated/bg/provenance.json`.
   ⚠️ Questo manifest resta VUOTO: un `assets:build` con gli slot di ieri
   riscriverebbe le foto Stock con le Firefly. */
export const assets: AssetSlot[] = [];
