/* `VideoSlot` è dichiarato qui, come negli altri manifest video: il tipo vive
   dentro `scripts/build-video.ts` e non è esportato dal core, al contrario di
   `AssetSlot`. Risultato: la stessa forma è scritta in tre posti e prima o poi
   divergerà. Andrebbe spostato in `@edf/core/assets/types` insieme all'altro —
   piccolo lavoro, ma tocca anche le app che hanno già un manifest video. */
export interface VideoSlot {
  id: string;
  prompt: string;
  negativePrompt?: string;
  aspect: '16:9';
  size?: { width: number; height: number };
  seconds?: number;
  seed?: number;
}

/**
 * «Dove può arrivare il viaggio» — le due clip di sfondo.
 *
 *   pnpm --filter trenitalia-prospettiva-sales video:build
 *   → public/media/<id>.mp4 + <id>.poster.jpg + provenance.video.json
 *   poi  pnpm loop:seamless public/media/<id>.mp4 --poster   (il giro non si deve vedere)
 *
 * DUE SOLE, e il perché sta nella regola del guscio sensoriale: il movimento sta
 * su **copertina e chiusura**, dove non si parla. In mezzo ruba lo sguardo a chi
 * sta spiegando, ed è il momento in cui serve il contrario.
 *
 * CAMERA FERMA: `pan, tilt, zoom, dolly` stanno nel negativo. Senza, il modello
 * regala una carrellata e la clip deriva — e una clip che deriva non chiude il giro
 * nemmeno con la dissolvenza.
 *
 * Stesso filo visivo degli sfondi fermi e del marchio: una linea di luce con delle
 * fermate. Nessun treno, nessun mezzo riconoscibile, nessuna persona: un treno
 * generato somiglia sempre al treno di qualcuno, ed è la wrong-brand imagery che la
 * Quality Bar vieta. Palette ardesia del cliente, rosso solo come punto raro.
 */
const NEG =
  'people, faces, hands, trains, train carriages, vehicles, cars, buses, stations, ' +
  'signage, text, letters, numbers, captions, subtitles, watermarks, logos, brand marks, ' +
  'pan, tilt, zoom, dolly, camera movement, fast motion, flicker, strobing, ' +
  'cyan, magenta, orange, teal, rainbow colours, busy clutter, low quality';

export const videos: VideoSlot[] = [
  {
    id: 'cover-loop',
    prompt:
      'Abstract cinematic loop on a deep slate-navy background (#1b2230): a single thin horizontal ' +
      'line of pale light stretched across the lower third of the frame, with a few small points of ' +
      'light resting on it that brighten and dim very slowly in turn, one of them a muted crimson ' +
      '(#d91835); faint slate haze drifting almost imperceptibly; locked-off static camera; ' +
      'vast empty dark space above the line; calm, premium, high detail, no text',
    negativePrompt: NEG,
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 721,
  },
  {
    id: 'close-loop',
    prompt:
      'Abstract cinematic loop on a deep slate-navy background (#1b2230): one pale line of light ' +
      'opening gently toward the far distance, a very soft cool glow on the horizon that slowly ' +
      'swells and settles, a single muted crimson (#d91835) point of light steady near the centre; ' +
      'locked-off static camera; almost empty frame; quiet, hopeful, high detail, no text',
    negativePrompt: NEG,
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 722,
  },
];
