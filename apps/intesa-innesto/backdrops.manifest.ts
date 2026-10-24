import type { AssetSlot } from '@edf/core/assets/types';

/**
 * «Dove ci innestiamo» (Adobe × Intesa Sanpaolo) — gli sfondi generati.
 *
 * PRONTO MA NON LANCIATO: manca `apps/intesa-innesto/.env` con
 *   FIREFLY_CLIENT_ID=…
 *   FIREFLY_CLIENT_SECRET=…
 * Con quelle due righe:
 *   pnpm --filter intesa-innesto assets:build
 * scrive `src/assets/generated/bg/<id>.webp` + `provenance.json`. In pagina:
 *   import bg from '../assets/generated/bg/<id>.webp';
 *   <div slot="backdrop" class="ex-bg-night" style={`--bg-src: url(${bg.src})`}></div>
 * e sulla slide `data-made-with="Firefly" data-made-with-for="sfondo"` — il
 * credito è un fatto verificabile in provenance.json, non una decorazione.
 *
 * Perché servono: `pnpm audit:ritmo` misura i **deserti grafici**, e senza
 * sfondi il deck ne ha due. Sei copertine di capitolo con uno sfondo che
 * respira li chiudono, e danno al percorso un ritmo che il bianco non dà.
 *
 * Regole che valgono su ogni prompt qui sotto:
 *  · ASTRATTI per costruzione: niente persone, volti, mani, loghi, testo,
 *    prodotti del cliente. È la wrong-brand imagery che la Quality Bar vieta.
 *  · Palette del cliente, LETTA dal suo CSS di produzione: verde di sistema
 *    #258900, verde notte #0d2901, verde chiaro #4fc21f. Niente blu.
 *  · Fondo scuro e molto spazio vuoto: ci va sopra un titolo grande, e lo
 *    scrim si ricalibra guardando lo screenshot col testo sopra, non a occhio.
 */

const NO_TEXT =
  'text, letters, words, typography, captions, watermarks, logos, brand marks, icons, ' +
  'people, faces, hands, buildings, products, user interfaces, screens, charts';

const NEG =
  NO_TEXT + ', bright center, blown highlights, busy clutter, noise, low quality, ' +
  'blue tones, teal, cyan, purple, orange';

/** Una copertina di capitolo: fondo notte, una sola idea di luce verde. */
const notte = (id: string, idea: string, seed: number): AssetSlot => ({
  id,
  type: 'firefly',
  contentClass: 'art',
  prompt:
    `${idea}, deep near-black green background (#0d2901), a single soft light in ` +
    'system green (#258900) with a brighter edge (#4fc21f), generous empty dark ' +
    'space in the upper left for a headline, calm, cinematic, high detail, abstract',
  negativePrompt: NEG,
  aspect: '16:9',
  width: 2400,
  grade: 'none',
  seed,
  alt: '',
});

export const assets: AssetSlot[] = [
  notte('cap-01', 'a wide calm field of fine parallel lines, three of them slightly out of phase with the rest', 611),
  notte('cap-02', 'two layers of translucent planes, one resting on the other without touching', 612),
  notte('cap-03', 'a dense cloud of small points slowly resolving into three denser clusters', 613),
  notte('cap-04', 'many separate threads converging into a single braided line', 614),
  notte('cap-05', 'a slow pulse of light travelling along a thin path and arriving', 615),
  notte('cap-06', 'an open horizon with a single mark set far ahead on it', 616),
];
