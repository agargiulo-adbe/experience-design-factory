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

/* 19 nov 2026, dopo «il design system è scarno» (owner): fotografie di
   architettura e di lavoro, MAI del cliente (niente torre, niente marchio,
   niente persone), nella palette di unicredit.it — petrolio, ardesia, bianco
   caldo. Vanno nel campo di mezzo dei divisori (XD, `--foto`) e dietro la
   copertina, sotto il velo petrolio: la sala vede un luogo, non un'icona. */
const STILE = ', editorial architectural photograph, soft natural light, calm and quiet, generous negative space, cool palette of deep petrol teal, slate grey and warm white, fine film grain, realistic, high detail';
const NO = 'people, person, faces, hands, crowd, text, letters, words, numbers, readable screen, logos, brand names, signage, bank logo, tower, skyscraper logo, neon, purple, oversaturated, harsh flash, cartoon, illustration, cgi, clutter';
const foto = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'photo', prompt: prompt + STILE, negativePrompt: NO,
  aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});

export const assets: AssetSlot[] = [
  foto('copertina', 'Dawn over a quiet contemporary Italian city square of pale stone and glass facades, a long reflecting pool catching the first light, long soft shadows, empty', 5203),
  foto('div-quadro', 'A calm modern office atrium seen from a high vantage point, layered white walkways and a single band of morning light crossing the stone floor, empty', 5203),
  foto('div-analytics', 'Close view of a clean light oak desk, an open notebook with hand-drawn pencil bar charts and a small line graph, a ceramic cup of coffee, the edge of a closed laptop, soft morning window light', 5203),
  foto('div-target', 'Two pale gravel paths in a minimalist garden of low clipped hedges converging into one, seen from above, soft early light, calm geometric composition', 5203),
  foto('div-comincia', 'The first steps of a wide pale stone staircase rising into soft daylight, minimal contemporary architecture, quiet, empty', 5203),
];
