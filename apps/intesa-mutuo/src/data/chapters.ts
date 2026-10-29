/**
 * «Lo stesso mutuo, dai due lati» — i capitoli. Fonte unica per nav, home, SECTION_FLOW e, tramite
 * `admin.astro`, il registro delle slide.
 *
 * Generati dallo scheletro del tipo «storia» (packages/core/src/data/experienceTypes.ts):
 * è un punto di partenza, non un vincolo. Per aggiungere, togliere o rinominare un
 * capitolo: qui + la pagina in src/pages/<slug>.astro + PAGE_REGISTRY in admin.astro
 * + ROUTE_SETS in scripts/deck-audit.ts.
 */
export interface Chapter {
  slug: string;
  num: string;
  title: { it: string; en: string };
}

export const CHAPTERS: Chapter[] = [
  /* Il capitolo 01 viene dal deck del 5 novembre (slide 2, 6, 7, 8, 11): è il
     solo capitolo in cui il design system NON è di Intesa ma di Adobe, perché
     parla di Adobe. Sta qui dentro come CITAZIONE — dichiarata, non ridisegnata
     in verde — e non altrove, perché un documento solo vale più di due. */
  { slug: 'adobe', num: '01', title: { it: 'Adobe per Intesa Sanpaolo', en: 'Adobe for Intesa Sanpaolo' } },
  { slug: 'scenario', num: '02', title: { it: 'Scenario', en: 'Scenario' } },
  { slug: 'persona', num: '03', title: { it: 'La persona', en: 'The persona' } },
  { slug: 'momenti', num: '04', title: { it: 'I sette momenti, dai due lati', en: 'Seven moments, from both sides' } },
  { slug: 'circolo', num: '05', title: { it: 'Il circolo che si chiude', en: 'The loop that closes' } },
  { slug: 'risultati', num: '06', title: { it: 'Risultati', en: 'Results' } },
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
