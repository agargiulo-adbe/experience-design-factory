/**
 * «Da dove partiamo» — i capitoli. Fonte unica per nav, copertina, SECTION_FLOW
 * e, tramite `admin.astro`, il registro delle slide.
 *
 * Solo italiano: la sessione del 23 nov 2026 è con un team italiano, e il deck
 * non ha una seconda lingua (niente `<T en>`: la copia sta in chiaro nel markup).
 *
 * Gli slug vengono dallo scaffolder e non si toccano: sono già registrati in
 * deploy, hub, showcase e `scripts/lib/deck-routes.ts`. Il capitolo si chiama
 * per la domanda che fa alla sala, non per lo slug.
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
    slug: 'partenza', num: '01', title: 'Il programma', breve: 'Il programma',
    punto: 'Novanta giorni con il prodotto accanto, sui casi che scegliete voi.',
  },
  {
    slug: 'domanda-1', num: '02', title: 'Che cosa chiedereste ai vostri dati?', breve: 'Analytics',
    punto: 'Sei famiglie di domande che oggi passano da un progetto Workspace o da un’analista.',
  },
  {
    slug: 'domanda-2', num: '03', title: 'Dove si fermano i vostri test?', breve: 'Target',
    punto: 'Su Target Coworker è disponibile oggi, in chat e dentro Target.',
  },
  {
    slug: 'domanda-3', num: '04', title: 'Dal numero al test, e ritorno', breve: 'Analytics e Target',
    punto: 'Quello che Analytics trova diventa un test, e il risultato torna nella stessa conversazione.',
  },
  {
    slug: 'casa', num: '05', title: 'Che cosa portiamo al PM', breve: 'Al PM',
    punto: 'Quello che dite oggi è il contesto con cui il programma comincia.',
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
