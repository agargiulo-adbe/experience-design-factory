/**
 * Adobe × BPER — i capitoli. Fonte unica per nav, copertina, SECTION_FLOW e,
 * tramite `admin.astro`, il registro delle slide.
 *
 * ⚠️ IL CAPITOLO «ADOBE, E PERCHÉ NON È UN CRM» NON C'È PIÙ, e il modo in cui
 * è sparito vale più della sua assenza. Il primo giro di revisione l'ha
 * svuotato — chi governa le fabbriche digitali di una banca ha poca pazienza
 * per le slide che spiegano chi è il fornitore — e per un giro è rimasto come
 * copertina sola: una voce su otto nell'indice e nella barra, che faceva
 * sembrare il documento più lungo di quanto fosse. La tesi che doveva portare
 * («lo strato dove l'esperienza si decide sta sopra il CRM, e non si rifà
 * quando il CRM cambia») adesso sta in copertina e nella mappa, che è il
 * posto dove si dimostra invece di essere annunciata.
 *
 * ⚠️ I SEI CAPITOLI SONO LE SLIDE CHE IL CLIENTE HA GIÀ VISTO, più l'ask.
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
  /** Il titolo per la BARRA: con sette capitoli i titoli lunghi non stanno su
      una riga sola, e la regola della nav è che resti una riga sola. */
  breve?: { it: string; en: string };
  /** Il punto del capitolo: la conseguenza, non il riassunto. Lo rende il
      divisore, e lo legge anche la copertina. */
  punto: { it: string; en: string };
}

export const CHAPTERS: Chapter[] = [
  {
    slug: 'architettura', num: '01',
    title: { it: 'Dove ci innestiamo', en: 'Where we plug in' },
    punto: {
      it: 'Tre blocchi cambiano. Il resto della vostra architettura resta dov’è, e chi la governa resta chi la governa oggi.',
      en: 'Three blocks change. The rest of your architecture stays where it is, and whoever governs it stays in charge.',
    },
  },
  {
    slug: 'moduli', num: '02',
    title: { it: 'Che cosa prende il posto di che cosa', en: 'What replaces what' },
    breve: { it: 'I moduli', en: 'The modules' },
    punto: {
      it: 'Due prodotti escono, quattro moduli entrano. Gli ultimi due aggiungono l’arbitrato fra canali e la misura sul percorso, e si licenziano a parte.',
      en: 'Two products go out, four modules come in. The last two add arbitration across channels and journey-wide measurement, and are licensed separately.',
    },
  },
  {
    slug: 'dato', num: '03',
    title: { it: 'Che cosa entra, e che cosa resta', en: 'What enters, and what stays' },
    breve: { it: 'Il dato', en: 'The data' },
    punto: {
      it: 'La vostra base clienti non entra. Entrano la chiave, gli eventi e i recapiti: qui c’è l’elenco, riga per riga.',
      en: 'Your customer base does not enter. The key, the events and the contact details do: here is the list, row by row.',
    },
  },
  {
    slug: 'referenze', num: '04',
    title: { it: 'Chi l’ha già fatto', en: 'Who has already done it' },
    breve: { it: 'Referenze', en: 'References' },
    punto: {
      it: 'Una banca europea l’ha già fatto su questi moduli, e la sua storia è pubblica. Sul resto non inventiamo niente.',
      en: 'A European bank has already done it on these modules, and its story is public. On the rest we invent nothing.',
    },
  },
  {
    slug: 'rotta', num: '05',
    title: { it: 'Come ci si arriva', en: 'How you get there' },
    breve: { it: 'La rotta', en: 'The route' },
    punto: {
      it: 'Si parte dal canale che pesa di più e si tiene Marketing Cloud acceso finché il primo percorso non gira.',
      en: 'You start from the channel that weighs most and keep Marketing Cloud running until the first journey works.',
    },
  },
  {
    slug: 'valore', num: '06',
    title: { it: 'Che cosa si paga, e di che cosa', en: 'What you pay for, and on what' },
    breve: { it: 'Il modello', en: 'The model' },
    punto: {
      it: 'Si paga su profili e volumi, non su licenze utente. Quello che è fuori perimetro sta su righe d’offerta sue.',
      en: 'You pay on profiles and volumes, not on user seats. What is out of scope sits on its own order lines.',
    },
  },
  {
    slug: 'prossimi-passi', num: '07',
    title: { it: 'Prossimi passi', en: 'Next steps' },
    breve: { it: 'I passi', en: 'Next steps' },
    punto: {
      it: 'Tre domande aperte, e mezza giornata per chiuderle con chi conosce i vostri sistemi.',
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
