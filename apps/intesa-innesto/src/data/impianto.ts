/**
 * «Dove ci innestiamo» — i blocchi condivisi del deck, definiti UNA volta.
 *
 * Qui dentro c'è quello che più di una pagina usa: l'impianto del cliente, le
 * cifre pubbliche, i tre strati dell'architettura. Dove servirà una versione
 * corta (il taglio «in dieci minuti», se nascerà) si aggiunge un campo ACCANTO
 * a quello lungo — `tBreve`, `bBreve` — e mai una seconda voce: due copie a
 * mano degli stessi blocchi divergono sempre, e diverge il taglio corto.
 *
 * ⚠️ Gli STRATI sono la bozza da far validare all'architetto prima dell'incontro.
 * Animare o presentare un'architettura non concordata la rende solo più
 * memorabile quando è sbagliata.
 */

export interface Testo { it: string; en: string }

// ── L'impianto come lo leggiamo da fuori ────────────────────────────────────
// Fonte: incontro del 22 ott 2026 + confronto interno col team che segue
// l'account. È una LETTURA nostra, dichiarata come tale in slide.
export const IMPIANTO: Array<{ k: Testo; t: Testo; b: Testo }> = [
  {
    k: { it: 'Il dato', en: 'The data' },
    t: { it: 'Adobe Analytics, sul digitale', en: 'Adobe Analytics, on digital' },
    b: {
      it: 'Il comportamento su web e app è tracciato in profondità e da anni. Quello che succede in filiale, al telefono e sui contatti assistiti resta in altri sistemi, e oggi non si somma allo stesso cliente.',
      en: 'Web and app behaviour has been tracked in depth for years. What happens in branch, over the phone and in assisted contacts stays in other systems, and today it does not add up to the same customer.',
    },
  },
  {
    k: { it: 'La decisione', en: 'The decision' },
    t: { it: 'I target nel CRM, i journey nei workflow', en: 'Targets in the CRM, journeys in workflows' },
    b: {
      it: 'Le audience si costruiscono a monte, con modelli di propensione vostri. I percorsi girano nei workflow di Salesforce Marketing Cloud: chi entra in un workflow riceve la comunicazione prevista per quel ramo.',
      en: 'Audiences are built upstream, with your own propensity models. Journeys run inside Salesforce Marketing Cloud workflows: whoever enters a workflow gets the message that branch prescribes.',
    },
  },
  {
    k: { it: 'Il canale', en: 'The channel' },
    t: { it: 'Un solo percorso, da ogni porta', en: 'One journey, from every door' },
    b: {
      it: 'Il passaggio dalla multicanalità all’omnicanalità è fatto: lo stesso percorso identico dalla filiale, dall’app e dal sito. Web e form girano su Adobe Experience Manager, oggi installato in casa.',
      en: 'The move from multichannel to omnichannel is done: the very same journey from the branch, the app and the site. Web and forms run on Adobe Experience Manager, today installed on premise.',
    },
  },
];

// ── Le quattro cifre pubbliche ──────────────────────────────────────────────
// Fonte: piano d'impresa 2026-2029. Nessuna è nostra, e si dice in slide.
// `n` è il valore numerico per la scena count-up (nativa nel deck, vedi
// playSlide): la cifra sale invece di comparire. `pre`/`suf` la vestono.
export const CIFRE: Array<{ n: string; pre?: string; suf?: string; l: Testo }> = [
  { n: '95', suf: '%', l: { it: 'dei prodotti già disponibili in digitale', en: 'of products already available digitally' } },
  { n: '70', pre: '~', suf: '%', l: { it: 'dei percorsi cliente già omnicanale', en: 'of customer journeys already omnichannel' } },
  { n: '64', suf: '%', l: { it: 'dell’infrastruttura già in cloud', en: 'of the infrastructure already in the cloud' } },
  { n: '150', pre: '~', l: { it: 'casi d’uso di AI dichiarati in produzione', en: 'AI use cases declared in production' } },
];

