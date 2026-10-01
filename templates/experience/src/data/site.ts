import type { ExperienceType } from '@edf/core/data/experienceTypes';

/**
 * «__NAME__» — identità dell'experience, dichiarata una volta.
 * Il tipo di deliverable (tassonomia Factory: prospettiva · storia · blueprint ·
 * playbook) governa la riga di copertina, la domanda del percorso e il passo
 * finale della slide-firma, letti da `@edf/core/data/experienceTypes`.
 * `langs`: la prima è la lingua di default; con una sola lingua il toggle sparisce
 * ma `<T it en>` tiene comunque entrambe le stringhe (contratto bilingue).
 */
export const SITE = {
  slug: '__SLUG__',
  name: '__NAME__',
  client: '__CLIENT__',
  type: '__TYPE__' as ExperienceType,
  langs: __LANGS__ as Array<'it' | 'en'>,
  defaultLang: '__DEFAULT_LANG__' as 'it' | 'en',
};
