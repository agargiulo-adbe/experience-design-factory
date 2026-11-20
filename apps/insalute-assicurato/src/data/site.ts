import type { ExperienceType } from '@edf/core/data/experienceTypes';

/**
 * Adobe × InSalute Servizi — identità dell'experience, dichiarata una volta.
 * Primo incontro con il gestore delle prestazioni sanitarie della Divisione
 * Insurance di Intesa Sanpaolo, 24 novembre 2026, un'ora su Teams.
 * Tipo «prospettiva»: si arriva prima della discovery, con tre idee da
 * discutere e molte domande. La pelle viene dal riferimento Intesa
 * (`intesa-esperienza-cliente`), il design system è quello di InSalute.
 */
export const SITE = {
  slug: 'insalute-assicurato',
  name: 'Adobe × InSalute Servizi',
  sottotitolo: '24 novembre 2026',
  client: 'InSalute Servizi',
  type: 'prospettiva' as ExperienceType,
  langs: ['it'] as Array<'it' | 'en'>,
  defaultLang: 'it' as 'it' | 'en',
};
