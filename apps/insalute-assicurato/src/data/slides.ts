/** Ogni slide del deck, pagina per pagina: la leggono la console e le note per chi presenta. Ogni <Slide id> nuova va registrata qui. */
/** `riserva`: fuori dal percorso delle frecce, raggiungibile dal pannello «Vai a…» (components/ModoRelatore.astro). */
export interface SlideEntry { id: string; label: string; riserva?: boolean }
export interface PageEntry { slug: string; label: string; slides: SlideEntry[]; }

export const PAGE_REGISTRY: PageEntry[] = [
  { slug: 'index', label: 'Copertina dell’incontro (00)', slides: [
    { id: 'slide-cover', label: 'Copertina: titolo e agenda a quattro voci' },
  ]},
  { slug: 'adobe', label: 'Adobe, chi siamo (01)', slides: [
    { id: 'slide-cover', label: 'Divisore: Adobe, chi siamo' },
    { id: 'slide-team', label: 'Il team Adobe in sala: tre persone' },
    { id: 'slide-fsi', label: 'Chi è Adobe: i numeri e i quattro Forrester Wave' },
    { id: 'slide-chi', label: 'Dati, contenuti e decisioni nello stesso sistema: le quattro funzioni' },
  ]},
  { slug: 'storie', label: 'Chi l’ha già fatto (02)', slides: [
    { id: 'slide-cover', label: 'Divisore: Chi l’ha già fatto' },
    { id: 'slide-inail', label: 'Inail: oltre 200 moduli diventati servizi digitali' },
    { id: 'slide-css', label: 'CSS: ogni passo della pratica, confermato' },
  ]},
  { slug: 'idee', label: 'Tre idee da discutere (03)', slides: [
    { id: 'slide-cover', label: 'Divisore: Tre idee da discutere' },
    { id: 'slide-tre', label: 'Le tre idee in una pagina' },
    { id: 'slide-rimborso', label: 'Idea 1 · Il rimborso, visto da chi lo chiede' },
    { id: 'slide-assistenti', label: 'Idea 2 · Che cosa rispondono di voi gli assistenti AI' },
    { id: 'slide-moduli', label: 'Idea 3 · Moduli e comunicazioni, già approvati' },
  ]},
  { slug: 'confronto', label: 'Partiamo da voi (04)', slides: [
    { id: 'slide-cover', label: 'Divisore: Partiamo da voi' },
    { id: 'slide-domande', label: 'Le domande per conoscervi' },
    { id: 'slide-passo', label: 'Un passo possibile dopo oggi' },
    { id: 'slide-firma', label: 'La firma: Adobe × InSalute Servizi' },
  ]},
];
