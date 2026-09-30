/**
 * «Sei domande» — Adobe × Poste Italiane · clip Firefly Video Model (cover + firma).
 * Stessa famiglia degli sfondi: inchiostro #1a1c1e, luce blu di sistema #0047bb / #4270e4,
 * UN punto giallo #eedc00 = «la risposta». Astratte per costruzione: niente persone, telefoni,
 * schermi, loghi, testo, uffici postali.
 * Generate build-time, ricucite con `pnpm loop:seamless`, MP4 sul Release `media`,
 * poster in public/media/. Run: pnpm --filter poste-sei-domande video:build
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
  'people, faces, hands, phones, smartphones, screens, devices, cards, money, buildings, envelopes, mailboxes, vans, ' +
  'brand logos, watermarks, legible words, captions, subtitles, red, purple, pink, green, orange, glitchy, flicker, fast motion, low quality';

export const videos: VideoSlot[] = [
  {
    id: 'sd-cover',
    prompt:
      'Abstract cinematic sequence on a deep ink-black background (#1a1c1e): wide soft veils of royal blue (#0047bb) ' +
      'and lighter blue (#4270e4) light drifting very slowly from the left, like slow silk in the dark, and one single ' +
      'small warm yellow (#eedc00) point of light near the lower right that softly brightens and settles, ' +
      'slow gentle camera drift, soft cinematic glow, generous empty dark space, calm and precise, high detail, no text',
    negativePrompt: NEG,
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 6,
  },
  {
    id: 'sd-firma',
    prompt:
      'Abstract cinematic sequence on a deep ink-black background (#1a1c1e): a soft warm yellow (#eedc00) glow rising ' +
      'very slowly from the bottom edge and widening like dawn, thin royal blue (#0047bb) light far above fading gently, ' +
      'very slow motion, soft cinematic glow, generous empty dark space, calm and premium, high detail, no text',
    negativePrompt: NEG,
    aspect: '16:9',
    size: { width: 1920, height: 1080 },
    seconds: 5,
    seed: 12,
  },
];
