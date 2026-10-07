/**
 * «Sei domande» — i sei capitoli. Ogni capitolo È una domanda di Giuseppe.
 * Fonte unica per nav, home, SECTION_FLOW, admin PAGE_REGISTRY.
 */
export interface Chapter {
  slug: string;
  num: string;
  label: { it: string; en: string };
  question: { it: string; en: string };
  /**
   * Un intermezzo non è una delle sei domande: sta nel flusso e nella nav, ma
   * non prende un numero e non entra nella griglia del percorso in home —
   * che resta 6 card su 2 righe da 3, come vuole la regola della roadmap.
   */
  interlude?: boolean;
}

export const CHAPTERS: Chapter[] = [
  { slug: 'accendere',  num: '01', label: { it: 'Accendere',  en: 'Switch on' },  question: { it: 'Come lo accendo, e per chi?',                          en: 'How do I switch it on, and for whom?' } },
  { slug: 'rispondere', num: '02', label: { it: 'Rispondere', en: 'Answer' },     question: { it: 'Cos’è successo ieri sulla SuperApp?',              en: 'What happened on the SuperApp yesterday?' } },
  { slug: 'capire',     num: '03', label: { it: 'Capire',     en: 'Understand' }, question: { it: 'Perché le Operazioni Veloci sono calate lunedì?',      en: 'Why did “Operazioni Veloci” drop on Monday?' } },
  { slug: 'governare',  num: '04', label: { it: 'Governare',  en: 'Govern' },     question: { it: 'Quali segmenti e suite non usa più nessuno?',          en: 'Which segments and suites does nobody use any more?' } },
  { slug: 'proteggere', num: '05', label: { it: 'Proteggere', en: 'Protect' },    question: { it: 'Dove finiscono i dati?',                               en: 'Where does the data go?' } },
  { slug: 'in-azione',  num: '',   label: { it: 'In azione',  en: 'In action' },  question: { it: 'Com’è, a vederlo?',                                    en: 'What does it look like?' }, interlude: true },
  { slug: 'evolvere',   num: '06', label: { it: 'Evolvere',   en: 'Evolve' },     question: { it: 'E domani?',                                            en: 'And tomorrow?' } },
];

/** Le sei domande vere: quello che la home mette nella griglia del percorso. */
export const QUESTIONS: Chapter[] = CHAPTERS.filter((c) => !c.interlude);

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
