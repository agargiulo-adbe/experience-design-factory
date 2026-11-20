import type { AssetSlot } from '@edf/core/assets/types';

/**
 * «Dalla parte dell'assicurato» (Adobe × InSalute Servizi) — le fotografie dei
 * divisori di capitolo e della copertina. Stock licenziato (Pexels), non
 * generato: per questo le slide che le portano NON dichiarano Adobe Firefly.
 *
 * Il registro è quello del sito di InSalute: luce naturale, casa, persone
 * vere in momenti quotidiani, palette calda e neutra con il blu di sistema
 * solo nei dettagli. Niente corsie d'ospedale, camici, siringhe: InSalute
 * gestisce il servizio, non cura nessuno, e un'immagine clinica sposterebbe
 * il discorso.
 *
 *   pnpm --filter insalute-assicurato exec tsx ../../scripts/build-assets.ts \
 *     --manifest divisori.manifest.ts --out src/assets/generated/div
 */
const foto = (id: string, query: string, alt: string): AssetSlot => ({
  id, type: 'stock', query, aspect: '16:9', width: 2400, grade: 'none', alt,
});

export const assets: AssetSlot[] = [
  foto('div-adobe', 'bright minimal modern office meeting table natural daylight empty white', 'Una sala riunioni luminosa e vuota'),
  foto('div-storie', 'woman reading letter at home kitchen table morning light calm', 'Una persona legge una lettera al tavolo di casa'),
  foto('div-idee', 'person holding smartphone at home sofa daylight close up hands', 'Mani che tengono uno smartphone, a casa'),
  foto('div-confronto', 'two people conversation coffee table bright room notebook', 'Due persone parlano a un tavolo, con un quaderno aperto'),
  foto('cover', 'family living room sunlight warm calm home interior', 'Un soggiorno di casa nella luce del pomeriggio'),
];
