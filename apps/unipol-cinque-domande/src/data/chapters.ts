/**
 * «Cinque domande» — i capitoli. Fonte unica per nav, home, SECTION_FLOW e, tramite
 * `admin.astro`, il registro delle slide.
 *
 * Generati dallo scheletro del tipo «playbook» (packages/core/src/data/experienceTypes.ts):
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
  { slug: 'partenza',  num: '01', title: { it: 'Il punto di partenza',  en: 'The starting point' } },
  { slug: 'domanda-1', num: '02', title: { it: 'Chiudere un test',      en: 'Closing a test' } },
  { slug: 'domanda-2', num: '03', title: { it: 'La memoria dei test',   en: 'The memory of tests' } },
  { slug: 'domanda-3', num: '04', title: { it: 'Dove è forte',          en: 'Where it is strong' } },
  { slug: 'domanda-4', num: '05', title: { it: 'Alert e tabelle',       en: 'Alerts and tables' } },
  { slug: 'domanda-5', num: '06', title: { it: 'Il contesto',           en: 'The context' } },
  { slug: 'casa',      num: '07', title: { it: 'Cosa vi portate a casa', en: 'What you take home' } },
  { slug: 'registro',  num: '08', title: { it: 'Il registro',           en: 'The log' } },
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
