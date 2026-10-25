/**
 * «Dove ci innestiamo» — i blocchi condivisi del deck, definiti UNA volta.
 *
 * La versione corta per un eventuale taglio «in dieci minuti» si aggiunge come
 * campo ACCANTO a quello lungo, mai come seconda voce: due copie a mano degli
 * stessi blocchi divergono sempre.
 *
 * ⚠️ L'architettura qui sotto è una LETTURA nostra, ricostruita dal lavoro di
 * preparazione sull'AI decisioning di ottobre 2026.
 *
 * Che cosa regge e che cosa no — verificato il 25 ott 2026 sul parlato del 22,
 * sulla call interna del 20, sul registro d'account e sulla cartella cliente:
 *  · «il ramo è già scritto» REGGE — lo descrive il cliente stesso: entra in
 *    un workflow per uno specifico ambito e «tempo dopo» riceve la
 *    comunicazione, con il journey builder dentro Salesforce;
 *  · «da 6 a 24 ore» NON ha fonte. Che il ritardo ci sia è loro, quanto sia
 *    era nostro. Ora è la domanda che andiamo a fare;
 *  · «cap settimanale» NON ha fonte: che un tetto ci sia è mestiere, che sia
 *    settimanale era un'invenzione. Ora dice «i vostri tetti di contatto»;
 *  · «l'anonimo non si lega» è una nostra inferenza, dichiarata in pagina.
 * Mai mettere in figura un numero che sembra misurato e non lo è: in sala
 * c'è chi quel numero lo conosce. Va validata dall'architetto
 * e corretta dal cliente: in slide è dichiarata come tale. In pagina non c'è
 * nessun virgolettato e non si nomina nessun terzo.
 */

export interface Testo { it: string; en: string }

// ── Le quattro cifre pubbliche ──────────────────────────────────────────────
// Fonte: dichiarazioni pubbliche del Gruppo, febbraio 2026 (intervista al
// responsabile tecnologia, dati e AI, ripresa sulla newsroom del Gruppo).
// ⚠️ NON il comunicato del piano d'impresa: quella pagina esiste e queste
// quattro cifre non ci sono. Verificato il 24 ott 2026 aprendo le due pagine.
// Le formulazioni qui sotto sono quelle della fonte, parola per parola:
// «il 95% dei prodotti per i privati è gestibile digitalmente» · «circa il 70%
// dei customer journey è omnicanale» · «quota di APPLICATIVI cloud-based …
// al 64% a fine 2025» (non «infrastruttura») · «circa 150 use case già in
// produzione». Nessuna è nostra, e si dice in slide.
// `n` è il valore per la scena count-up (nativa nel deck): la cifra sale.
export const CIFRE: Array<{ n: string; pre?: string; suf?: string; l: Testo }> = [
  { n: '95', suf: '%', l: { it: 'dei prodotti per i privati, gestibili in digitale', en: 'of retail products, manageable digitally' } },
  { n: '70', pre: '~', suf: '%', l: { it: 'dei percorsi cliente già omnicanale', en: 'of customer journeys already omnichannel' } },
  { n: '64', suf: '%', l: { it: 'degli applicativi in cloud a fine 2025', en: 'of applications in the cloud at end-2025' } },
  { n: '150', pre: '~', l: { it: 'casi d’uso di AI dichiarati in produzione', en: 'AI use cases declared in production' } },
];

// ── L'architettura: il MECCANISMO, cinque livelli ───────────────────────────
// Una scatola etichettata «CDP» dice meno della prosa; il percorso che un
// target fa, e che cosa ogni arco PORTA, dice quello che le parole non dicono.
// E il confronto si disegna: fra la fase 2 e la 3 cambiano gli archi, non gli
// elenchi. Geometria in unità di viewBox (1440 × 620), a mano.

/* Cinque nodi IDENTICI e equidistanti, calcolati e non posati a occhio:
     margine 24 · lato 248 · intervallo 38  →  5×248 + 4×38 + 2×24 = 1440.
   L'altezza regge il caso peggiore (un nome su due righe più la descrizione):
   con i 92 di prima il testo usciva dalla scatola, e usciva solo da QUELLA —
   i box erano uguali e i contenuti no.
   ⚠️ L'ALTEZZA DEL viewBox È UN VINCOLO DI LAYOUT, non una scelta di disegno:
   la figura è il contenuto più alto del deck, e a 1280×800 ogni unità in più
   spinge il titolo della slide sopra la safe-area (check `c`, HARD). A 760
   sforava di 9px; a 664 passa. Si compatta la verticale — l'arco di ritorno
   non ha bisogno di tutto quello spazio — e non si rimpicciolisce mai il tipo:
   il testo dei nodi è in `rem`, quindi stringere la figura lo farebbe uscire
   dalle scatole invece di rimpicciolirlo con lei. */
export const VIEWBOX = '0 0 1440 664';
export const H_NODO = 108;
export const W_NODO = 248;
const X = [24, 310, 596, 882, 1168];           // i cinque appoggi
const C = X.map((x) => x + W_NODO / 2);         // i cinque centri

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

const Y_FLUSSO = 368;
const Y_ADOBE = 56;

