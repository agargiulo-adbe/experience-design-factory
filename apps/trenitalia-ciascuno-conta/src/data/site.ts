import type { ExperienceType } from '@edf/core/data/experienceTypes';

/**
 * «Ciascuno conta» — identità dell'experience, dichiarata una volta.
 *
 * Tipo `interno`: è la versione per il team Adobe, costruita sullo stesso design
 * system e sullo stesso concept della versione che andrà alla Direzione Sales.
 * Il deck è scritto perché il cliente possa leggerlo senza danno; lo strato solo
 * nostro (persone, strategia, GNARR, costi) vive nella pagina gated `/dossier/`.
 */
export const SITE = {
  slug: 'trenitalia-ciascuno-conta',
  name: 'Ciascuno conta',
  client: 'Trenitalia',
  type: 'interno' as ExperienceType,
  langs: ['it'] as Array<'it' | 'en'>,
  defaultLang: 'it' as 'it' | 'en',
};

/** Gli asset pesanti (clip, audio) stanno sul Release `media`, condivisi con la Prospettiva. */
const RELEASE = 'https://github.com/agargiulo-adbe/experience-design-factory/releases/download/media';
export const OFFLINE = Boolean(import.meta.env.PUBLIC_OFFLINE);
export const media = (file: string) =>
  OFFLINE ? `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}media/${file}` : `${RELEASE}/${file}`;
