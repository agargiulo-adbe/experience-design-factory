/**
 * IL REGISTRO DELLE SLIDE — una lista sola, due mestieri.
 *
 * ⚠️ PERCHÉ STA QUI E NON DENTRO `admin.astro`. Fino al 3 novembre 2026 ogni
 * copertina di capitolo portava la sua agendina scritta a mano, e il registro
 * dell'admin stava per conto suo. Le due liste sono divergite, come divergono
 * sempre due copie: la copertina del capitolo 01 annunciava «Il 96% che resta»
 * mentre la slide che segue, riscritta il 20 ottobre, parla d'altro; tre
 * capitoli su sette non avevano nessuna agenda; e dove c'era, contava tre voci
 * su cinque o sei slide. Il difetto l'ha trovato una collega guardando il deck,
 * non un gate — perché nessun gate confronta un indice con il suo contenuto.
 *
 * Ora la lista è una: l'admin la usa per accendere e spegnere, e la copertina
 * di capitolo ne rende le voci marcate `agenda`. Si aggiunge una slide qui, e
 * l'agenda del capitolo la sa.
 *
 * `label` parla all'operatore nella console. `agenda` parla alla stanza: è la
 * voce che il cliente legge sulla copertina del capitolo — un'ancora, massimo
 * sei parole. Senza `agenda` la slide resta fuori dall'indice: è il caso delle
 * copertine e delle slide-firma, che non sono argomenti.
 */
export interface SlideEntry {
  id: string;
  /** Nome tecnico, per la console di amministrazione. */
  label: string;
  /** La voce in copertina di capitolo. Assente = non è un argomento. */
  agenda?: string;
}
export interface PageEntry { slug: string; label: string; slides: SlideEntry[]; }

export const PAGE_REGISTRY: PageEntry[] = [
  { slug: 'index', label: 'Dove può arrivare il viaggio (00)', slides: [
    { id: 'slide-cover', label: 'Copertina e agenda della sessione' },
  ]},
  { slug: 'apertura', label: 'Il vostro anno, visto da fuori (01)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    // ⚠️ Il titolo diceva ancora «il 96% del territorio»: è il fatto del TTG
    // 2025, tolto dalla slide il 20 ottobre perché vecchio di un anno. La
    // slide porta le sue parole del TTG 2026 — e l'etichetta era rimasta
    // indietro, come l'agenda che la annunciava.
    { id: 'slide-mercato', label: 'Il mercato che resta · il 96%, con la data in chiaro',
      agenda: 'Il 96% che resta' },
    { id: 'slide-novantasei', label: 'Internazionalizzazione, e dove si sta investendo',
      agenda: 'La parola chiave dell’anno' },
    { id: 'slide-contesto', label: 'Tre cose nello stesso anno',
      agenda: 'Il mercato, il prezzo, il momento' },
  ]},
  { slug: 'domanda', label: 'La domanda (02)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-domanda', label: 'La domanda · dove si perdono le vendite, e i perimetri',
      agenda: 'Dove si perdono le vendite' },
    { id: 'slide-mappa', label: 'La mappa · quattro punti',
      agenda: 'I quattro punti, in ordine' },
  ]},
  { slug: 'ricerca', label: 'Quando il viaggio si cerca con un assistente (03)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-idea', label: 'L’idea · mockup, cifra, referenza',
      agenda: 'Da quale sito prendono la risposta' },
    { id: 'slide-referto', label: 'Il referto · le otto domande e i due assistenti',
      agenda: 'Otto domande, due assistenti' },
    { id: 'slide-frecce', label: 'Di chi sono le Frecce',
      agenda: 'Di chi sono le Frecce' },
    { id: 'slide-leva', label: 'Che cosa si misura, che cosa si cambia',
      agenda: 'Che cosa si misura, e si cambia' },
    { id: 'slide-canale', label: 'Il secondo tempo del canale · dove oggi vi citano, domani si compra',
      agenda: 'Dove vi citano, domani si compra' },
  ]},
  { slug: 'viaggio', label: 'Un viaggio, non più prodotti (04)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-idea', label: 'L’idea · mockup, cifra, referenza',
      agenda: 'Una soluzione, non tre prodotti' },
    { id: 'slide-gia', label: 'Quello che è già partito',
      agenda: 'Quello che è già partito' },
    { id: 'slide-matera', label: 'Il caso Roma-Matera',
      agenda: 'Dove il viaggio torna un biglietto' },
    { id: 'slide-acquisto', label: 'Riconoscere chi compone un viaggio',
      agenda: 'Chi sta componendo un viaggio' },
    { id: 'slide-prima', label: 'Il viaggio comincia altrove',
      agenda: 'Chi lo incontra prima di voi' },
    { id: 'slide-collab', label: 'Dove si innesta la collaborazione sui dati',
      agenda: 'Dove si innesta il dato condiviso' },
  ]},
  { slug: 'contenuto', label: 'Il contenuto che l\'offerta chiede (05)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-idea', label: 'L’idea · mockup, cifra, referenza',
      agenda: 'Un master, quattro mercati' },
    { id: 'slide-aritmetica', label: 'L\'aritmetica della squadra unica',
      agenda: 'L’aritmetica della squadra unica' },
    { id: 'slide-unposto', label: 'Un posto solo',
      agenda: 'Un posto solo, dalle agenzie ai mercati' },
  ]},
  { slug: 'rete', label: 'Il canale delle agenzie (06)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-idea', label: 'L’idea · mockup, cifra, referenza',
      agenda: 'La rete con in mano quello del sito' },
    { id: 'slide-settantamila', label: 'Settantamila punti vendita',
      agenda: 'Quanto è grande la rete' },
    { id: 'slide-sapere', label: 'Che cosa sapreste',
      // 4 nov: diceva «e oggi no». La stessa affermazione di assenza del lead,
      // sul divisore di capitolo, dove è la prima cosa che si legge.
      agenda: 'Che cosa sapreste della rete' },
    { id: 'slide-serve', label: 'La domanda, e che cosa serve',
      agenda: 'Che cosa serve, concretamente' },
  ]},
  { slug: 'dieci-minuti', label: 'In dieci minuti · il taglio corto', slides: [
    { id: 'slide-cover', label: 'Copertina' },
    { id: 'slide-novantasei', label: 'Internazionalizzazione' },
    { id: 'slide-contesto', label: 'Tre cose nello stesso anno' },
    { id: 'slide-domanda', label: 'La domanda' },
    { id: 'slide-mappa', label: 'I quattro punti, in breve' },
    { id: 'slide-passo', label: 'Il passo che chiediamo' },
    { id: 'slide-signature', label: 'Slide-firma · Adobe × Trenitalia' },
  ]},
  { slug: 'rotta', label: 'La rotta (07)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-passo', label: 'Il passo che chiediamo',
      agenda: 'Il passo che chiediamo' },
    { id: 'slide-domande', label: 'Le quattro domande aperte',
      agenda: 'Le quattro domande aperte' },
    { id: 'slide-signature', label: 'Slide-firma · Adobe × Trenitalia' },
  ]},
];

/** Le voci d'agenda di un capitolo, nell'ordine in cui si proiettano. */
export function agendaCapitolo(slug: string): string[] {
  const p = PAGE_REGISTRY.find((x) => x.slug === slug);
  if (!p) throw new Error(`slides.ts: capitolo «${slug}» non registrato`);
  return p.slides.filter((s) => s.agenda).map((s) => s.agenda!);
}
