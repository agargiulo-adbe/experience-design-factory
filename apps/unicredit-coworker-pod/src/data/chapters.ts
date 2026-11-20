/**
 * «Da dove partiamo» — i capitoli. Fonte unica per nav, copertina, SECTION_FLOW
 * e, tramite `admin.astro`, il registro delle slide.
 *
 * Solo italiano: la sessione del 23 nov 2026 è con un team italiano, e il deck
 * non ha una seconda lingua (niente `<T en>`: la copia sta in chiaro nel markup).
 *
 * Gli slug vengono dallo scaffolder e non si toccano: sono già registrati in
 * deploy, hub, showcase e `scripts/lib/deck-routes.ts`. Il capitolo si chiama
 * con un'etichetta breve, tutte della stessa forma (prima il quadro, poi i due
 * approfondimenti, poi l'inizio): il fatto sta nei titoli di slide.
 * Giro del 17 nov 2026: `domanda-2` (Target da solo) è confluito in
 * `domanda-3`, perché il POD parte su Analytics e Target si aggancia dopo.
 *
 * `punto` è la riga della copertina di capitolo: la conseguenza, non il
 * riassunto (memoria `punto-del-capitolo`).
 */
export interface Chapter {
  slug: string;
  num: string;
  title: string;
  /** Il titolo breve, per la barra di navigazione. */
  breve: string;
  punto: string;
}

export const CHAPTERS: Chapter[] = [
  {
    slug: 'partenza', num: '01', title: 'Un programma di enablement', breve: 'Il programma',
    punto: 'Usare Coworker per 90 giorni con il Product Team Adobe, su scenari definiti insieme.',
  },
  {
    slug: 'domanda-1', num: '02', title: 'Analytics', breve: 'Analytics',
    punto: 'Coworker: un’interfaccia conversazionale per interrogare i vostri dati di Analytics.',
  },
  {
    slug: 'domanda-3', num: '03', title: 'Analytics e Target', breve: 'Analytics e Target',
    punto: 'Il programma di enablement aiuta ad armonizzare dentro Coworker i singoli step già a vostra disposizione.',
  },
  {
    slug: 'casa', num: '04', title: 'Da dove si comincia', breve: 'Da dove si comincia',
    punto: 'Oggi definiamo gli scenari di avvio del programma.',
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
