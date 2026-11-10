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
    { id: 'slide-chi-siamo', label: 'Chi siamo · team, offerta, storia con il Gruppo' },
  ]},
  { slug: 'apertura', label: 'Il vostro anno, visto da fuori (01)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-problemi', label: 'I problemi chiave · quattro fatti e le date',
      agenda: 'Quattro fatti, le date' },
  ]},
  { slug: 'domanda', label: 'Come ottimizzare le vendite? (02)', slides: [
    { id: 'slide-domanda', label: 'La domanda · come ottimizzare le vendite' },
    { id: 'slide-mappa', label: 'La mappa · quattro idee e prodotti',
      agenda: 'Le quattro idee, con i prodotti' },
  ]},
  { slug: 'ricerca', label: 'Quando il\u00a0viaggio si cerca con\u00a0un\u00a0assistente AI (03)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-campione', label: 'Il campione · le otto domande e i due assistenti',
      agenda: 'Otto domande, due assistenti' },
    { id: 'slide-idea', label: 'L’idea · la domanda su Matera, cifra, prodotti',
      agenda: 'Una delle otto, da vicino' },
    { id: 'slide-referto', label: 'Gli esiti · il referto e l’errore sul marchio',
      agenda: 'Che cosa abbiamo osservato' },
    { id: 'slide-leva', label: 'Che cosa si misura, e il secondo tempo del canale',
      agenda: 'Che cosa si misura, e si cambia' },
  ]},
  { slug: 'viaggio', label: 'Personalizzare su larga scala (04)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-idea', label: 'L’idea · mockup, cifra, referenza',
      agenda: 'La proposta giusta a chi arriva' },
    { id: 'slide-momenti', label: 'Prima chi non è registrato, poi chi lo è',
      agenda: 'Non registrati, poi registrati' }, // copy-audit-ignore V2 · «registrati» è un participio plurale, non un imperativo
    { id: 'slide-prima', label: 'La personalizzazione comincia prima, e altrove',
      agenda: 'Il treno, per chi ha la crociera' },
  ]},
  { slug: 'contenuto', label: 'Il contenuto a supporto dell’offerta personalizzata (05)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-idea', label: 'L’idea · mockup, cifra, prodotti',
      agenda: 'Una campagna, adattata per mercato' },
    { id: 'slide-unposto', label: 'Un posto solo',
      agenda: 'Tutte le versioni, in un posto solo' },
  ]},
  { slug: 'rete', label: 'Il canale delle agenzie (06)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-idea', label: 'L’idea · mockup, cifra, referenza',
      agenda: 'Un’ipotesi da approfondire' },
  ]},
  { slug: 'appendice', label: 'Appendice · fuori dal percorso', slides: [
    { id: 'slide-citta', label: 'Una proposta per città · quello che avete già provato' },
  ]},
  { slug: 'dieci-minuti', label: 'In dieci minuti · il taglio corto', slides: [
    { id: 'slide-cover', label: 'Copertina' },
    { id: 'slide-problemi', label: 'I problemi chiave' },
    { id: 'slide-domanda', label: 'La domanda' },
    { id: 'slide-mappa', label: 'Le quattro idee, in breve' },
    { id: 'slide-contributi', label: 'Le quattro idee · capability e prodotti' },
    { id: 'slide-tempi', label: 'La macro timeline' },
    { id: 'slide-signature', label: 'Slide-firma · Adobe × Trenitalia' },
  ]},
  { slug: 'rotta', label: 'La Roadmap (07)', slides: [
    { id: 'slide-cover', label: 'Cover del capitolo' },
    { id: 'slide-ripresa', label: 'La ripresa · le quattro idee, e la domanda',
      agenda: 'Da dove conviene cominciare' },
    { id: 'slide-tempi', label: 'La macro timeline · che cosa prima, che cosa dipende da altri',
      agenda: 'Una possibile sequenza' },
    { id: 'slide-signature', label: 'Slide-firma · Adobe × Trenitalia' },
  ]},
];

/** Le voci d'agenda di un capitolo, nell'ordine in cui si proiettano. */
export function agendaCapitolo(slug: string): string[] {
  const p = PAGE_REGISTRY.find((x) => x.slug === slug);
  if (!p) throw new Error(`slides.ts: capitolo «${slug}» non registrato`);
  return p.slides.filter((s) => s.agenda).map((s) => s.agenda!);
}
