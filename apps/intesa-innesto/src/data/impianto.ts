/**
 * «Dove ci innestiamo» — i blocchi condivisi del deck, definiti UNA volta.
 *
 * La versione corta per un eventuale taglio «in dieci minuti» si aggiunge come
 * campo ACCANTO a quello lungo, mai come seconda voce: due copie a mano degli
 * stessi blocchi divergono sempre.
 *
 * ⚠️ L'architettura qui sotto è una LETTURA nostra, ricostruita dal lavoro di
 * preparazione sull'AI decisioning di ottobre 2026. Va validata dall'architetto
 * e corretta dal cliente: in slide è dichiarata come tale. In pagina non c'è
 * nessun virgolettato e non si nomina nessun terzo.
 */

export interface Testo { it: string; en: string }

// ── Le quattro cifre pubbliche ──────────────────────────────────────────────
// Fonte: piano d'impresa 2026-2029. Nessuna è nostra, e si dice in slide.
// `n` è il valore per la scena count-up (nativa nel deck): la cifra sale.
export const CIFRE: Array<{ n: string; pre?: string; suf?: string; l: Testo }> = [
  { n: '95', suf: '%', l: { it: 'dei prodotti già disponibili in digitale', en: 'of products already available digitally' } },
  { n: '70', pre: '~', suf: '%', l: { it: 'dei percorsi cliente già omnicanale', en: 'of customer journeys already omnichannel' } },
  { n: '64', suf: '%', l: { it: 'dell’infrastruttura già in cloud', en: 'of the infrastructure already in the cloud' } },
  { n: '150', pre: '~', l: { it: 'casi d’uso di AI dichiarati in produzione', en: 'AI use cases declared in production' } },
];

// ── L'architettura: il MECCANISMO, cinque livelli ───────────────────────────
// Una scatola etichettata «CDP» dice meno della prosa; il percorso che un
// target fa, e che cosa ogni arco PORTA, dice quello che le parole non dicono.
// E il confronto si disegna: fra la fase 2 e la 3 cambiano gli archi, non gli
// elenchi. Geometria in unità di viewBox (1440 × 620), a mano.

export const VIEWBOX = '0 0 1440 620';
export const H_NODO = 92;

export interface Nodo {
  id: string;
  ancora: Testo;
  /** La riga piccola dentro il nodo: che cosa fa, in tre parole. */
  sotto?: Testo;
  x: number; y: number; w: number;
  nostro?: boolean;
  persona?: boolean;
  /** Non si rende MAI in pagina: è la battuta di chi presenta. */
  voce: Testo;
}

const Y_FLUSSO = 330;
const Y_ADOBE = 96;

