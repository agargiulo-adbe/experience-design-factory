/**
 * «Connessioni Intelligenti» — le due clip in loop: copertina e chiusura.
 * Il movimento sta dove non si parla (apertura e congedo); in mezzo ruba lo
 * sguardo e resta l'immagine ferma.
 *
 * Palette bloccata nel prompt, letta da trenitalia.com (vedi global.css):
 * fondo #1b2230, struttura #2f394e/#606c87, segnale rosso #d91835/#ff8d9d,
 * segnale verde #006666/#4fbdb4.
 *
 * Camera BLOCCATA: `pan, tilt, zoom, dolly, camera movement` stanno nel
 * negative, se no il modello consegna una carrellata e il loop deriva.
 * Nessun veicolo, nessuna persona, nessun testo: la Quality Bar vieta la
 * wrong-brand imagery e un treno generato arriva con la livrea sbagliata.
 *
 * Dopo la generazione ogni clip passa da `pnpm loop:seamless <clip> --poster`:
 * il giro non si deve vedere.
 *
 * Run: pnpm --filter trenitalia-connessioni video:build
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

const NEG =
  'camera movement, pan, tilt, zoom, dolly, tracking shot, handheld, trains, locomotives, carriages, cars, ' +
  'vehicles, people, faces, hands, crowds, text, letters, words, numbers, captions, subtitles, watermarks, ' +
  'logos, brand marks, liveries, screens, phones, orange, amber, yellow, purple, magenta, ' +
  'flicker, glitch, fast motion, strobing, blown highlights, low quality';

export const videos: VideoSlot[] = [
  {
    id: 'linea-cover',
    prompt:
      'Locked static camera. Abstract cinematic sequence on a deep slate-blue field (#1b2230): a long thin line of ' +
      'crimson red (#d91835) light travels very slowly from left to right across the lower third of the frame, ' +
      'passing through a few small still nodes that brighten softly as it reaches them; far behind, a faint web of ' +
      'slate (#2f394e) and grey-blue (#606c87) lines stays perfectly still. Generous empty dark space above. ' +
      'Calm, precise, cinematic soft glow, high detail, no text.',
    negativePrompt: NEG,
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 21,
  },
  {
    id: 'linea-chiusura',
    prompt:
      'Locked static camera. Abstract cinematic sequence on a deep slate-blue field (#1b2230): two thin lines of ' +
      'light, one crimson red (#d91835) and one deep teal (#4fbdb4), drift very slowly toward each other along a ' +
      'low horizon and settle side by side without touching, while a soft band of pale light rises gently from the ' +
      'far edge behind them. Generous empty dark space above. Calm, precise, cinematic soft glow, high detail, no text.',
    negativePrompt: NEG,
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 22,
  },
];
