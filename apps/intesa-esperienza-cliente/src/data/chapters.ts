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
  /* L'ordine delle PAGINE. Il titolo è quello della voce d'agenda e finisce
     nel <title> (scheda del browser, anteprima del link): una pagina che
     dice un nome e una barra che ne dice un altro sembrano due documenti.
     Il capitolo 02 copre tre pagine: la copertina sta su `scenario`, la
     pagina di Giulia ha una copertina SENZA numero (num vuoto), così non si
     leggono due «Capitolo 02» di fila. */
  { slug: 'adobe', num: '01', title: { it: 'Adobe e l’offerta', en: 'Adobe and the offering' } },
  { slug: 'scenario', num: '02', title: { it: 'Giulia: un mutuo, sette momenti', en: 'Giulia: one mortgage, seven moments' } },
  { slug: 'persona', num: '', title: { it: 'Giulia, 34 anni', en: 'Giulia, 34' } },
  { slug: 'momenti', num: '', title: { it: 'I sette momenti', en: 'The seven moments' } },
  { slug: 'messa-a-terra', num: '03', title: { it: 'Integrazione: dove si collega Adobe e che cosa si misura', en: 'Integration: where Adobe connects and what gets measured' } },
  { slug: 'coworker', num: '04', title: { it: 'CX Enterprise Coworker', en: 'CX Enterprise Coworker' } },
  { slug: 'risultati', num: '05', title: { it: 'Referenze: quattro casi già in produzione', en: 'References: four cases already live' } },
  { slug: 'prossimi-passi', num: '06', title: { it: 'La proposta e come si parte', en: 'The proposal and how we start' } },
];

/** La barra: le sette voci dell'agenda. `pagine` accende la voce. */
export const VOCI_NAV: { n: string; it: string; en: string; slug: string; ancora?: string; pagine: string[] }[] = [
  { n: '01', it: 'Adobe e l’offerta', en: 'Adobe and the offering', slug: 'adobe', pagine: ['adobe'] },
  { n: '02', it: 'Giulia', en: 'Giulia', slug: 'scenario', pagine: ['scenario', 'persona', 'momenti'] },
  { n: '03', it: 'Integrazione', en: 'Integration', slug: 'messa-a-terra', pagine: ['messa-a-terra', 'approfondimenti'] },
  { n: '04', it: 'Coworker', en: 'Coworker', slug: 'coworker', pagine: ['coworker'] },
  { n: '05', it: 'Referenze', en: 'References', slug: 'risultati', pagine: ['risultati'] },
  { n: '06', it: 'La proposta', en: 'The proposal', slug: 'prossimi-passi', pagine: ['prossimi-passi'] },
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
