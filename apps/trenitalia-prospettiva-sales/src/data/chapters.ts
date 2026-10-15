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
  /**
   * IL PUNTO del capitolo: una frase, e dice che cosa cambia per LORO.
   *
   * Obbligatorio per contratto, e obbligatorio qui dentro perché un campo
   * facoltativo non viene scritto: un capitolo nuovo senza il suo punto non
   * compila, che è un vincolo più forte di qualunque gate. Il gate (`pnpm
   * audit:sintesi`) verifica il resto: che la frase sia una, stia in fondo al
   * capitolo e venga da qui invece che dal markup.
   *
   * Regole di scrittura, imparate il 14-15 ott 2026 misurando i deck:
   *   · UNA frase, 25 parole al massimo. Una sintesi lunga non è una sintesi.
   *   · **La conseguenza, non la compressione.** La prima versione di queste
   *     sette frasi riassumeva il capitolo, e il committente l'ha letta per quello
   *     che era: una ripetizione. «Le vendite si perdono in quattro punti, e due
   *     li decidete voi» ERA la slide-mappa più la riga sui perimetri. Il punto
   *     non ridice il capitolo: dice che cosa ne segue per loro — «dei quattro,
   *     i due che decidete voi sono gli ultimi due del percorso».
   *     Ri-presentare lo stesso materiale è la famiglia di interventi più debole
   *     che la ricerca abbia misurato (Dunlosky et al. 2013: riassunto e
   *     rilettura a bassa utilità); quello che regge in fondo è la conseguenza.
   *   · Dice un beneficio del cliente, non una proprietà del prodotto. Il test è
   *     il «So what?»: si chiede finché la risposta è una cosa che LUI vuole
   *     ottenere. «Il prodotto fa X» non è un punto.
   *   · Niente fatti nuovi: la conseguenza si regge su quello che il capitolo ha
   *     già mostrato, senza aggiungere affermazioni che nessuna fonte copre.
   *   · Voce al plurale istituzionale, come il resto del deck.
   *   · **L'ULTIMO capitolo chiude il cerchio**: il suo `messaggio` è la risposta
   *     alla domanda con cui il deck si è aperto, e lo rende `DeckClose` insieme
   *     alla domanda stessa e alla richiesta. Lì non c'è un punto di capitolo:
   *     ci sarebbero due chiusure a dieci secondi di distanza.
   *
   * Reso UNA volta, in fondo al capitolo, dal blocco `ChapterPoint`. NON sulla
   * home: sette punti in una slide sono esattamente la densità che il punto
   * esiste per togliere.
   */
  messaggio: string;
}

export const CHAPTERS: Chapter[] = [
  {
    slug: 'apertura', num: '01',
    title: { it: 'Il vostro anno, visto da fuori', en: 'Il vostro anno, visto da fuori' },
    short: 'Il vostro anno',
    messaggio: 'Con il prezzo fermo, la crescita deve arrivare da dove oggi non guardate.',
  },
  {
    slug: 'domanda', num: '02',
    title: { it: 'La domanda', en: 'La domanda' },
    short: 'La domanda',
    messaggio: 'Dei quattro punti, i due che decidete voi sono gli ultimi due del percorso.',
  },
  {
    slug: 'ricerca', num: '03',
    title: { it: 'Quando il viaggio si cerca con un assistente', en: 'Quando il viaggio si cerca con un assistente' },
    short: 'Gli assistenti',
    messaggio: 'Quel due su otto è una\u00a0leva: si misura, si presidia, e\u00a0si vede se ha funzionato.',
  },
  {
    slug: 'viaggio', num: '04',
    title: { it: 'Un viaggio, non più prodotti', en: 'Un viaggio, non più prodotti' },
    short: 'Il viaggio',
    messaggio: 'I pezzi ci sono tutti; manca la misura che li veda come un viaggio solo.',
  },
  {
    slug: 'contenuto', num: '05',
    title: { it: 'Il contenuto che l\'offerta richiede', en: 'Il contenuto che l\'offerta richiede' },
    short: 'Il contenuto',
    messaggio: 'Le varianti si moltiplicano, le persone no: il numero da guardare sono i giorni.',
  },
  {
    slug: 'rete', num: '06',
    title: { it: 'Il canale delle agenzie', en: 'Il canale delle agenzie' },
    short: 'Le agenzie',
    messaggio: 'Quello che non misurate non lo potete correggere, e\u00a0la rete oggi non si misura.',
  },
  {
    slug: 'rotta', num: '07',
    title: { it: 'La rotta', en: 'La rotta' },
    short: 'La rotta',
    messaggio: 'Si perdono prima che qualcuno salga sul treno, e la rete è il punto da cui si può partire.',
  },
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
