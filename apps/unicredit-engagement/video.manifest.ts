/**
 * «Engagement Unlimited» — Firefly Video Model clips (cover della home + chiusura).
 * Concept: il filo petrolio/ciano della relazione che attraversa il petrolio notte, con
 * un unico nodo rosso UniCredit che si accende. Colori dal design system reale del
 * cliente (#007A91 - #00AED0 - #E2001A - #04252D), vedi CLAUDE.md. Astratto per costruzione: niente persone,
 * volti, schermi, loghi o testo leggibile. Generato build-time, ricodificato con ffmpeg;
 * gli MP4 vanno sul GitHub Release `media`, i poster restano in public/media/.
 * Run:  pnpm --filter unicredit-engagement video:build
 */
export interface VideoSlot {
  id: string;
  prompt: string;
  negativePrompt?: string;
  aspect: '16:9';
  size?: { width: number; height: number };
  seconds?: number;
  seed?: number;
  /** false = clip solo in autoplay/loop (nessuno scrubbing) → GOP normale, file leggero. */
  scrub?: boolean;
}

export const videos: VideoSlot[] = [
  {
    id: 'uc-cover',
    prompt:
      'Abstract cinematic sequence on a very dark teal-black background (#04252D): a single thin ribbon of petrol-teal ' +
      'and cyan light (#007A91 into #00AED0) drifting very slowly from left to right across the lower third of the ' +
      'frame, gently undulating, with a small red (#E2001A) point of light glowing softly where the ribbon passes, ' +
      'faint cool bokeh of a city skyline at night far in the background, slow gentle camera drift, soft cinematic ' +
      'glow, generous empty dark space above, calm and premium, high detail, no text',
    negativePrompt:
      'gold, amber, warm orange, yellow, brown, beige, people, faces, hands, phones, screens, devices, brand logos, ' +
      'watermarks, legible words, captions, subtitles, purple, pink, glitchy, flicker, fast motion, low quality',
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 21,
    scrub: false,
  },
  {
    id: 'uc-close',
    prompt:
      'Abstract cinematic sequence on a very dark teal-black background (#04252D): six small cyan (#00AED0) points of ' +
      'light arranged along a gentle curve slowly connecting one to the next with a thin luminous petrol-teal (#007A91) ' +
      'thread, the last point glowing red (#E2001A), very slow motion, soft cinematic glow, generous empty dark space ' +
      'above, calm and premium, high detail, no text',
    negativePrompt:
      'gold, amber, warm orange, yellow, brown, beige, people, faces, hands, phones, screens, devices, buildings, ' +
      'brand logos, watermarks, legible words, captions, subtitles, purple, pink, glitchy, flicker, fast motion, low quality',
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 34,
    scrub: false,
  },
];
