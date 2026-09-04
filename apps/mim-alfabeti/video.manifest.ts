/**
 * Alfabeti (MIM) — Firefly Video Model clips for the scroll-storytelling page.
 * Concept: "alfabeto → competenza" — luminous Italian letterforms and ink,
 * navy + blu Italia, slowly orbiting and assembling into an ordered structure.
 * Abstract by construction: no people, no faces, no legible text, no logos.
 *
 * Generated build-time, scrub-encoded with ffmpeg, committed to public/media/.
 * Run:  pnpm --filter mim-alfabeti video:build
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
    id: 'alfabeto-competenza',
    prompt:
      'Abstract cinematic sequence on a deep navy background (#0A1A33) lit by institutional blue ' +
      '(#0B4DA2, #2E6FD6) and warm ivory: luminous Italian letterforms and ink strokes slowly drifting, ' +
      'then gracefully orbiting and assembling from scattered letters into ordered words and a coherent ' +
      'geometric structure, slow elegant camera orbit, soft cinematic light, subtle paper grain, calm and ' +
      'institutional, high detail, no people, no legible text',
    negativePrompt:
      'people, faces, hands, workers, brand logos, watermarks, legible words, captions, subtitles, ' +
      'red, orange, garish colors, glitchy, low quality',
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 1,
  },
];
