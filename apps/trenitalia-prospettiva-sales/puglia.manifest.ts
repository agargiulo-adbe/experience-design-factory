import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Le versioni della campagna «Estate in Puglia» nel mockup del contenuto (9 nov 2026).
 * Tre pubblici, tre immagini davvero diverse: due tagli della stessa foto non
 * raccontano una campagna che si adatta. Persone di spalle, nessun treno.
 *
 *   pnpm exec tsx ../../scripts/build-assets.ts --manifest puglia.manifest.ts --out src/assets/generated/puglia
 */
const NO = 'text, letters, numbers, signage, logos, watermarks, trains, carriages, vehicles, cars, buses, boats, faces, portrait, looking at camera, overcast sky';
const STILE = ', Puglia Italy, bright clear summer light, vivid natural colours, candid travel photograph, high detail';
const foto = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'photo', prompt: prompt + STILE, negativePrompt: NO,
  aspect: '16:9', width: 1600, grade: 'none', seed, alt: '',
});

export const assets: AssetSlot[] = [
  foto('puglia-famiglia', 'family with two small children seen from behind walking hand in hand along a white sand beach, turquoise Adriatic sea', 4311),
  foto('puglia-coppia', 'couple seen from behind strolling through a narrow whitewashed alley of an old hilltop town, bougainvillea, golden hour', 4312),
  foto('puglia-bici', 'lone cyclist seen from behind riding a gravel road between ancient olive trees and dry stone walls, red earth', 4313),
];
export default assets;
