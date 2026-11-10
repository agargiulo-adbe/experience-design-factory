import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Le versioni della campagna «Estate in Puglia» nel mockup del contenuto (9 nov 2026).
 * Tre pubblici, tre immagini davvero diverse: due tagli della stessa foto non
 * raccontano una campagna che si adatta. Persone di spalle, nessun treno.
 * 10 nov 2026: «Puglia» nel prompt non basta. La spiaggia era caraibica e il vicolo
 * greco: ora il prompt nomina ciò che la riconosce (torre costiera e macchia del
 * Salento, pietra chiara e scale esterne dei borghi della Valle d'Itria).
 * ⚠️ Sono immagini generate, non fotografie di un luogo reale.
 *
 *   pnpm exec tsx ../../scripts/build-assets.ts --manifest puglia.manifest.ts --out src/assets/generated/puglia
 */
const NO = 'text, letters, numbers, signage, logos, watermarks, trains, carriages, vehicles, cars, buses, boats, faces, portrait, looking at camera, overcast sky, palm trees, tropical, caribbean, greek island, santorini, blue domes';
const STILE = ', Puglia southern Italy, natural summer light, realistic natural colours, candid documentary travel photograph, high detail';
const foto = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'photo', prompt: prompt + STILE, negativePrompt: NO,
  aspect: '16:9', width: 1600, grade: 'none', seed, alt: '',
});

export const assets: AssetSlot[] = [
  foto('puglia-famiglia', "family with two small children seen from behind walking hand in hand along a sandy beach of Salento, low pale limestone rocks and green Mediterranean scrub on the shore, an old square stone Saracen coastal watchtower on the headland in the distance, clear shallow Adriatic sea", 5321),
  foto('puglia-coppia', "couple seen from behind strolling up a narrow lane of a Valle d'Itria hill town like Ostuni or Locorotondo, lime-whitewashed houses with external stone staircases and small stone arches, pale polished limestone paving, terracotta pots with geraniums, a pale limestone church facade at the end of the lane, late afternoon", 5322),
  foto('puglia-bici', 'lone cyclist seen from behind riding a gravel road between ancient olive trees and dry stone walls, red earth', 4313),
];
export default assets;
