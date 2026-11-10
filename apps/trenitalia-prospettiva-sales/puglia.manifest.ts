import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Le versioni della campagna «Estate in Puglia» nel mockup del contenuto (9 nov 2026).
 * Tre pubblici, tre immagini davvero diverse: due tagli della stessa foto non
 * raccontano una campagna che si adatta. Persone di spalle, nessun treno.
 * 10 nov 2026: «Puglia» nel prompt non basta. La spiaggia era caraibica e il vicolo
 * greco: ora il prompt nomina ciò che la riconosce (torre costiera e macchia del
 * Salento, pietra chiara e scale esterne dei borghi della Valle d'Itria).
 * 10 nov 2026, sera: le persone uscivano allungate. Il CSS non deforma (object-fit: cover,
 * file 16:9): era la generazione. Famiglia e coppia rifatte in quadrato, con proporzioni
 * dichiarate nel prompt e nel negative.
 * ⚠️ Sono immagini generate, non fotografie di un luogo reale.
 *
 *   pnpm exec tsx ../../scripts/build-assets.ts --manifest puglia.manifest.ts --out src/assets/generated/puglia
 */
const NO = 'elongated bodies, stretched figures, long legs, tall thin figures, distorted anatomy, disproportionate limbs, text, letters, numbers, signage, logos, watermarks, trains, carriages, vehicles, cars, buses, boats, faces, portrait, looking at camera, overcast sky, palm trees, tropical, caribbean, greek island, santorini, blue domes';
const STILE = ', Puglia southern Italy, natural summer light, realistic natural colours, candid documentary travel photograph, high detail';
const PROP = ', ordinary people with natural realistic human body proportions, shot from eye level with a 50mm lens from a medium distance';
const foto = (id: string, prompt: string, seed: number, aspect: AssetSlot['aspect'] = '16:9'): AssetSlot => ({
  id, type: 'firefly', contentClass: 'photo', prompt: prompt + STILE, negativePrompt: NO,
  aspect, width: 1600, grade: 'none', seed, alt: '',
});

export const assets: AssetSlot[] = [
  foto('puglia-famiglia', 'family of four with two small children seen from behind walking hand in hand along a sandy beach of Salento, low pale limestone rocks and green Mediterranean scrub on the shore, an old square stone coastal watchtower on the headland in the distance, clear shallow Adriatic sea' + PROP, 6103, '1:1'),
  foto('puglia-coppia', "couple of average height seen from behind strolling along a narrow lane of a Valle d'Itria hill town like Ostuni or Locorotondo, lime-whitewashed houses with external stone staircases, pale limestone paving, terracotta pots with geraniums" + PROP, 6201, '1:1'),
  foto('puglia-bici', 'lone cyclist seen from behind riding a gravel road between ancient olive trees and dry stone walls, red earth', 4313),
];
export default assets;
