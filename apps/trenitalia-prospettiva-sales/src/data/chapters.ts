/**
 * «Dove può arrivare il viaggio» — i capitoli. Fonte unica per nav, home, SECTION_FLOW e, tramite
 * `admin.astro`, il registro delle slide.
 *
 * Generati dallo scheletro del tipo «prospettiva» (packages/core/src/data/experienceTypes.ts):
 * è un punto di partenza, non un vincolo. Per aggiungere, togliere o rinominare un
 * capitolo: qui + la pagina in src/pages/<slug>.astro + PAGE_REGISTRY in admin.astro
 * + ROUTE_SETS in scripts/deck-audit.ts.
 */
export interface Chapter {
  slug: string;
  num: string;
  title: { it: string; en: string };
  /** Etichetta corta per la barra di navigazione. Il titolo intero sta in copertina
   *  di capitolo: in nav, sette titoli lunghi sfondano la barra e l'ultimo si taglia
   *  — e una voce tagliata non è una destinazione. */
  short: string;
}

export const CHAPTERS: Chapter[] = [
  { slug: 'apertura', num: '01', title: { it: 'Il vostro anno, visto da fuori', en: 'Il vostro anno, visto da fuori' }, short: 'Il vostro anno' },
  { slug: 'domanda', num: '02', title: { it: 'La domanda', en: 'La domanda' }, short: 'La domanda' },
  { slug: 'ricerca', num: '03', title: { it: 'Quando il viaggio si cerca con un assistente', en: 'Quando il viaggio si cerca con un assistente' }, short: 'La ricerca' },
  { slug: 'viaggio', num: '04', title: { it: 'Un viaggio, non più prodotti', en: 'Un viaggio, non più prodotti' }, short: 'Il viaggio' },
  { slug: 'contenuto', num: '05', title: { it: 'Il contenuto che l\'offerta richiede', en: 'Il contenuto che l\'offerta richiede' }, short: 'Il contenuto' },
  { slug: 'rete', num: '06', title: { it: 'Il canale delle agenzie', en: 'Il canale delle agenzie' }, short: 'La rete' },
  { slug: 'rotta', num: '07', title: { it: 'La rotta', en: 'La rotta' }, short: 'La rotta' },
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
