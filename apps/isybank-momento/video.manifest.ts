/**
 * «Il momento giusto» — Firefly Video Model clips (cover + chiusura).
 * Concept: ribbons of blue and mint light drifting over deep ink-black, one warm
 * orange point of light — "il momento". Abstract by construction: no people, faces,
 * phones, logos or legible text. Generated build-time, scrub-encoded with ffmpeg;
 * MP4s go to the GitHub Release `media`, posters stay in public/media/.
 * Run:  pnpm --filter isybank-momento video:build
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
    id: 'momento-cover',
    prompt:
      'Abstract cinematic sequence on a deep ink-black background (#101318): two wide translucent ribbons of ' +
      'electric blue (#1B99FB) and mint green (#26E5AE) light drifting very slowly toward each other across the ' +
      'lower third of the frame, meeting at a single tiny warm orange (#FF6200) point of light that softly brightens, ' +
      'slow gentle camera drift, soft cinematic glow, generous empty dark space above, calm and premium, high detail, no text',
    negativePrompt:
      'people, faces, hands, phones, screens, devices, buildings, brand logos, watermarks, legible words, captions, ' +
      'subtitles, red, purple, pink, yellow, glitchy, flicker, fast motion, low quality',
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 7,
  },
  {
    id: 'momento-close',
    prompt:
      'Abstract cinematic sequence on a deep ink-black background (#101318): a single small warm orange (#FF6200) ' +
      'point of light at the lower centre with a soft halo that slowly warms and widens, thin ribbons of electric blue ' +
      '(#1B99FB) and mint green (#26E5AE) light fading gently around it, very slow motion, soft cinematic glow, ' +
      'generous empty dark space above, calm and premium, high detail, no text',
    negativePrompt:
      'people, faces, hands, phones, screens, devices, buildings, brand logos, watermarks, legible words, captions, ' +
      'subtitles, red, purple, pink, yellow, glitchy, flicker, fast motion, low quality',
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 11,
  },
];
