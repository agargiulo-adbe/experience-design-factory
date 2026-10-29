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
  { slug: 'scenario', num: '01', title: { it: 'Scenario', en: 'Scenario' } },
  { slug: 'persona', num: '02', title: { it: 'La persona', en: 'The persona' } },
  { slug: 'momenti', num: '03', title: { it: 'I sette momenti, dai due lati', en: 'Seven moments, from both sides' } },
  { slug: 'circolo', num: '04', title: { it: 'Il circolo che si chiude', en: 'The loop that closes' } },
  { slug: 'risultati', num: '05', title: { it: 'Risultati', en: 'Results' } },
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
