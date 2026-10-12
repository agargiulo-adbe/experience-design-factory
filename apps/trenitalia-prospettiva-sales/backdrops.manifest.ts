import type { AssetSlot } from '@edf/core/assets/types';

/**
 * «Dove può arrivare il viaggio» (Adobe × Trenitalia) — sfondi generati.
 *
 *   pnpm --filter trenitalia-prospettiva-sales assets:build
 *   → src/assets/generated/bg/<id>.webp + provenance.json
 *
 * In pagina:
 *   import bg from '../assets/generated/bg/<id>.webp';
 *   <div slot="backdrop" class="ex-bg-night" style={`--bg-src: url(${bg.src})`}></div>
 * e sulla slide `data-made-with="Adobe Firefly" data-made-with-for="sfondo"` — il
 * credito è un fatto verificabile in provenance.json, non una decorazione.
 *
 * DUE FAMIGLIE, perché le superfici sono due e gli sfondi non sono intercambiabili:
 * `ink` sta sotto `.ex-bg-night` (slide scure), `soft` sotto `.ex-bg-paper` (chiare).
 * Montare l'uno al posto dell'altro rovina lo scrim e con lui il contrasto.
 *
 * IL FILO VISIVO è lo stesso del marchio e della home: **una linea con delle
 * fermate**. Non sono illustrazioni di treni — sono scie di luce, binari visti da
 * lontano, geometrie di linee che si incontrano. Astratti per costruzione: niente
 * persone, niente loghi, niente testo, nessun mezzo riconoscibile di nessun
 * operatore (è la wrong-brand imagery che la Quality Bar vieta: un treno generato
 * somiglia sempre al treno di qualcuno).
 *
 * PALETTE presa dal design system letto: ardesia notte #1b2230, ardesia #2f394e,
 * e il rosso #d91835 solo come accento raro — la stessa gerarchia del CSS del
 * cliente, 285 occorrenze contro 34.
 */

const NO_TEXT =
  'text, letters, words, numbers, typography, captions, watermarks, logos, brand marks, ' +
  'signage, people, faces, hands, trains, train carriages, vehicles, cars, buses, ' +
  'recognisable machinery, cluttered detail, stock-photo look';

const PALETTE_INK =
  ', deep slate-navy #1b2230 background, cooler slate #2f394e mid-tones, one sparing ' +
  'crimson #d91835 accent, long-exposure light, generous empty dark space, calm and wide, ' +
  'cinematic, abstract, high detail, no text';

const PALETTE_SOFT =
  ', very light warm off-white background, faint slate-navy #2f394e lines, one sparing ' +
  'crimson #d91835 accent, airy and almost empty, soft daylight, abstract, minimal, no text';

/**
 * GRADE DUOTONE, e non è un vezzo. Chiesta la palette a parole, il modello
 * restituisce comunque neon ciano, magenta e arancio: belli, e di un'altra
 * azienda. Il duotone rimappa la luminanza fra DUE colori del marchio, quindi
 * l'immagine esce ardesia qualunque cosa abbia generato il modello — e il rosso
 * resta quello raro che mette il CSS, nella stessa gerarchia del sito (285
 * occorrenze di ardesia contro 34 di rosso). Il chiaro del duotone non è bianco
 * ma un'ardesia schiarita: sotto il testo servono mezzi toni, non alte luci.
 */
/** Slide scure (`.ex-bg-night`). */
const ink = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art', prompt: prompt + PALETTE_INK,
  negativePrompt: NO_TEXT + ', bright centre, blown highlights, busy composition, low quality',
  aspect: '16:9', width: 2400, grade: 'duotone', duotone: ['#141a25', '#7c8aa3'], seed, alt: '',
});

/** Slide chiare (`.ex-bg-paper`). */
const soft = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'art', prompt: prompt + PALETTE_SOFT,
  negativePrompt: NO_TEXT + ', dark background, heavy shadows, busy composition, low quality',
  aspect: '16:9', width: 2400, grade: 'duotone', duotone: ['#5c6880', '#fbfbfc'], seed, alt: '',
});

export const assets: AssetSlot[] = [
  // ── INK — slide scure ───────────────────────────────────────────────────
  ink('bg-cover',
    'a single luminous line travelling across a vast dark plain, small points of light ' +
    'marking stops along it, seen from very far above at night', 701),
  ink('bg-chapter',
    'one quiet horizontal light trail fading into darkness, a few faint parallel lines ' +
    'below it, enormous empty space above', 702),
  ink('bg-search',
    'many faint scattered points of light in the dark, a few of them brighter and ' +
    'connected by thin lines, like answers found among many', 703),
  ink('bg-journey',
    'four separate light trails converging into one single brighter line, long exposure, ' +
    'seen from above at night', 704),
  ink('bg-network',
    'a wide field of tiny dim light points spread to the horizon, a thin bright line ' +
    'crossing through them, vast and calm', 705),
  ink('bg-close',
    'a single line of light opening into the distance toward a faint dawn glow, ' +
    'almost empty frame, quiet and hopeful', 706),

  // ── SOFT — slide chiare ─────────────────────────────────────────────────
  soft('bg-paper-lines',
    'a few very faint thin lines running across a pale empty surface, like a schematic ' +
    'drawn in light pencil, almost blank', 711),
  soft('bg-paper-grid',
    'a sparse light grid fading toward the edges on a pale surface, one faint crimson ' +
    'mark where two lines cross, almost blank', 712),
];
