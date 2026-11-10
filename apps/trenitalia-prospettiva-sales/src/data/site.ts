import type { ExperienceType } from '@edf/core/data/experienceTypes';

/**
 * «Dove può arrivare il viaggio» — identità dell'experience, dichiarata una volta.
 * Il tipo di deliverable (tassonomia Factory: prospettiva · storia · blueprint ·
 * playbook) governa la riga di copertina, la domanda del percorso e il passo
 * finale della slide-firma, letti da `@edf/core/data/experienceTypes`.
 * `langs`: la prima è la lingua di default; con una sola lingua il toggle sparisce
 * ma `<T it en>` tiene comunque entrambe le stringhe (contratto bilingue).
 */
export const SITE = {
  slug: 'trenitalia-prospettiva-sales',
  name: 'Dove può arrivare il viaggio',
  client: 'Trenitalia',
  type: 'prospettiva' as ExperienceType,
  langs: ['it'] as Array<'it' | 'en'>,
  defaultLang: 'it' as 'it' | 'en',
};

/**
 * Gli asset pesanti stanno sul Release `media`. Nella versione da portare in sala
 * senza rete (`scripts/build-offline.sh`, PUBLIC_OFFLINE=1) stanno accanto al deck.
 */
const RELEASE = 'https://github.com/agargiulo-adbe/experience-design-factory/releases/download/media';
export const OFFLINE = Boolean(import.meta.env.PUBLIC_OFFLINE);
export const media = (file: string) =>
  OFFLINE ? `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}media/${file}` : `${RELEASE}/${file}`;