export const NODI: Nodo[] = [
  {
    id: 'dwh', ancora: { it: 'Data warehouse', en: 'Data warehouse' },
    sotto: { it: 'clienti, catalogo, prodotti', en: 'customers, catalogue, products' },
    x: 24, y: Y_FLUSSO, w: 250,
    voce: { it: 'Qui stanno i dati cliente e il catalogo dell’offerta. Non si sposta niente.', en: 'Customer data and the offer catalogue live here. Nothing moves.' },
  },
  {
    id: 'target', ancora: { it: 'Definizione dei target', en: 'Target definition' },
    sotto: { it: 'propensione, eleggibilità', en: 'propensity, eligibility' },
    x: 320, y: Y_FLUSSO, w: 250,
    voce: { it: 'I modelli di advanced analytics valutano propensione ed eleggibilità. Restano vostri.', en: 'Advanced analytics models score propensity and eligibility. They stay yours.' },
  },
  {
    id: 'cdp', ancora: { it: 'Customer Data Platform', en: 'Customer Data Platform' },
    sotto: { it: 'contact policy · cap settimanale', en: 'contact policy · weekly cap' },
    x: 616, y: Y_FLUSSO, w: 250,
    voce: { it: 'Finalizza i segmenti, calcola chi è eleggibile a una nuova comunicazione e orchestra i canali.', en: 'Finalises segments, decides who is eligible for another message, orchestrates the channels.' },
  },
  {
    id: 'canali', ancora: { it: 'I canali', en: 'The channels' },
    sotto: { it: 'app, banner, push, email', en: 'app, banners, push, email' },
    x: 912, y: Y_FLUSSO, w: 250,
    voce: { it: 'Diretti e assistiti. I banner sono in prevalenza post-login.', en: 'Direct and assisted. Banners are mostly post-login.' },
  },
  {
    id: 'cliente', persona: true, ancora: { it: 'Il cliente', en: 'The customer' },
    x: 1208, y: Y_FLUSSO, w: 208,
    voce: { it: 'Che nel frattempo si muove, e magari chiude in filiale.', en: 'Who meanwhile moves, and may well close it in branch.' },
  },

  {
    id: 'decisioning', nostro: true, ancora: { it: 'AI Decisioning', en: 'AI Decisioning' },
    sotto: { it: 'canale · contenuto · offerta', en: 'channel · content · offer' },
    x: 760, y: Y_ADOBE, w: 262,
    voce: { it: 'Riceve la lista già costruita e decide, per profilo, che cosa esce adesso e su quale canale. Rispetta il cap.', en: 'Takes the list already built and decides, per profile, what goes out now and on which channel. It honours the cap.' },
  },
  {
    id: 'cja', nostro: true, ancora: { it: 'Customer Journey Analytics', en: 'Customer Journey Analytics' },
    sotto: { it: 'cuce anonimo e identificato', en: 'stitches anonymous and known' },
    x: 320, y: Y_ADOBE, w: 290,
    voce: { it: 'Oggi il visitatore anonimo non si lega al cliente dopo il login. Questo lo lega, anche a ritroso.', en: 'Today the anonymous visitor is never tied to the customer after login. This ties them, even backwards.' },
  },
];

/**
 * Gli archi PARLANO: un arco senza etichetta è «collegati in qualche modo».
 * `manca` = l'arco che oggi non esiste · `attrito` = l'arco che c'è ma costa.
 */
export interface Arco {
  id: string;
  d: string;
  etichetta: Testo;
  /** La riga piccola sotto l'etichetta: il dettaglio che fa capire. */
  nota?: Testo;
  lx: number; ly: number;
  /** L'etichetta sta a LATO della linea, non centrata sopra: se no la linea la taglia. */
  lato?: boolean;
  nostro?: boolean;
  manca?: boolean;
  attrito?: boolean;
}

const Y_MID = Y_FLUSSO + H_NODO / 2;
const dritto = (x1: number, x2: number) => `M${x1} ${Y_MID} L${x2 - 11} ${Y_MID}`;

export const ARCHI: Arco[] = [
  { id: 'a1', d: dritto(274, 320), etichetta: { it: 'i dati', en: 'the data' }, lx: 297, ly: Y_FLUSSO - 30 },
  { id: 'a2', d: dritto(570, 616), etichetta: { it: 'il target', en: 'the target' },
    nota: { it: 'col prodotto già scelto', en: 'with the product already chosen' }, lx: 593, ly: Y_FLUSSO - 30 },
  { id: 'a3', d: dritto(866, 912), etichetta: { it: 'la lista', en: 'the list' },
    nota: { it: 'entro il cap settimanale', en: 'within the weekly cap' }, lx: 889, ly: Y_FLUSSO - 30 },
  { id: 'a4', d: dritto(1162, 1208), etichetta: { it: 'il messaggio', en: 'the message' }, lx: 1185, ly: Y_FLUSSO - 30 },

  // L'arco che c'è ma costa: il ritorno dell'interazione, con la sua latenza.
  { id: 'ritorno', attrito: true,
    d: `M1312 ${Y_FLUSSO + H_NODO} C1312 548, 741 548, 741 ${Y_FLUSSO + H_NODO}`,
    etichetta: { it: 'l’interazione torna', en: 'the interaction returns' },
    nota: { it: 'da 6 a 24 ore', en: '6 to 24 hours' }, lx: 1026, ly: 578 },

  // L'arco che oggi NON c'è: l'anonimo non si lega al cliente dopo il login.
  { id: 'anon', manca: true,
    d: `M1312 ${Y_FLUSSO} C1312 150, 465 150, 465 ${Y_FLUSSO}`,
    etichetta: { it: 'l’anonimo e il cliente', en: 'the anonymous and the customer' },
    nota: { it: 'oggi non si legano', en: 'today never tied together' }, lx: 686, ly: 254 },

  // La fase 3: i due innesti, ciascuno con quello che porta.
  { id: 'i-dec', nostro: true, d: `M1000 ${Y_ADOBE + H_NODO} L1000 ${Y_MID - 15}`,
    etichetta: { it: 'che cosa esce adesso', en: 'what goes out now' },
    nota: { it: 'per profilo, non per lista', en: 'per profile, not per list' }, lx: 1014, ly: 244, lato: true },
  { id: 'i-cja', nostro: true, d: `M465 ${Y_ADOBE + H_NODO} L465 ${Y_FLUSSO - 11}`,
    etichetta: { it: 'la storia intera', en: 'the whole story' }, lx: 479, ly: 244, lato: true },
];

