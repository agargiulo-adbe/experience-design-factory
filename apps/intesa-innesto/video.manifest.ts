/**
 * «Dove ci innestiamo» — le clip in loop di copertina e chiusura.
 *
 * Concetto: l'INNESTO, cioè il marchio in movimento. Un percorso di luce che
 * corre, un tratto che vi scende dentro, un nodo che si accende nel punto in
 * cui si incontrano. È lo stesso disegno del favicon e dei motivi di capitolo:
 * il deck si riconosce da lontano perché ripete una forma sola.
 *
 * Regole del guscio sensoriale, applicate qui:
 *  · la clip sta SOLO su copertina e chiusura, dove non si parla. In mezzo
 *    ruba lo sguardo;
 *  · camera BLOCCATA — `pan, tilt, zoom, dolly` nel negative, se no il modello
 *    dà una carrellata e il titolo sopra balla;
 *  · spazio vuoto e scuro dove va il testo: il titolo è centrato, quindi la
 *    luce sta in basso;
 *  · astratta per costruzione: niente persone, volti, mani, loghi, testo,
 *    prodotti del cliente (Quality Bar).
 *
 * Dopo la generazione: `pnpm loop:seamless public/media/<id>.mp4 --poster`,
 * perché il giro del `loop` nativo si vede, ed è un difetto del contenuto.
 * Run: pnpm --filter intesa-innesto video:build
 */
export interface VideoSlot {
  id: string;
  prompt: string;
  negativePrompt?: string;
  aspect: '16:9';
  size?: { width: number; height: number };
  seconds?: number;
  seed?: number;
}

/** Palette LETTA dal CSS di produzione del cliente: verde di sistema #258900,
 *  verde notte #0d2901, verde chiaro #4fc21f. Niente blu. */
const NEG =
  'camera movement, pan, tilt, zoom, dolly, parallax, people, faces, hands, buildings, ' +
  'products, user interfaces, screens, charts, brand logos, watermarks, text, letters, ' +
  'words, captions, subtitles, blue, teal, cyan, purple, orange, red, bright center, ' +
  'flicker, glitch, fast motion, low quality';

export const videos: VideoSlot[] = [
  {
    id: 'innesto-cover',
    prompt:
      'Abstract cinematic sequence, locked static camera, on a deep near-black green background (#0d2901): ' +
      'one long horizontal line of soft system-green light (#258900) running steadily across the lower third ' +
      'of the frame, and a second shorter vertical line of brighter green (#4fc21f) descending very slowly ' +
      'from above until it touches the horizontal line, where a small round node softly brightens and settles; ' +
      'generous empty dark space in the upper half, fine film grain, calm, premium, high detail',
    negativePrompt: NEG,
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 621,
  },
  {
    id: 'innesto-chiusura',
    prompt:
      'Abstract cinematic sequence, locked static camera, on a deep near-black green background (#0d2901): ' +
      'a single small round node of bright green light (#4fc21f) resting on a long horizontal line of softer ' +
      'green (#258900) in the lower third, the node breathing slowly while the line extends gently toward the ' +
      'right edge and fades; generous empty dark space in the upper half, fine film grain, calm, premium, high detail',
    negativePrompt: NEG,
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 622,
  },
];
