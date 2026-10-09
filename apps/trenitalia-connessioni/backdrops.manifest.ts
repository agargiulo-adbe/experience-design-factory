import type { AssetSlot } from '@edf/core/assets/types';

/**
 * «Connessioni Intelligenti» (Adobe × Gruppo FS) — uno sfondo per OGNI slide,
 * organizzato per RUOLO e non per slide: un capitolo usa la sua famiglia e la
 * ripete, come una collana di libri ripete la copertina.
 *
 * ── PERCHÉ IL PRIMO GIRO È STATO BUTTATO (9 ott 2026) ────────────────────
 * Il primo tentativo chiedeva «linee di luce», «rete», «nodi», «flusso» e
 * metteva i codici esadecimali nel prompt. È tornato indietro il peggio del
 * repertorio generativo: neon ciano al posto dell'ardesia (i codici colore il
 * modello li ignora), arancio nonostante stesse nel negative, e la stessa
 * prospettiva a punto di fuga ripetuta in cinque immagini su ventidue. Le
 * varianti «soft» erano rumorose quanto le «hero».
 * Tre correzioni, tutte verificate guardando il contact sheet:
 *   1. `contentClass: 'photo'` invece di 'art' — è la leva singola che sposta
 *      di più: porta via dal vettoriale fluorescente e verso la fotografia;
 *   2. niente esadecimali, solo parole di colore smorzate («desaturated slate
 *      blue-grey», «muted crimson»), e nel negative tutto l'armamentario
 *      neon/sci-fi/data-viz/punto-di-fuga che il modello propone di default;
 *   3. niente più «rete di dati»: quel concetto si disegna, non si genera —
 *      sta nei diagrammi SVG dentro le slide, dove è preciso.
 *
 * ── LA PALETTE ────────────────────────────────────────────────────────────
 * Resta quella letta dal CSS di produzione di trenitalia.com (blocco in testa
 * a src/styles/global.css): ardesia, rosso del sito, verde del sito. Qui
 * passa come descrizione, non come codice, perché è così che il modello la
 * sente. `grade: 'none'`: il duotone condiviso è di un'altra experience.
 *
 * ── PERCHÉ NESSUN MEZZO, MAI ──────────────────────────────────────────────
 * La Quality Bar vieta la wrong-brand imagery, e un treno generato arriva con
 * una livrea che non è quella del cliente — o somiglia a quella di un
 * concorrente. Quindi: binari, pensiline, catenarie, rampe, stalli, cemento e
 * acciaio. Nessun veicolo, nessuna persona, nessun testo, nessun marchio.
 *
 * Genera: pnpm --filter trenitalia-connessioni assets:build --manifest backdrops.manifest.ts
 */

const NO_SLOP =
  'trains, locomotives, carriages, cars, vehicles, buses, aircraft, bicycles, people, faces, hands, crowds, ' +
  'text, letters, words, numbers, typography, captions, watermarks, signatures, logos, brand marks, liveries, ' +
  'signage, posters, advertising, screens, phones, devices';
const NO_NEON =
  'neon, cyan, turquoise, electric blue, glowing lines, light streaks, speed lines, laser beams, ' +
  'vanishing point, converging perspective lines, starburst, lens flare, sci-fi, futuristic, cyberpunk, ' +
  'data visualization, network graph, constellation, wireframe, digital grid, hologram';
const NEG =
  NO_SLOP + ', ' + NO_NEON +
  ', orange, amber, yellow, gold, purple, magenta, saturated colours, oversaturated, ' +
  'high contrast, blown highlights, harsh glare, busy clutter, heavy noise, hdr, low quality';

/** Il fondo e la luce, in parole: il modello ignora gli esadecimali. */
const GROUND =
  ' Desaturated dark slate blue-grey throughout, cool muted palette, overcast diffused light, ' +
  'deep shadow, matte surfaces, subtle film grain, calm and precise, architectural photography, ' +
  'shallow depth of field, generous empty space, no text.';
