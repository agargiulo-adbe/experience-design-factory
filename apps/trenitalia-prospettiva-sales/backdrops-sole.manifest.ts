import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Le fotografie solari delle copertine di capitolo (9 nov 2026).
 * Paesaggi italiani in piena luce: niente persone, testi, loghi o mezzi, perché un
 * treno generato somiglia sempre al treno di qualcuno.
 *
 *   pnpm exec tsx ../../scripts/build-assets.ts --manifest backdrops-sole.manifest.ts --out src/assets/generated/sole
 */
const NO = 'text, letters, numbers, signage, logos, watermarks, people, faces, trains, carriages, vehicles, cars, buses, boats, overcast sky, grey sky, night, dusk, fog, dark, low quality';
const STILE = ', bright clear sunny day, warm golden Mediterranean sunlight, deep blue sky, vivid natural colours, wide landscape photograph, high detail, no people, no text';
const sole = (id: string, prompt: string, seed: number): AssetSlot => ({
  id, type: 'firefly', contentClass: 'photo', prompt: prompt + STILE, negativePrompt: NO,
  aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});

export const assets: AssetSlot[] = [
  sole('sole-apertura', 'rolling green Tuscan hills with cypress trees and a white country road winding to the horizon', 4101),
  sole('sole-ricerca', 'ancient stone hillside town in southern Italy carved in warm limestone, seen from across a sunlit ravine', 4102),
  sole('sole-viaggio', 'empty railway tracks running straight through sunlit Italian vineyards toward distant mountains', 4103),
  sole('sole-contenuto', 'traditional trulli houses with conical grey stone roofs and white walls in Alberobello, Puglia, among silver olive trees and red earth', 4114),
  sole('sole-rete', 'empty sunlit Italian town square with arcades, warm ochre facades and a stone fountain', 4105),
  sole('sole-rotta', 'empty railway tracks crossing golden wheat fields toward a bright sunny horizon, Italian countryside', 4106),
];
export default assets;
