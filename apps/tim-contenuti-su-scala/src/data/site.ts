import type { ExperienceType } from '@edf/core/data/experienceTypes';

/**
 * «Una campagna, molti formati» — identità dell'experience, dichiarata una volta.
 * Il tipo di deliverable (tassonomia Factory: prospettiva · storia · blueprint ·
 * playbook) governa la riga di copertina, la domanda del percorso e il passo
 * finale della slide-firma, letti da `@edf/core/data/experienceTypes`.
 * `langs`: la prima è la lingua di default; con una sola lingua il toggle sparisce
 * ma `<T it en>` tiene comunque entrambe le stringhe (contratto bilingue).
 */
export const SITE = {
  slug: 'tim-contenuti-su-scala',
  name: 'Una campagna, molti formati',
  client: 'TIM',
  type: 'prospettiva' as ExperienceType,
  langs: ['it'] as Array<'it' | 'en'>,
  defaultLang: 'it' as 'it' | 'en',
};
