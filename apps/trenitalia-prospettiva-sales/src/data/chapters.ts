/**
 * «Dove può arrivare il viaggio» — i capitoli. Fonte unica per nav, home, SECTION_FLOW e, tramite
 * `admin.astro`, il registro delle slide.
 *
 * Generati dallo scheletro del tipo «prospettiva» (packages/core/src/data/experienceTypes.ts):
 * è un punto di partenza, non un vincolo. Per aggiungere, togliere o rinominare un
 * capitolo: qui + la pagina in src/pages/<slug>.astro + PAGE_REGISTRY in admin.astro
 * + ROUTE_SETS in scripts/deck-audit.ts.
 */
export interface Chapter {
  slug: string;
  num: string;
  title: { it: string; en: string };
  /** Etichetta corta per la barra di navigazione. Il titolo intero sta in copertina
   *  di capitolo: in nav, sette titoli lunghi sfondano la barra e l'ultimo si taglia
   *  — e una voce tagliata non è una destinazione. */
  short: string;
  /** Il punto del capitolo: la frase che sta nel pannello di colore del
   *  divisore. Una sola, e dice la conseguenza — non riassume il capitolo. */
  punto: string;
  /** Lo sfondo del divisore. Ogni capitolo il suo: fino al 4 novembre erano
   *  tutti e sette lo stesso, e sette divisori identici non sono un ritmo. */
  foto: 'cover' | 'close' | 'search' | 'journey' | 'paper-grid' | 'network' | 'chapter';
  /** Di chi è il tavolo — 6 nov 2026, panel. Quattro capitoli su sette
   *  descrivono superfici che non si decidono alla Direzione Sales, e il
   *  documento viene inoltrato: chi lo riceve deve leggere da sé che qui
   *  portiamo domande. ⚠️ Si dichiara il NOSTRO modo di stare al tavolo, non
   *  quale direzione tiene che cosa: quella mappa è stata tolta il 4 novembre
   *  perché spiegare a un direttore che cosa non è suo, con in mano le carte
   *  della sua azienda, apre una domanda sola — «chi ve l'ha detto?». */
  tavolo?: string;
}

export const CHAPTERS: Chapter[] = [
  { slug: 'apertura', num: '01', title: { it: 'Il vostro anno, visto da fuori', en: 'Il vostro anno, visto da fuori' }, short: 'Il vostro anno',
    punto: 'Tre fatti che cambiano l’anno commerciale, e nessuno dei tre arriva da noi.', foto: 'cover' },
  { slug: 'domanda', num: '02', title: { it: 'La domanda', en: 'La domanda' }, short: 'La domanda',
    punto: 'Una domanda sola. Tutto il resto del documento risponde a quella.', foto: 'close' },
  { slug: 'ricerca', num: '03', title: { it: 'Quando il viaggio si cerca con un assistente', en: 'Quando il viaggio si cerca con un assistente' }, short: 'Gli assistenti',
    punto: 'Il primo punto del percorso sta prima di ogni vostra pagina, e questa volta è una misura.', foto: 'search',
    tavolo: 'Qui portiamo domande.' },
  { slug: 'viaggio', num: '04', title: { it: 'Un viaggio, non più prodotti', en: 'Un viaggio, non più prodotti' }, short: 'Il viaggio',
    punto: 'Qui abbiamo più domande che risposte: l’intermodale è il vostro mestiere, non il nostro.', foto: 'journey',
    tavolo: 'Qui portiamo domande.' },
  { slug: 'contenuto', num: '05', title: { it: 'Il contenuto che l\'offerta chiede', en: 'Il contenuto che l\'offerta chiede' }, short: 'Il contenuto',
    punto: 'La squadra è una e i prodotti sono tre: ogni campagna si moltiplica per\u00a0mercato e per\u00a0lingua.', foto: 'paper-grid',
    tavolo: 'Qui portiamo domande.' },
  { slug: 'rete', num: '06', title: { it: 'Il canale delle agenzie', en: 'Il canale delle agenzie' }, short: 'Le agenzie',
    punto: 'Un canale che vende ogni giorno: quanto se ne vede oggi?', foto: 'network',
    tavolo: 'Qui vi chiediamo mezza giornata.' },
  { slug: 'rotta', num: '07', title: { it: 'La rotta', en: 'La rotta' }, short: 'La rotta',
    punto: 'Quattro punti sono troppi per cominciare da tutti: ne proponiamo uno, e la decisione è vostra.', foto: 'chapter' },
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
