import type { AssetSlot } from '@edf/core/assets/types';
import { backdrops } from './backdrops.manifest';

/**
 * Slot immagine di questa experience.
 *
 * Qui resta SOLO il ritratto di Davide, che è una foto stock di persona: tutti
 * gli sfondi vengono da `backdrops.manifest.ts` e sono generati con Firefly
 * nella palette letta dal CSS di produzione di trenitalia.com. I sei sfondi
 * stock precedenti sono stati rimossi il 9 ott 2026: non erano referenziati da
 * nessuna slide e portavano il duotone CONDIVISO (marrone/avorio), cioè la
 * palette di un'altra experience.
 */
export const assets: AssetSlot[] = [
  {
    id: 'persona-marco',
    type: 'stock',
    query: 'confident bearded businessman glasses suit portrait smiling professional headshot',
    aspect: '4:5',
    width: 900,
    grade: 'editorial',
    alt: 'Davide — pendolare business Milano–Roma',
  },

  // Gli sfondi Firefly, uno per ogni slide — vedi backdrops.manifest.ts
  ...backdrops,
];
