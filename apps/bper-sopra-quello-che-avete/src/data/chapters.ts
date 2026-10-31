/**
 * Adobe × BPER — i capitoli. Fonte unica per nav, copertina, SECTION_FLOW e,
 * tramite `admin.astro`, il registro delle slide.
 *
 * ⚠️ I SETTE CAPITOLI SONO LE SETTE SLIDE CHE IL CLIENTE HA GIÀ VISTO.
 * Non sono lo scheletro del tipo «blueprint» (scenario · fondamenta · use
 * case · convergenza · valore · rotta), che il generatore propone come punto
 * di partenza. Il 26 ottobre il referente IT ha elencato che cosa il suo capo
 * vuole vedere, e quella lista è stata rigirata come sette slide concordate:
 * cambiarne l’ordine o il taglio adesso vorrebbe dire presentarsi con un
 * documento che non è quello annunciato — a un incontro dove la presentazione
 * passa da lui cinque giorni prima.
 *
 * L’ottavo capitolo è l’ask, e la slide-firma sta in coda a quello.
 *
 * Per aggiungere, togliere o rinominare: qui + la pagina in
 * src/pages/<slug>.astro + PAGE_REGISTRY in admin.astro + ROUTE_SETS in
 * scripts/lib/deck-routes.ts.
 */
export interface Chapter {
  slug: string;
  num: string;
  title: { it: string; en: string };
  /** Il titolo per la BARRA: con otto capitoli i titoli lunghi non stanno su
      una riga sola, e la regola della nav è che resti una riga sola. */
  breve?: { it: string; en: string };
  /** Il punto del capitolo: la conseguenza, non il riassunto. Lo rende il
      divisore, e lo legge anche la copertina. */
  punto: { it: string; en: string };
}

export const CHAPTERS: Chapter[] = [
  {
    slug: 'adobe', num: '01',
    title: { it: 'Adobe, e perché non è un CRM', en: 'Adobe, and why it is not a CRM' },
    breve: { it: 'Adobe', en: 'Adobe' },
    punto: {
      it: 'Lo strato dove l’esperienza si decide sta sopra il CRM. Il giorno in cui cambiate CRM, non si rifà.',
      en: 'The layer where experience is decided sits above the CRM. The day you change CRM, it is not rebuilt.',
    },
  },
  {
    slug: 'architettura', num: '02',
    title: { it: 'Dove ci innestiamo', en: 'Where we plug in' },
    punto: {
      it: 'Due blocchi cambiano. Il resto della vostra architettura resta dov’è, e chi la governa resta chi la governa oggi.',
      en: 'Two blocks change. The rest of your architecture stays where it is, and whoever governs it stays in charge.',
    },
  },
  {
    slug: 'moduli', num: '03',
    title: { it: 'Che cosa prende il posto di che cosa', en: 'What replaces what' },
    breve: { it: 'I moduli', en: 'The modules' },
    punto: {
      it: 'Due prodotti escono, tre entrano, e il terzo è quello che oggi non avete.',
      en: 'Two products go out and four come in. Two of those you do not have today, and they are licensed separately.',
    },
  },
  {
    slug: 'dato', num: '04',
    title: { it: 'Il dato resta dov’è', en: 'The data stays where it is' },
    breve: { it: 'Il dato', en: 'The data' },
    punto: {
      it: 'La CDP non si tocca e il dato non si copia: si interroga dove vive. Su come, c’è una domanda da farvi.',
      en: 'The CDP is untouched and the data is not copied: it is queried where it lives. On how, we have a question for you.',
    },
  },
  {
    slug: 'referenze', num: '05',
    title: { it: 'Chi l’ha già fatto', en: 'Who has already done it' },
    breve: { it: 'Referenze', en: 'References' },
    punto: {
      it: 'Una referenza vale se la banca che la porta accetta di parlarvi. Qui c’è quello che possiamo dichiarare oggi.',
      en: 'A European bank has already done it on these modules, and its story is public. On the rest we invent nothing.',
    },
  },
  {
    slug: 'rotta', num: '06',
    title: { it: 'Come ci si arriva', en: 'How you get there' },
    breve: { it: 'La rotta', en: 'The route' },
    punto: {
      it: 'Si parte dal canale che pesa di più e si tiene Marketing Cloud acceso finché il primo percorso non gira.',
      en: 'You start from the channel that weighs most and keep Marketing Cloud running until the first journey works.',
    },
  },
  {
    slug: 'valore', num: '07',
    title: { it: 'Che cosa si paga, e di che cosa', en: 'What you pay for, and on what' },
    breve: { it: 'Il modello', en: 'The model' },
    punto: {
      it: 'Si paga su profili e volumi, non su licenze utente. E quello che è in più si vede che è in più.',
      en: 'You pay on profiles and volumes, not on user seats. And what is extra is visibly extra.',
    },
  },
  {
    slug: 'prossimi-passi', num: '08',
    title: { it: 'Prossimi passi', en: 'Next steps' },
    breve: { it: 'I passi', en: 'Next steps' },
    punto: {
      it: 'Tre domande aperte, e mezza giornata per chiuderle con chi conosce i vostri sistemi.',
      en: 'Three open questions, and half a day to close them with the people who know your systems.',
    },
  },
];

export function chapterIndex(slug: string): number {
  return CHAPTERS.findIndex((c) => c.slug === slug);
}
export function prevSlug(slug: string): string {
  const i = chapterIndex(slug);
  return i <= 0 ? '/' : '/' + CHAPTERS[i - 1].slug;
}
export function nextSlug(slug: string): string {
  const i = chapterIndex(slug);
  return i === -1 || i >= CHAPTERS.length - 1 ? '/' : '/' + CHAPTERS[i + 1].slug;
}
