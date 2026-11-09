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
  /* L'ordine delle PAGINE. I numeri e la barra seguono invece le sette voci
     dell'agenda concordata (`VOCI_NAV`): una voce può coprire più pagine, come
     «Dove ci innestiamo». CX Analytics sta dopo lo Scenario perché è il cuore
     di «Dal dato alla decisione», e non nomina Giulia prima che arrivi. */
  { slug: 'adobe', num: '01', title: { it: 'Adobe, chi siamo', en: 'Adobe, who we are' } },
  { slug: 'scenario', num: '03', title: { it: 'Scenario', en: 'Scenario' } },
  { slug: 'analytics', num: '03', title: { it: 'CX Analytics', en: 'CX analytics' } },
  { slug: 'persona', num: '04', title: { it: 'La persona', en: 'The persona' } },
  { slug: 'momenti', num: '04', title: { it: 'I sette momenti, dai due lati', en: 'Seven moments, from both sides' } },
  { slug: 'messa-a-terra', num: '04', title: { it: 'Come si mette a terra', en: 'How it gets built' } },
  { slug: 'coworker', num: '05', title: { it: 'Coworker, il lavoro si chiede a parole', en: 'Coworker, the work is asked for in words' } },
  { slug: 'risultati', num: '06', title: { it: 'Banche che lo fanno già', en: 'Banks already doing it' } },
  { slug: 'prossimi-passi', num: '07', title: { it: 'Prossimi passi', en: 'Next steps' } },
];

/** La barra: le sette voci dell'agenda. `pagine` accende la voce. */
export const VOCI_NAV = [
  { n: '01', it: 'Adobe', en: 'Adobe', slug: 'adobe', pagine: ['adobe'] },
  { n: '02', it: 'L’offerta', en: 'The offering', slug: 'adobe', ancora: 'slide-cx', pagine: [] as string[] },
  { n: '03', it: 'Dal dato alla decisione', en: 'From data to decision', slug: 'scenario', pagine: ['scenario', 'analytics'] },
  { n: '04', it: 'Dove ci innestiamo', en: 'Where we plug in', slug: 'persona', pagine: ['persona', 'momenti', 'messa-a-terra', 'approfondimenti'] },
  { n: '05', it: 'AI Conversazionali', en: 'Conversational AI', slug: 'coworker', pagine: ['coworker'] },
  { n: '06', it: 'Banche', en: 'Banks', slug: 'risultati', pagine: ['risultati'] },
  { n: '07', it: 'Prossimi passi', en: 'Next steps', slug: 'prossimi-passi', pagine: ['prossimi-passi'] },
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
