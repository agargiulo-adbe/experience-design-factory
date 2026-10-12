/**
 * «Una campagna, molti formati» — i capitoli. Fonte unica per nav, home, SECTION_FLOW e, tramite
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
}

export const CHAPTERS: Chapter[] = [
  { slug: 'apertura', num: '01', title: { it: 'Il vostro anno, visto da fuori', en: 'Your year, seen from outside' } },
  { slug: 'domanda', num: '02', title: { it: 'La domanda', en: 'The question' } },
  { slug: 'idee', num: '03', title: { it: 'Le idee', en: 'The ideas' } },
  { slug: 'rotta', num: '04', title: { it: 'La rotta', en: 'The route' } },
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