export interface Fase {
  id: string;
  titolo: Testo;
  /** La didascalia della figura: UNA riga, dice che cosa mostra il disegno. */
  didascalia: Testo;
  entrano: string[];
  accesi?: string[];
}

export const FASI: Fase[] = [
  {
    id: 'oggi',
    titolo: { it: 'Come viaggia un target, oggi', en: 'How a target travels today' },
    didascalia: { it: 'Quattro passaggi dal dato al cliente, e che cosa porta ciascuno.', en: 'Four hops from data to customer, and what each one carries.' },
    entrano: ['dwh', 'target', 'cdp', 'canali', 'cliente', 'a1', 'a2', 'a3', 'a4'],
  },
  {
    id: 'attrito',
    titolo: { it: 'Due cose che costano', en: 'Two things that cost' },
    didascalia: { it: 'L’interazione torna con ore di ritardo, e il visitatore anonimo non diventa mai quel cliente.', en: 'The interaction comes back hours late, and the anonymous visitor never becomes that customer.' },
    entrano: ['ritorno', 'anon'],
    accesi: ['ritorno', 'anon'],
  },
  {
    id: 'innesto',
    titolo: { it: 'Dove ci innestiamo', en: 'Where we graft on' },
    didascalia: { it: 'Due innesti sullo stesso percorso: la scelta si sposta all’ultimo metro, e la storia si ricompone.', en: 'Two grafts on the same path: the choice moves to the last metre, and the story comes back together.' },
    entrano: ['decisioning', 'cja', 'i-dec', 'i-cja'],
    accesi: ['i-dec', 'i-cja'],
  },
];

// ── I tre assi su cui il decisioning sceglie ────────────────────────────────
// Non è next best offer: è next best EXPERIENCE. Tre assi, non uno.
export const ASSI: Array<{ k: Testo; t: Testo; esempi: Testo }> = [
  {
    k: { it: 'Il canale', en: 'The channel' },
    t: { it: 'Dove arriva', en: 'Where it lands' },
    esempi: { it: 'banner in app, push, email, o una chiamata dalla filiale digitale', en: 'in-app banner, push, email, or a call from the digital branch' },
  },
  {
    k: { it: 'Il contenuto', en: 'The content' },
    t: { it: 'Che cosa dice', en: 'What it says' },
    esempi: { it: 'quale creatività, quale messaggio, quale incentivo', en: 'which creative, which message, which incentive' },
  },
  {
    k: { it: 'La natura', en: 'The nature' },
    t: { it: 'Funzione o offerta', en: 'Feature or offer' },
    esempi: { it: 'far usare una funzione che già c’è, oppure proporre un prodotto', en: 'drive use of a feature already there, or propose a product' },
  },
];
