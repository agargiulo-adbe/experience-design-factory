/**
 * Adobe × InSalute Servizi — i capitoli. Fonte unica per nav, copertina,
 * SECTION_FLOW e, tramite `admin.astro`, il registro delle slide.
 *
 * Quattro capitoli per un'ora di primo incontro: chi siamo, chi l'ha già
 * fatto, tre idee da discutere, e la parte che conta di più, cioè ascoltarli.
 * Per aggiungere o togliere un capitolo: qui + src/pages/<slug>.astro +
 * PAGE_REGISTRY in slides.ts + scripts/lib/deck-routes.ts.
 */
export interface Chapter {
  slug: string;
  num: string;
  title: { it: string; en: string };
}

export const CHAPTERS: Chapter[] = [
  { slug: 'adobe', num: '01', title: { it: 'Adobe, chi siamo', en: 'Adobe, who we are' } },
  { slug: 'storie', num: '02', title: { it: 'Chi l’ha già fatto', en: 'Who has done it' } },
  { slug: 'idee', num: '03', title: { it: 'Tre idee da discutere', en: 'Three ideas to discuss' } },
  { slug: 'confronto', num: '04', title: { it: 'Partiamo da voi', en: 'Starting from you' } },
];

/** La barra: una voce per capitolo. */
export const VOCI_NAV: { n: string; it: string; en: string; slug: string; ancora?: string; pagine: string[] }[] =
  CHAPTERS.map((c) => ({ n: c.num, it: c.title.it, en: c.title.en, slug: c.slug, pagine: [c.slug] }));

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