export const NODI: Nodo[] = [
  {
    id: 'dwh', ancora: { it: 'Data warehouse', en: 'Data warehouse' },
    sotto: { it: 'clienti, catalogo, prodotti', en: 'customers, catalogue, products' },
    x: X[0], y: Y_FLUSSO, w: W_NODO,
    voce: { it: 'Qui stanno i dati cliente e il catalogo dell’offerta. Non si sposta niente.', en: 'Customer data and the offer catalogue live here. Nothing moves.' },
  },
  {
    id: 'target', ancora: { it: 'Definizione dei target', en: 'Target definition' },
    sotto: { it: 'propensione, eleggibilità', en: 'propensity, eligibility' },
    x: X[1], y: Y_FLUSSO, w: W_NODO,
    voce: { it: 'I modelli di advanced analytics valutano propensione ed eleggibilità. Restano vostri.', en: 'Advanced analytics models score propensity and eligibility. They stay yours.' },
  },
  {
    id: 'cdp', ancora: { it: 'Customer Data Platform', en: 'Customer Data Platform' },
    sotto: { it: 'contact policy', en: 'contact policy' },
    x: X[2], y: Y_FLUSSO, w: W_NODO,
    voce: { it: 'Finalizza i segmenti, calcola chi è eleggibile a una nuova comunicazione e orchestra i canali.', en: 'Finalises segments, decides who is eligible for another message, orchestrates the channels.' },
  },
  {
    id: 'canali', ancora: { it: 'I canali', en: 'The channels' },
    sotto: { it: 'app, banner, push, email', en: 'app, banners, push, email' },
    x: X[3], y: Y_FLUSSO, w: W_NODO,
    voce: { it: 'Diretti e assistiti. I banner sono in prevalenza post-login.', en: 'Direct and assisted. Banners are mostly post-login.' },
  },
  {
    id: 'cliente', persona: true, ancora: { it: 'Il cliente', en: 'The customer' },
    x: X[4], y: Y_FLUSSO, w: W_NODO,
    voce: { it: 'Che nel frattempo si muove, e magari chiude in filiale.', en: 'Who meanwhile moves, and may well close it in branch.' },
  },

  {
    id: 'decisioning', nostro: true, ancora: { it: 'Decisioning', en: 'Decisioning' },
    sotto: { it: 'canale · contenuto · offerta', en: 'channel · content · offer' },
    x: C[3] - 131, y: Y_ADOBE, w: 262,
    voce: { it: 'Riceve la lista già costruita e decide, per profilo, che cosa esce adesso e su quale canale. Rispetta il cap.', en: 'Takes the list already built and decides, per profile, what goes out now and on which channel. It honours the cap.' },
  },
  {
    id: 'cja', nostro: true, ancora: { it: 'Customer Journey Analytics', en: 'Customer Journey Analytics' },
    sotto: { it: 'cuce anonimo e identificato', en: 'stitches anonymous and known' },
    x: C[1] - 145, y: Y_ADOBE, w: 290,
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
  { id: 'a1', d: dritto(X[0] + W_NODO, X[1]), etichetta: { it: 'i dati', en: 'the data' }, lx: 291, ly: Y_FLUSSO - 48 },
  { id: 'a2', d: dritto(X[1] + W_NODO, X[2]), etichetta: { it: 'il target', en: 'the target' },
    nota: { it: 'col prodotto già scelto', en: 'with the product already chosen' }, lx: 577, ly: Y_FLUSSO - 56 },
  { id: 'a3', d: dritto(X[2] + W_NODO, X[3]), etichetta: { it: 'la lista', en: 'the list' },
    nota: { it: 'entro i vostri tetti di contatto', en: 'within your contact caps' }, lx: 863, ly: Y_FLUSSO - 56 },
  { id: 'a4', d: dritto(X[3] + W_NODO, X[4]), etichetta: { it: 'il messaggio', en: 'the message' }, lx: 1149, ly: Y_FLUSSO - 48 },

  // L'arco che c'è ma costa: il ritorno dell'interazione, con la sua latenza.
  { id: 'ritorno', attrito: true,
    d: `M${C[4]} ${Y_FLUSSO + H_NODO} C${C[4]} 572, ${C[2]} 572, ${C[2]} ${Y_FLUSSO + H_NODO}`,
    etichetta: { it: 'l’interazione torna', en: 'the interaction returns' },
    nota: { it: 'con quanto ritardo?', en: 'with how much delay?' }, lx: C[3], ly: 616 },

  // L'arco che oggi NON c'è: l'anonimo non si lega al cliente dopo il login.
  // Passa SOTTO i due nodi Adobe (che finiscono a 172) con un margine vero.
  { id: 'anon', manca: true,
    d: `M${C[4]} ${Y_FLUSSO} C${C[4]} 220, ${C[1]} 220, ${C[1]} ${Y_FLUSSO}`,
    etichetta: { it: 'l’anonimo e il cliente', en: 'the anonymous and the customer' },
    nota: { it: 'oggi non si legano', en: 'today never tied together' }, lx: C[2], ly: 252 },

  // La fase 3: i due innesti, ciascuno con quello che porta.
  { id: 'i-dec', nostro: true, d: `M${C[3]} ${Y_ADOBE + H_NODO} L${C[3]} ${Y_MID - 15}`,
    etichetta: { it: 'che cosa esce adesso', en: 'what goes out now' },
    nota: { it: 'per profilo, non per lista', en: 'per profile, not per list' }, lx: C[3] + 16, ly: 226, lato: true },
  { id: 'i-cja', nostro: true, d: `M${C[1]} ${Y_ADOBE + H_NODO} L${C[1]} ${Y_FLUSSO - 11}`,
    etichetta: { it: 'la storia intera', en: 'the whole story' }, lx: C[1] + 16, ly: 226, lato: true },
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
    didascalia: { it: 'L’interazione torna con un ritardo, e il visitatore anonimo non diventa mai quel cliente.', en: 'The interaction comes back with a delay, and the anonymous visitor never becomes that customer.' },
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
