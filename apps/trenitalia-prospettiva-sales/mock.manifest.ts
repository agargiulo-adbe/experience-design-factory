import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Le fotografie dentro i mockup delle idee (9 nov 2026).
 * La promozione del «prima» ricalca la struttura della homepage vera: modulo di
 * ricerca in testa e, sotto, un'offerta stagionale con persone in viaggio. Di
 * spalle e senza treni: un treno generato somiglia sempre al treno di qualcuno.
 *
 *   pnpm exec tsx ../../scripts/build-assets.ts --manifest mock.manifest.ts --out src/assets/generated/mock
 */
export const assets: AssetSlot[] = [
  {
    id: 'mock-promo', type: 'firefly', contentClass: 'photo',
    prompt: 'young couple seen from behind walking with small suitcases along a historic Italian town street at dusk, warm festive string lights above the arcades, winter coats, natural candid travel photograph, shallow depth of field, high detail',
    negativePrompt: 'text, letters, numbers, signage, logos, watermarks, trains, carriages, vehicles, cars, buses, faces, portrait, looking at camera',
    aspect: '16:9', width: 1600, grade: 'none', seed: 4207, alt: '',
  },
];
export default assets;
