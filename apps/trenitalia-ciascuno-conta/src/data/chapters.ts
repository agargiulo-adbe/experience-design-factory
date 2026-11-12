/**
 * «Ciascuno conta» — i capitoli. Fonte unica per nav, copertina, divisori e, tramite
 * `admin.astro`, il registro delle slide.
 *
 * Sei capitoli e non lo scheletro del Blueprint: il percorso è stato deciso nel
 * brainstorming del 12 novembre 2026 (numero → prova → percorso → giornata → chi →
 * che cosa resta). Per aggiungere o togliere un capitolo: qui + la pagina in
 * src/pages/<slug>.astro + PAGE_REGISTRY in admin.astro + ROUTE_SETS in
 * scripts/lib/deck-routes.ts.
 *
 * ⚠️ Questo deck si legge dal cliente senza danno: tutto ciò che è solo nostro
 * (persone, strategia, numeri commerciali, costi) sta nella pagina gated
 * `/dossier/`, mai qui.
 */
export interface Chapter {
  slug: string;
  num: string;
  title: { it: string; en: string };
  /** Etichetta corta per la barra: sei titoli lunghi sfondano la riga. */
  short: string;
  /** Il punto del capitolo: una frase, la conseguenza — non il riassunto. */
  punto: string;
  /** Lo sfondo del divisore, dalla serie «sole» della Prospettiva (Adobe Firefly). */
  foto: 'apertura' | 'ricerca' | 'viaggio' | 'contenuto' | 'rete' | 'rotta';
}

const t = (s: string) => ({ it: s, en: s });

export const CHAPTERS: Chapter[] = [
  { slug: 'numero', num: '01', title: t('Il numero di\u00a0ogni giorno'), short: 'Il numero',
    punto: 'Il venduto si guarda ogni mattina: serve sapere anche perché si muove.', foto: 'apertura' },
  { slug: 'prova', num: '02', title: t('Dalla promessa alla prova'), short: 'La prova',
    punto: 'Prima si misura sui vostri dati, poi si decide.', foto: 'ricerca' },
  { slug: 'percorso', num: '03', title: t('Il percorso'), short: 'Il percorso',
    punto: 'Qualche settimana di lavoro comune, con un traguardo fissato prima.', foto: 'viaggio' },
  { slug: 'giornata', num: '04', title: t('La giornata'), short: 'La giornata',
    punto: 'Il traguardo è una giornata di lavoro, non una presentazione.', foto: 'contenuto' },
  { slug: 'chi', num: '05', title: t('Chi c’è'), short: 'Chi c’è',
    punto: 'Business, tecnologia e partner allo stesso tavolo.', foto: 'rete' },
  { slug: 'rotta', num: '06', title: t('Che cosa resta'), short: 'Che cosa resta',
    punto: 'Una rotta scelta da voi, con un responsabile per ogni tappa.', foto: 'rotta' },
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
