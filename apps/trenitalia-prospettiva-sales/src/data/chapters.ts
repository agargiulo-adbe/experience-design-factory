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
   * Regole di scrittura, imparate il 14 ott 2026 misurando i deck:
   *   · UNA frase, 25 parole al massimo. Una sintesi lunga non è una sintesi.
   *   · Dice un beneficio del cliente, non una proprietà del prodotto. Il test è
   *     il «So what?»: si chiede finché la risposta è una cosa che LUI vuole
   *     ottenere. «Il prodotto fa X» non è un punto; «di questo canale sapete
   *     solo i conti» lo è.
   *   · Niente fatti nuovi: il punto riassume il capitolo, non aggiunge una
   *     affermazione che nessuna slide regge e nessuna fonte copre.
   *   · Voce al plurale istituzionale, come il resto del deck.
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
    messaggio: 'Il terzo operatore arriva, il prezzo verso l’alto è chiuso e il piano si sta scrivendo: la finestra è questa.',
  },
  {
    slug: 'domanda', num: '02',
    title: { it: 'La domanda', en: 'La domanda' },
    short: 'La domanda',
    messaggio: 'Le vendite si perdono in quattro punti del percorso d’acquisto, e due di quei quattro li decidete voi.',
  },
  {
    slug: 'ricerca', num: '03',
    title: { it: 'Quando il viaggio si cerca con un assistente', en: 'Quando il viaggio si cerca con un assistente' },
    short: 'Gli assistenti',
    messaggio: 'Su Google siete la fonte in due risposte su otto: è un numero, e si muove se qualcuno lo presidia.',
  },
  {
    slug: 'viaggio', num: '04',
    title: { it: 'Un viaggio, non più prodotti', en: 'Un viaggio, non più prodotti' },
    short: 'Il viaggio',
    messaggio: 'I pezzi del viaggio li avete già tutti e cinque, e l’acquisto li tiene insieme: manca la misura che li veda come uno solo.',
  },
  {
    slug: 'contenuto', num: '05',
    title: { it: 'Il contenuto che l\'offerta richiede', en: 'Il contenuto che l\'offerta richiede' },
    short: 'Il contenuto',
    messaggio: 'Le varianti si moltiplicano, le persone no: il numero da guardare sono i giorni che passano prima della vetrina.',
  },
  {
    slug: 'rete', num: '06',
    title: { it: 'Il canale delle agenzie', en: 'Il canale delle agenzie' },
    short: 'Le agenzie',
    messaggio: 'Quel canale vende ogni giorno, e voi ne vedete solo i conti: quale agenzia vende che cosa è la misura della vostra riorganizzazione.',
  },
  {
    slug: 'rotta', num: '07',
    title: { it: 'La rotta', en: 'La rotta' },
    short: 'La rotta',
    messaggio: 'Mezza giornata sui dati della rete vi dice quanto di questo percorso è già misurabile oggi.',
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