// ── L'architettura: il MECCANISMO, non i nomi ───────────────────────────────
// Regola del mestiere (skills/.../ancore-non-prosa.md + artifact-diagramming):
// una scatola etichettata «cache» dice meno della prosa; il percorso che una
// richiesta fa, e che cosa ogni freccia PORTA, dice quello che le parole non
// dicono. Quindi: cinque tappe in fila, e le frecce parlano.
//
// E il confronto si DISEGNA: fra la fase 2 e la 3 cambia un arco — quello che
// oggi non c'è. È quella differenza l'argomento, non tre elenchi affiancati.
//
// Geometria in unità di viewBox (1340 × 540), a mano.

export const VIEWBOX = '0 0 1340 540';
export const H_NODO = 88;

export interface Nodo {
  id: string;
  ancora: Testo;
  x: number; y: number; w: number;
  nostro?: boolean;
  /** Il nodo che rappresenta la persona, non un sistema: si disegna diverso. */
  persona?: boolean;
  /** Non si rende in pagina: è la battuta di chi presenta. */
  voce: Testo;
}

const Y_FLUSSO = 300;
const Y_ADOBE = 96;

export const NODI: Nodo[] = [
  { id: 'cliente', persona: true, ancora: { it: 'Il cliente', en: 'The customer' },
    x: 20, y: Y_FLUSSO, w: 210,
    voce: { it: 'Da qualunque porta: filiale, app, sito. Il percorso è lo stesso.', en: 'From any door: branch, app, site. The journey is the same.' } },
  { id: 'analytics', ancora: { it: 'Adobe Analytics', en: 'Adobe Analytics' },
    x: 280, y: Y_FLUSSO, w: 210,
    voce: { it: 'Vede il digitale, in profondità e da anni. Non vede la filiale.', en: 'Sees digital, deeply and for years. Does not see the branch.' } },
  { id: 'crm', ancora: { it: 'CRM', en: 'CRM' },
    x: 540, y: Y_FLUSSO, w: 210,
    voce: { it: 'Costruisce il target coi vostri modelli. Resta vostro, e nessuno lo tocca.', en: 'Builds the target with your models. Stays yours, nobody touches it.' } },
  { id: 'mktcloud', ancora: { it: 'Marketing Cloud', en: 'Marketing Cloud' },
    x: 800, y: Y_FLUSSO, w: 210,
    voce: { it: 'Esegue il ramo deciso a monte, giorni prima del contatto.', en: 'Runs the branch decided upstream, days before contact.' } },
  { id: 'contatto', persona: true, ancora: { it: 'Il contatto', en: 'The contact' },
    x: 1110, y: Y_FLUSSO, w: 210,
    voce: { it: 'Una mail, una notifica, una chiamata. Ed è qui che si gioca tutto.', en: 'An email, a notification, a call. And this is where it is won or lost.' } },

  { id: 'cja', nostro: true, ancora: { it: 'Customer Journey Analytics', en: 'Customer Journey Analytics' },
    x: 200, y: Y_ADOBE, w: 290,
    voce: { it: 'Somma al digitale quello che succede in filiale e al telefono, sullo stesso cliente.', en: 'Adds branch and phone to digital, on the same customer.' } },
  { id: 'coworker', nostro: true, ancora: { it: 'Coworker', en: 'Coworker' },
    x: 560, y: Y_ADOBE, w: 190,
    voce: { it: 'La domanda fatta a parole, sull’istanza che avete oggi.', en: 'The question asked in plain words, on the instance you have today.' } },
  { id: 'decisioning', nostro: true, ancora: { it: 'AI Decisioning', en: 'AI Decisioning' },
    x: 935, y: Y_ADOBE, w: 250,
    voce: { it: 'Dentro il ramo, sceglie quale proposta esce adesso.', en: 'Within the branch, it picks which proposal goes out now.' } },
];