const RAIL_LIGHT = ' One small muted crimson red light far in the distance, nothing else coloured.';
const PARK_LIGHT = ' One small muted deep teal light far in the distance, nothing else coloured.';
const QUIET = ' Almost entirely empty and very dark, extremely low contrast, no focal point.';

const shot = (id: string, scene: string, tail: string, seed: number): AssetSlot => ({
  id,
  type: 'firefly',
  contentClass: 'photo',
  prompt: scene + GROUND + tail,
  negativePrompt: NEG,
  aspect: '16:9',
  width: 2400,
  grade: 'none',
  seed,
  alt: '',
});

export const backdrops: AssetSlot[] = [
  // ── Tronco — il Gruppo, prima che la strada si divida ────────────────────
  shot('tr-atrio', 'The vast empty concourse of a modern railway station before dawn, seen wide and low; polished stone floor, steel and glass structure receding into shadow.', '', 111),
  shot('tr-tetto', 'Looking straight up at the ribbed steel and glass roof of a large railway station hall, repeating structural arches against an overcast sky.', '', 112),
  shot('tr-bivio', 'A railway switch photographed from directly above: two steel rails diverging cleanly on dark wet ballast, the sleepers running across the frame.', RAIL_LIGHT, 113),
  shot('tr-quiete', 'A large flat wall of dark board-marked concrete, lit by one very soft wide band of daylight from the side.', QUIET, 114),

  // ── Ramo Trenitalia — la metà su rotaia ──────────────────────────────────
  shot('rl-binari', 'Two steel rails curving gently away across dark wet ballast, photographed from low and close, raking side light on the polished railheads.', RAIL_LIGHT, 121),
  shot('rl-pensilina', 'The underside of a long railway platform canopy in silhouette, repeating steel ribs and tie rods receding into soft darkness.', RAIL_LIGHT, 122),
  shot('rl-banchina', 'The empty edge of a railway platform, tactile paving strip running away into shallow focus, wet stone, nobody there.', RAIL_LIGHT, 124),
  shot('rl-alba', 'A wide open railway track field at the very first light before sunrise, flat horizon, low mist, almost monochrome.', '', 125),
  shot('rl-quiete', 'A single steel rail running away through deep darkness, one faint line of reflected light along its head.', QUIET, 126),

  // ── Ramo FS Park — la metà su asfalto ────────────────────────────────────
  shot('pk-stalli', 'Painted parking bay markings on dark wet asphalt photographed straight down from above, clean repeating white lines, nothing parked.', PARK_LIGHT, 131),
  shot('pk-rampa', 'The sweeping concrete curve of an empty multi-storey car park ramp, smooth formwork texture, one continuous strip light following the edge.', PARK_LIGHT, 132),
  shot('pk-varco', 'A dark concrete opening in a car park structure with one wide bar of daylight across it, heavy shadow on either side.', PARK_LIGHT, 133),
  shot('pk-struttura', 'The repeating concrete columns and flat soffit of an empty underground car park receding into soft darkness.', PARK_LIGHT, 134),
  shot('pk-asfalto', 'Close macro of worn dark asphalt with one painted white line crossing the frame diagonally, rain-damp texture, grit and aggregate.', QUIET, 135),
  shot('pk-alba', 'A wide empty paved forecourt at first light before sunrise, flat horizon, low mist, almost monochrome.', '', 136),

  // ── Trasversali — la piattaforma, la materia, la chiusura ────────────────
  shot('tc-strati', 'Several large planes of dark tinted glass and brushed metal overlapping in depth inside a modern building, soft daylight passing between them.', '', 141),
  shot('tc-acciaio', 'Close macro of a brushed steel surface under raking light, fine parallel grain crossing the frame, nothing else.', QUIET, 142),
  shot('tc-quiete', 'An almost black empty field with one extremely soft gradient of grey light rising from the lower edge.', QUIET, 143),
];

/** Alias per `build-assets`, che si aspetta un export chiamato `assets`. */
export const assets = backdrops;
