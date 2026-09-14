/**
 * Experience Atelier — Firefly Video Model clip for the Overture cover.
 * Concept: the loom. Fine golden threads of light under tension on warm near-black,
 * drifting very slowly, as if the cloth were still being woven. Abstract by
 * construction: no people, faces, screens, logos or legible text.
 * Generated build-time, then stitched with `pnpm loop:seamless` so the loop has no
 * seam; the MP4 goes to the GitHub Release `media`, the poster stays in public/media/.
 * Run:  pnpm --filter atelier video:build
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
    id: 'atelier-cover',
    prompt:
      'Abstract cinematic sequence on a warm near-black background (#12100C): many fine champagne gold (#C9A96A) ' +
      'threads of light stretched horizontally across the frame like the warp of a loom, drifting and swaying very ' +
      'slowly, a soft bronze (#9A7B45) glow travelling gently along them, very slow camera drift, soft cinematic haze, ' +
      'generous empty dark space, calm and premium, high detail, no text',
    negativePrompt:
      'people, faces, hands, figures, silhouettes, screens, devices, buildings, brand logos, watermarks, legible words, ' +
      'captions, subtitles, blue, cyan, purple, pink, neon, bright center, glitchy, flicker, fast motion, low quality',
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 17,
  },
];
