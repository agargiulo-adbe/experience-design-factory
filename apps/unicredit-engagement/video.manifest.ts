/**
 * «Engagement Unlimited» — Firefly Video Model clips (cover della home + chiusura).
 * Concept: il filo oro della relazione che attraversa un blu notte profondo, con un
 * unico nodo rosso UniCredit che si accende. Astratto per costruzione: niente persone,
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
}

export const videos: VideoSlot[] = [
  {
    id: 'uc-cover',
    prompt:
      'Abstract cinematic sequence on a deep midnight-blue background (#1A1A2E): a single thin ribbon of warm gold ' +
      '(#C9A96E) light drifting very slowly from left to right across the lower third of the frame, gently undulating, ' +
      'with a small deep-red (#BE2027) point of light glowing softly where the ribbon passes, faint bokeh of a city ' +
      'skyline at night far in the background, slow gentle camera drift, soft cinematic glow, generous empty dark space ' +
      'above, calm and premium, high detail, no text',
    negativePrompt:
      'people, faces, hands, phones, screens, devices, brand logos, watermarks, legible words, captions, subtitles, ' +
      'green, purple, pink, orange, glitchy, flicker, fast motion, low quality',
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 21,
  },
  {
    id: 'uc-close',
    prompt:
      'Abstract cinematic sequence on a deep midnight-blue background (#1A1A2E): six small warm gold (#C9A96E) points ' +
      'of light arranged along a gentle curve slowly connecting one to the next with a thin luminous gold thread, the ' +
      'last point glowing deep red (#BE2027), very slow motion, soft cinematic glow, generous empty dark space above, ' +
      'calm and premium, high detail, no text',
    negativePrompt:
      'people, faces, hands, phones, screens, devices, buildings, brand logos, watermarks, legible words, captions, ' +
      'subtitles, green, purple, pink, orange, glitchy, flicker, fast motion, low quality',
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 34,
  },
];
