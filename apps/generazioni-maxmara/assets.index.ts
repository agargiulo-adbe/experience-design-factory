/**
 * Asset loader — maps slot-id → generated image (or null → placeholder).
 * Generated sources live in src/assets/generated/<id>.webp and are committed,
 * so the site builds without any API key. When a file is missing the slot
 * gracefully falls back to the MediaSlot placeholder.
 */
import type { ImageMetadata } from 'astro';
import type { AssetSlot } from '@edf/core/assets/types';
import { assets } from './assets.manifest';

// Eagerly import every generated webp as Astro ImageMetadata.
const generated = import.meta.glob<{ default: ImageMetadata }>(
  './src/assets/generated/*.webp',
  { eager: true },
);

const assetById = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(generated)) {
  const id = path.split('/').pop()!.replace(/\.webp$/, '');
  assetById.set(id, mod.default);
}

const slotById = new Map<string, AssetSlot>(assets.map((s) => [s.id, s]));

export function getSlot(id: string): AssetSlot | undefined {
  return slotById.get(id);
}

export function getAsset(id: string): ImageMetadata | null {
  return assetById.get(id) ?? null;
}

export interface ResolvedMedia {
  // `media` (not `slot`): `slot` is a reserved attribute name in Astro.
  media: AssetSlot;
  src: ImageMetadata | null;
}

/** Resolve a slot to props for <MediaSlot {...mediaProps(id)} />. */
export function mediaProps(id: string): ResolvedMedia {
  const slot = slotById.get(id);
  if (!slot) {
    throw new Error(`[assets] Unknown media slot "${id}" — add it to assets.manifest.ts`);
  }
  return { media: slot, src: assetById.get(id) ?? null };
}
