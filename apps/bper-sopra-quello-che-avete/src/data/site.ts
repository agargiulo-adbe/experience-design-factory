import type { ExperienceType } from '@edf/core/data/experienceTypes';

/**
 * Adobe × BPER — identità dell’experience, dichiarata una volta.
 *
 * Il tipo governa la riga di copertina, la domanda del percorso e il passo
 * finale della slide-firma, letti da `@edf/core/data/experienceTypes`.
 * **Blueprint** e non Prospettiva né Storia: l’incontro del 12 novembre
 * risponde alla domanda «come si collega a quello che abbiamo?», davanti a
 * chi governa la tecnologia, con una gara già aperta. Non è il momento di
 * mostrare dove si potrebbe arrivare, ed è troppo presto per una storia.
 */
export const SITE = {
  slug: 'bper-sopra-quello-che-avete',
  /* ⚠️ Il nome del DOCUMENTO è la firma co-brand. Per questo il BaseLayout
     NON gli appende di nuovo «· Adobe × BPER Banca»: uscirebbe
     «Adobe × BPER · Adobe × BPER Banca» su ogni pagina, home compresa, e
     dalla pagina non si vede — si vede incollando il link in una chat. */
  name: 'Adobe × BPER',
  sottotitolo: '12 novembre 2026',
  client: 'BPER Banca',
  type: 'blueprint' as ExperienceType,
  langs: ['it'] as Array<'it' | 'en'>,
  defaultLang: 'it' as 'it' | 'en',
};
