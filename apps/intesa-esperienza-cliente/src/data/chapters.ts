/**
 * Adobe × Intesa Sanpaolo — i capitoli. Fonte unica per nav, home, SECTION_FLOW e, tramite
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
  /** ⚠️ Il titolo per la BARRA. Con nove capitoli i titoli lunghi non
      ci stanno su una riga sola — e la regola della nav è che resti una
      riga sola. Qui sta la versione corta; quella lunga vive
      nell'agenda di copertina, dove c'è lo spazio per leggerla. */
  breve?: { it: string; en: string };
}

export const CHAPTERS: Chapter[] = [
  /* Il capitolo 01 viene dal deck del 5 novembre (slide 2, 6, 7, 8, 11): è il
     solo capitolo in cui il design system NON è di Intesa ma di Adobe, perché
     parla di Adobe. Sta qui dentro come CITAZIONE — dichiarata, non ridisegnata
     in verde — e non altrove, perché un documento solo vale più di due. */
  { slug: 'adobe', num: '01', title: { it: 'Adobe per Intesa Sanpaolo', en: 'Adobe for Intesa Sanpaolo' }, breve: { it: 'Adobe', en: 'Adobe' } },
  { slug: 'scenario', num: '02', title: { it: 'Scenario', en: 'Scenario' } },
  { slug: 'persona', num: '03', title: { it: 'La persona', en: 'The persona' } },
  { slug: 'momenti', num: '04', title: { it: 'I sette momenti, dai due lati', en: 'Seven moments, from both sides' }, breve: { it: 'I sette momenti', en: 'Seven moments' } },
  { slug: 'circolo', num: '05', title: { it: 'Il circolo che si chiude', en: 'The loop that closes' }, breve: { it: 'Il circolo', en: 'The loop' } },
  /* Il lavoro si chiede a parole: l'intro a Coworker e il video con i
     dati del cliente, che si innesta dalla console di amministrazione. */
  { slug: 'coworker', num: '06', title: { it: 'Il lavoro si chiede a parole', en: 'The work is asked for in words' }, breve: { it: 'Il lavoro a parole', en: 'Work in words' } },
  { slug: 'risultati', num: '07', title: { it: 'Banche che lo fanno già', en: 'Banks already doing it' }, breve: { it: 'Referenze', en: 'References' } },
  /* ⚠️ Capitoli in attesa di contenuto: le slide ci sono ma dichiarano
     di essere segnaposto. Un capitolo vuoto e muto è peggio di un
     capitolo che dice «qui arriva questo, e lo porta chi di dovere». */
  { slug: 'analytics', num: '08', title: { it: 'CX Analytics', en: 'CX analytics' } },
  { slug: 'prossimi-passi', num: '09', title: { it: 'Prossimi passi', en: 'Next steps' } },
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