/**
 * Le frecce PARLANO: un arco senza etichetta è «collegati in qualche modo».
 * `manca` = l'arco che oggi non esiste (tratteggiato, e la fase 3 lo accende).
 */
export interface Arco {
  id: string;
  d: string;
  etichetta: Testo;
  /** Dove sta l'etichetta, in unità di viewBox. */
  lx: number; ly: number;
  nostro?: boolean;
  manca?: boolean;
}

const orizz = (x1: number, x2: number, y: number) => `M${x1} ${y} L${x2 - 10} ${y}`;
const Y_MID = Y_FLUSSO + H_NODO / 2;

export const ARCHI: Arco[] = [
  { id: 'a1', d: orizz(230, 280, Y_MID), etichetta: { it: 'il comportamento', en: 'behaviour' }, lx: 255, ly: Y_FLUSSO - 28 },
  { id: 'a2', d: orizz(490, 540, Y_MID), etichetta: { it: 'il target', en: 'the target' }, lx: 515, ly: Y_FLUSSO - 28 },
  { id: 'a3', d: orizz(750, 800, Y_MID), etichetta: { it: 'il ramo', en: 'the branch' }, lx: 775, ly: Y_FLUSSO - 28 },
  { id: 'a4', d: orizz(1010, 1110, Y_MID), etichetta: { it: 'il messaggio', en: 'the message' }, lx: 1060, ly: Y_FLUSSO - 28 },

  // L'arco che oggi NON c'è: l'esito non torna indietro per attributo.
  { id: 'ritorno', manca: true,
    d: `M1215 ${Y_FLUSSO + H_NODO} C1215 480, 385 480, 385 ${Y_FLUSSO + H_NODO}`,
    etichetta: { it: 'l’esito, per attributo', en: 'the outcome, by attribute' }, lx: 800, ly: 505 },

  // La fase 3: i tre innesti, ciascuno con quello che porta.
  { id: 'i-cja', nostro: true, d: `M345 ${Y_ADOBE + H_NODO} L345 ${Y_FLUSSO - 10}`,
    etichetta: { it: 'il dato cucito', en: 'stitched data' }, lx: 352, ly: 232 },
  { id: 'i-cow', nostro: true, d: `M655 ${Y_ADOBE + H_NODO} L655 ${Y_FLUSSO - 10}`,
    etichetta: { it: 'la domanda', en: 'the question' }, lx: 662, ly: 232 },
  { id: 'i-dec', nostro: true, d: `M1060 ${Y_ADOBE + H_NODO} L1060 ${Y_MID - 14}`,
    etichetta: { it: 'quale offerta, adesso', en: 'which offer, now' }, lx: 1067, ly: 232 },
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
    titolo: { it: 'Quello che avete oggi', en: 'What you have today' },
    didascalia: { it: 'Il percorso dal cliente al contatto, e che cosa porta ogni passaggio.', en: 'The path from customer to contact, and what each hop carries.' },
    entrano: ['cliente', 'analytics', 'crm', 'mktcloud', 'contatto', 'a1', 'a2', 'a3', 'a4'],
  },
  {
    id: 'ferma',
    titolo: { it: 'Dove si ferma', en: 'Where it stops' },
    didascalia: { it: 'L’ultimo passaggio esegue un ramo deciso giorni prima, e l’esito non torna.', en: 'The last hop runs a branch decided days earlier, and the outcome never returns.' },
    entrano: ['ritorno'],
    accesi: ['a4'],
  },
  {
    id: 'innesto',
    titolo: { it: 'Dove ci innestiamo', en: 'Where we graft on' },
    didascalia: { it: 'Tre innesti sullo stesso percorso: niente si stacca, e l’arco mancante si chiude.', en: 'Three grafts on the same path: nothing is detached, and the missing arc closes.' },
    entrano: ['cja', 'coworker', 'decisioning', 'i-cja', 'i-cow', 'i-dec'],
    accesi: ['ritorno'],
  },
];
