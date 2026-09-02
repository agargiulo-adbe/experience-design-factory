import type { ImageMetadata } from 'astro';
import type { AssetSlot } from '@edf/core/assets/types';
import { assets } from './assets.manifest';

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
  media: AssetSlot;
  src: ImageMetadata | null;
}

export function mediaProps(id: string): ResolvedMedia {
  const slot = slotById.get(id);
  if (!slot) {
    throw new Error(`[assets] Unknown media slot "${id}" — add it to assets.manifest.ts`);
  }
  return { media: slot, src: assetById.get(id) ?? null };
}
