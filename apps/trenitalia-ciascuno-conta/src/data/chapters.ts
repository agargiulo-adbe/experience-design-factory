/**
 * «Ciascuno conta» — i capitoli. Fonte unica per nav, copertina, divisori, sommario
 * dell'annex e, tramite `admin.astro`, il registro delle slide.
 *
 * UN DOCUMENTO INTERNO, IN DUE PARTI (13 novembre 2026, per il leadership team Adobe
 * Italia, 45 minuti):
 * - **presentazione** (`parte: 'presentazione'`): apertura, Il programma, Quanto vale
 *   e quanto costa, Rischi e prossime date, firma;
 * - **annex** (`parte: 'annex'`): dopo la firma, un sommario e sei parti di dettaglio.
 *   Le slide della presentazione ci portano con «Il dettaglio →» (Dettaglio.astro).
 *
 * Tutto è dietro il link a token: senza, si vede solo la copertina (Riservato.astro).
 * Il contenuto riservato arriva da Supabase (`restricted_docs`, chiave `deck`) e NON è
 * mai nel bundle: qui ci sono solo titoli e righe neutre. Per aggiungere un capitolo:
 * qui + src/pages/<slug>.astro + PAGE_REGISTRY in admin.astro + ROUTE_SETS in
 * scripts/lib/deck-routes.ts.
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
  /** `presentazione`: i capitoli che si proiettano al leadership team (45 minuti).
   *  `annex`: il dettaglio, dopo la firma, raggiunto dal sommario o dai link
   *  «Il dettaglio» delle slide. Nella barra l'annex è UNA voce. */
  parte: 'presentazione' | 'annex';
}

const t = (s: string) => ({ it: s, en: s });

/* 13 nov 2026 — un documento solo, interno, per il leadership team: tutto è dietro
 * il link a token (il bundle resta pubblico e senza nulla di riservato; senza token
 * si vede la copertina e basta). La versione per il cliente si ricaverà da qui. */
export const CHAPTERS: Chapter[] = [
  { slug: 'programma', num: '01', title: t('Il programma'), short: 'Il programma',
    punto: 'Quattro atti, e una prova che si chiude prima della giornata.', foto: 'viaggio', riservato: true, parte: 'presentazione' },
  { slug: 'valore', num: '02', title: t('Quanto vale, quanto costa'), short: 'Quanto vale, quanto costa',
    punto: '', foto: 'rete', riservato: true, parte: 'presentazione' },
  { slug: 'decisione', num: '03', title: t('Rischi e prossime date'), short: 'Rischi e date',
    punto: '', foto: 'rotta', riservato: true, parte: 'presentazione' },
  { slug: 'annex', num: 'A', title: t('Annex'), short: 'Annex',
    punto: 'Il dettaglio dietro ogni slide.', foto: 'rotta', riservato: true, parte: 'annex' },
  { slug: 'scegliere', num: 'A1', title: t('Scegliere e misurare'), short: 'Scegliere e misurare',
    punto: 'I casi d’uso, i criteri, le due corsie e il circuito dei dati.', foto: 'ricerca', riservato: true, parte: 'annex' },
  { slug: 'giornata', num: 'A2', title: t('La giornata di marzo'), short: 'La giornata',
    punto: 'La scaletta, le postazioni, chi c’è, il luogo e l’invito.', foto: 'contenuto', riservato: true, parte: 'annex' },
  { slug: 'scalare', num: 'A3', title: t('Dopo la giornata: il contratto'), short: 'Il contratto',
    punto: 'Le tre tappe dopo la firma, e chi fa che cosa.', foto: 'rotta', riservato: true, parte: 'annex' },
  { slug: 'numeri', num: 'A4', title: t('I numeri e i fatti tecnici'), short: 'Numeri e fatti',
    punto: 'Il valore riga per riga, i prodotti attorno, i fatti tecnici con le fonti.', foto: 'rete', riservato: true, parte: 'annex' },
  { slug: 'punti', num: 'A5', title: t('I punti da validare'), short: 'Punti da validare',
    punto: 'Dodici punti, chi li valida, in che ordine, e le domande ai partner.', foto: 'rotta', riservato: true, parte: 'annex' },
  { slug: 'idea', num: 'A6', title: t('Il racconto per il cliente'), short: 'Il racconto',
    punto: 'La mattina di chi decide, come la vedrà la Direzione Sales.', foto: 'ricerca', riservato: true, parte: 'annex' },
];

export const PRESENTAZIONE = CHAPTERS.filter((c) => c.parte === 'presentazione');
export const ANNEX = CHAPTERS.filter((c) => c.parte === 'annex' && c.slug !== 'annex');
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
