/**
 * «Ciascuno conta» — i capitoli. Fonte unica per nav, copertina, divisori e, tramite
 * `admin.astro`, il registro delle slide.
 *
 * UN DECK A DUE LIVELLI (decisione del 12 novembre 2026, riprogettazione per il
 * leadership team Adobe Italia):
 * - **livello pubblico**: i capitoli senza `riservato`. È la versione che il cliente
 *   può leggere senza danno, e la base di quella che andrà alla Direzione Sales;
 * - **livello interno**: con il link a token gli stessi indirizzi si completano con i
 *   capitoli `riservato` e con le righe «per noi» sulle slide pubbliche. Quel
 *   contenuto arriva da Supabase (`restricted_docs`, chiave `deck`) e NON è mai nel
 *   bundle: qui c'è solo il titolo neutro del capitolo, perché la nav lo deve poter
 *   scrivere. Il runtime è in `components/Riservato.astro`.
 *
 * Senza token i capitoli riservati spariscono da nav, agenda e frecce, e quelli
 * rimasti si rinumerano da 01. Per aggiungere un capitolo: qui + la pagina in
 * src/pages/<slug>.astro + PAGE_REGISTRY in admin.astro + ROUTE_SETS in
 * scripts/lib/deck-routes.ts.
 *
 * L'ordine segue il racconto deciso il 12 novembre: da dove nasce, che idea, il
 * programma nel tempo, quanto vale e quanto costa, poi come si procede un atto dopo
 * l'altro (Scegliere · Misurare · Decidere · Scalare), e che cosa chiediamo.
 */
export interface Chapter {
  slug: string;
  num: string;
  title: { it: string; en: string };
  /** Etichetta corta per la barra: otto titoli lunghi sfondano la riga. */
  short: string;
  /** Il punto del capitolo: una frase, la conseguenza. Vuoto nei capitoli
   *  riservati, dove arriva dallo strato interno. */
  punto: string;
  /** Lo sfondo del divisore, dalla serie «sole» della Prospettiva (Adobe Firefly). */
  foto: 'apertura' | 'ricerca' | 'viaggio' | 'contenuto' | 'rete' | 'rotta';
  /** Solo nel livello interno. */
  riservato?: boolean;
}

const t = (s: string) => ({ it: s, en: s });

export const CHAPTERS: Chapter[] = [
  { slug: 'origine', num: '01', title: t('Da dove nasce'), short: 'Da dove nasce',
    punto: '', foto: 'apertura', riservato: true },
  { slug: 'idea', num: '02', title: t('L’idea'), short: 'L’idea',
    punto: 'Parlare a ciascun viaggiatore, e contare che cosa vende.', foto: 'ricerca' },
  { slug: 'programma', num: '03', title: t('Il programma'), short: 'Il programma',
    punto: 'Quattro atti, ognuno chiuso da una decisione.', foto: 'viaggio' },
  { slug: 'valore', num: '04', title: t('Quanto vale, quanto costa'), short: 'Quanto vale',
    punto: '', foto: 'rete', riservato: true },
  { slug: 'scegliere', num: '05', title: t('Scegliere e\u00a0misurare'), short: 'Scegliere',
    punto: 'Prima si scrive che cosa vuol dire riuscire, poi si misura sui vostri dati.', foto: 'ricerca' },
  { slug: 'giornata', num: '06', title: t('Decidere: la giornata'), short: 'La giornata',
    punto: 'Il risultato davanti a chi lo porterà a terra, e le scelte fatte insieme.', foto: 'contenuto' },
  { slug: 'scalare', num: '07', title: t('Scalare'), short: 'Scalare',
    punto: 'Dalla prova al lavoro di ogni giorno, con un responsabile per ogni tappa.', foto: 'rotta' },
  { slug: 'decisione', num: '08', title: t('Che cosa vi chiediamo'), short: 'La richiesta',
    punto: '', foto: 'rotta', riservato: true },
];

export const RISERVATI = CHAPTERS.filter((c) => c.riservato).map((c) => c.slug);

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
