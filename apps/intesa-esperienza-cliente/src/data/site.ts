import type { ExperienceType } from '@edf/core/data/experienceTypes';

/**
 * Adobe × Intesa Sanpaolo — identità dell'experience, dichiarata una volta.
 * Il tipo di deliverable (tassonomia Factory: prospettiva · storia · blueprint ·
 * playbook) governa la riga di copertina, la domanda del percorso e il passo
 * finale della slide-firma, letti da `@edf/core/data/experienceTypes`.
 * `langs`: la prima è la lingua di default; con una sola lingua il toggle sparisce
 * ma `<T it en>` tiene comunque entrambe le stringhe (contratto bilingue).
 */
export const SITE = {
  /* ⚠️ Lo slug è l'URL pubblico, e resta. Era `intesa-mutuo`, da quando
     l'experience raccontava il solo percorso del mutuo; con nove
     capitoli faceva sembrare l'intero incontro una storia su un
     prodotto. Il mutuo resta il filo del racconto di Giulia, che è UNO
     di quei capitoli. Rinominato il 30 ott 2026, prima della
     pubblicazione: dopo, un link già girato si romperebbe. */
  slug: 'intesa-esperienza-cliente',
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
