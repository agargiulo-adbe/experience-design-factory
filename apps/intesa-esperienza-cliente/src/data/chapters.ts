import { EDIZIONE, type Edizione } from '@edf/core/utils/edizione';
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

const CHAPTERS_SALA: Chapter[] = [
  /* L'ordine delle PAGINE. Il titolo è quello della voce d'agenda e finisce
     nel <title> (scheda del browser, anteprima del link): una pagina che
     dice un nome e una barra che ne dice un altro sembrano due documenti.
     Il capitolo 02 copre tre pagine: la copertina sta su `scenario`, la
     pagina di Giulia ha una copertina SENZA numero (num vuoto), così non si
     leggono due «Capitolo 02» di fila. */
  { slug: 'adobe', num: '01', title: { it: 'Adobe, chi siamo', en: 'Adobe, who we are' } },
  { slug: 'scenario', num: '02', title: { it: 'Giulia: un mutuo, sette momenti', en: 'Giulia: one mortgage, seven moments' } },
  { slug: 'persona', num: '', title: { it: 'Giulia, 34 anni', en: 'Giulia, 34' } },
  { slug: 'momenti', num: '', title: { it: 'I sette momenti', en: 'The seven moments' } },
  { slug: 'messa-a-terra', num: '03', title: { it: 'Dove ci innestiamo', en: 'Where we plug in' } },
  { slug: 'coworker', num: '04', title: { it: 'CX Enterprise Coworker', en: 'CX Enterprise Coworker' } },
  { slug: 'risultati', num: '05', title: { it: 'Referenze', en: 'References' } },
  { slug: 'prossimi-passi', num: '06', title: { it: 'I prossimi passi', en: 'Next steps' } },
];

/* Edizione «lettura» (il link da distribuire): l'ultimo capitolo non è più
   «I prossimi passi», scritto per la sala, ma «Parliamone». L'edizione è una
   costante di build, quindi la sala esce identica. */
const PARLIAMONE: Chapter = { slug: 'parliamone', num: '06', title: { it: 'Parliamone', en: 'Let’s talk' } };
export function capitoli(ed: Edizione): Chapter[] {
  return ed === 'lettura' ? [...CHAPTERS_SALA.slice(0, -1), PARLIAMONE] : CHAPTERS_SALA;
}
export const CHAPTERS: Chapter[] = capitoli(EDIZIONE);

/** La barra: le sette voci dell'agenda. `pagine` accende la voce. */
type VoceNav = { n: string; it: string; en: string; slug: string; ancora?: string; pagine: string[] };
const VOCI_SALA: VoceNav[] = [
  { n: '01', it: 'Adobe, chi siamo', en: 'Adobe, who we are', slug: 'adobe', pagine: ['adobe'] },
  { n: '02', it: 'Giulia', en: 'Giulia', slug: 'scenario', pagine: ['scenario', 'persona', 'momenti'] },
  { n: '03', it: 'Dove ci innestiamo', en: 'Where we plug in', slug: 'messa-a-terra', pagine: ['messa-a-terra', 'approfondimenti'] },
  { n: '04', it: 'Coworker', en: 'Coworker', slug: 'coworker', pagine: ['coworker'] },
  { n: '05', it: 'Referenze', en: 'References', slug: 'risultati', pagine: ['risultati'] },
  { n: '06', it: 'I prossimi passi', en: 'Next steps', slug: 'prossimi-passi', pagine: ['prossimi-passi'] },
];
export function vociNav(ed: Edizione): VoceNav[] {
  return ed === 'lettura'
    ? [...VOCI_SALA.slice(0, -1), { n: '06', it: 'Parliamone', en: 'Let’s talk', slug: 'parliamone', pagine: ['parliamone'] }]
    : VOCI_SALA;
}
export const VOCI_NAV: VoceNav[] = vociNav(EDIZIONE);

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
