/**
 * «Dove ci innestiamo» — i capitoli. Fonte unica per nav, home, SECTION_FLOW e, tramite
 * `admin.astro`, il registro delle slide.
 *
 * Generati dallo scheletro del tipo «blueprint» (packages/core/src/data/experienceTypes.ts):
 * è un punto di partenza, non un vincolo. Per aggiungere, togliere o rinominare un
 * capitolo: qui + la pagina in src/pages/<slug>.astro + PAGE_REGISTRY in admin.astro
 * + ROUTE_SETS in scripts/deck-audit.ts.
 */
export interface Chapter {
  slug: string;
  num: string;
  title: { it: string; en: string };
}

/**
 * La sequenza non è quella di default dello scheletro: è quella decisa in
 * sessione di lavoro il 23 ott 2026, e l'ordine è l'argomento.
 *
 *   01  si dice NOI cosa hanno, con i loro nomi — se no «c'ho tutto e non c'ho niente»
 *   02  l'architettura, a fasi: il loro stack intero → dove si ferma → dove ci
 *       innestiamo COME COMPONENTI. È qui che si chiede «ti trovi?», e la
 *       risposta è il primo obiettivo dell'incontro
 *   03  perché quel vuoto riguarda il mestiere di chi fa audience e target
 *   04  CJA solo su ciò che va oltre l'analisi: stitching, attivazione, attribution
 *   05  AI Decisioning e Coworker come acceleratori, non come titolo
 *   06  perimetrare una fase — il passo che il Blueprint chiede
 */
export const CHAPTERS: Chapter[] = [
  { slug: 'scenario', num: '01', title: { it: 'Quello che abbiamo capito di voi', en: 'What we understood about you' } },
  { slug: 'fondamenta', num: '02', title: { it: 'L’architettura', en: 'The architecture' } },
  { slug: 'use-case', num: '03', title: { it: 'Audience e target', en: 'Audiences and targeting' } },
  { slug: 'convergenza', num: '04', title: { it: 'Oltre l’analisi', en: 'Beyond analysis' } },
  { slug: 'valore', num: '05', title: { it: 'Gli acceleratori', en: 'The accelerators' } },
  { slug: 'rotta', num: '06', title: { it: 'La rotta', en: 'The route' } },
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
