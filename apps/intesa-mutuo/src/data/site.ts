import type { ExperienceType } from '@edf/core/data/experienceTypes';

/**
 * «Lo stesso mutuo, dai due lati» — identità dell'experience, dichiarata una volta.
 * Il tipo di deliverable (tassonomia Factory: prospettiva · storia · blueprint ·
 * playbook) governa la riga di copertina, la domanda del percorso e il passo
 * finale della slide-firma, letti da `@edf/core/data/experienceTypes`.
 * `langs`: la prima è la lingua di default; con una sola lingua il toggle sparisce
 * ma `<T it en>` tiene comunque entrambe le stringhe (contratto bilingue).
 */
export const SITE = {
  slug: 'intesa-mutuo',
  /* ⚠️ Il nome del DOCUMENTO, non quello della Storia. «Lo stesso mutuo,
     dai due lati» è il titolo del racconto di Giulia, che da quando il
     deck del 5 novembre è stato inglobato è uno dei nove capitoli: in
     barra faceva sembrare l'intero incontro una storia sul mutuo.
     Il titolo del racconto resta, e vive nel capitolo e nella copertina. */
  name: 'Adobe × Intesa Sanpaolo',
  sottotitolo: '5 novembre 2026',
  client: 'Intesa Sanpaolo',
  type: 'storia' as ExperienceType,
  langs: ['it'] as Array<'it' | 'en'>,
  defaultLang: 'it' as 'it' | 'en',
};
