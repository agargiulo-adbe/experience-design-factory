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
export const CIFRE: Array<{ n: string; l: Testo }> = [
  { n: '95%', l: { it: 'dei prodotti già disponibili in digitale', en: 'of products already available digitally' } },
  { n: '~70%', l: { it: 'dei percorsi cliente già omnicanale', en: 'of customer journeys already omnichannel' } },
  { n: '64%', l: { it: 'dell’infrastruttura già in cloud', en: 'of the infrastructure already in the cloud' } },
  { n: '~150', l: { it: 'casi d’uso di AI dichiarati in produzione', en: 'AI use cases declared in production' } },
];

// ── L'architettura: un DIAGRAMMA, non una tabella ──────────────────────────
// Regola, e stavolta applicata: sullo schermo vanno ANCORE, non frasi. Ogni
// nodo porta un nome (≤ 5 parole) e basta. Le note qui sotto NON si rendono:
// sono quello che dice chi presenta, e stanno qui perché non si perdano.
//
// Geometria in unità di viewBox (1240 × 560), a mano: il layout automatico
// arriva col blocco `Blueprint` del motore. Gli strati si impilano verso
// l'ALTO, così «si appoggia sopra» è letterale invece che detto.

export interface Nodo {
  id: string;
  ancora: Testo;
  x: number; y: number; w: number;
  /** true = strato Adobe. Il default è del cliente: il suo patrimonio viene prima. */
  nostro?: boolean;
  /** Il vuoto: tratteggiato, perché è un'assenza e non un prodotto. */
  vuoto?: boolean;
  /** Non si rende MAI in pagina: è la battuta di chi presenta. */
  voce: Testo;
}

export const H_NODO = 96;
export const VIEWBOX = '0 0 1240 560';

export const NODI: Nodo[] = [
  // Strato 1 — il loro dato (in basso)
  { id: 'analytics', ancora: { it: 'Adobe Analytics', en: 'Adobe Analytics' }, x: 200, y: 392, w: 300,
    voce: { it: 'Il comportamento digitale, tracciato in profondità e da anni.', en: 'Digital behaviour, tracked in depth for years.' } },
  { id: 'crm', ancora: { it: 'CRM', en: 'CRM' }, x: 560, y: 392, w: 300,
    voce: { it: 'Anagrafica, modelli di propensione, audience. Resta vostro.', en: 'Customer base, propensity models, audiences. Stays yours.' } },
  { id: 'aem', ancora: { it: 'Experience Manager', en: 'Experience Manager' }, x: 920, y: 392, w: 300,
    voce: { it: 'Web e form, oggi installato in casa.', en: 'Web and forms, today on premise.' } },

  // Strato 2 — l'esecuzione, e il buco
  { id: 'mktcloud', ancora: { it: 'Marketing Cloud', en: 'Marketing Cloud' }, x: 200, y: 216, w: 300,
    voce: { it: 'Esegue il percorso deciso a monte: chi entra nel ramo riceve quel messaggio.', en: 'Runs the journey decided upstream: whoever enters the branch gets that message.' } },
  { id: 'vuoto', ancora: { it: 'Qui manca la scelta', en: 'The choice is missing here' }, x: 560, y: 216, w: 660, vuoto: true,
    voce: { it: 'Che cosa esce adesso, per questa persona, su questo canale. Oggi non c’è il posto dove deciderlo.', en: 'What goes out now, for this person, on this channel. Today there is no place to decide it.' } },

  // Strato 3 — il nostro innesto (in cima)
  { id: 'cja', ancora: { it: 'Customer Journey Analytics', en: 'Customer Journey Analytics' }, x: 200, y: 40, w: 300, nostro: true,
    voce: { it: 'Cuce digitale e offline sullo stesso cliente.', en: 'Stitches digital and offline onto the same customer.' } },
  { id: 'decisioning', ancora: { it: 'AI Decisioning', en: 'AI Decisioning' }, x: 560, y: 40, w: 300, nostro: true,
    voce: { it: 'Sceglie quale proposta esce adesso, dentro il ramo che avete già deciso.', en: 'Picks which proposal goes out now, inside the branch you already decided.' } },
  { id: 'coworker', ancora: { it: 'Coworker', en: 'Coworker' }, x: 920, y: 40, w: 300, nostro: true,
    voce: { it: 'La domanda fatta a parole, sull’Analytics che avete oggi.', en: 'The question asked in plain words, on the Analytics you have today.' } },
];

/** I collegamenti verticali fra gli strati. `su` = sale verso il nostro strato. */
export const LEGAMI: Array<{ id: string; x: number; da: number; a: number; su?: boolean }> = [
  { id: 'l1-350', x: 350, da: 392, a: 312 },
  { id: 'l1-710', x: 710, da: 392, a: 312 },
  { id: 'l1-1070', x: 1070, da: 392, a: 312 },
  { id: 'l2-350', x: 350, da: 216, a: 136, su: true },
  { id: 'l2-710', x: 710, da: 216, a: 136, su: true },
  { id: 'l2-1070', x: 1070, da: 216, a: 136, su: true },
];

export interface Fase {
  id: string;
  titolo: Testo;
  /** Gli id che COMPAIONO in questa fase. Lo stato è cumulativo. */
  entrano: string[];
  /** Attenuati, mai rimossi: un nodo del cliente non sparisce. */
  spenti?: string[];
}

export const FASI: Fase[] = [
  {
    id: 'oggi',
    titolo: { it: 'Quello che avete oggi', en: 'What you have today' },
    entrano: ['analytics', 'crm', 'aem', 'l1-350', 'l1-710', 'l1-1070', 'mktcloud'],
  },
  {
    id: 'ferma',
    titolo: { it: 'Dove si ferma', en: 'Where it stops' },
    entrano: ['vuoto'],
  },
  {
    id: 'innesto',
    titolo: { it: 'Dove ci innestiamo', en: 'Where we graft on' },
    entrano: ['cja', 'decisioning', 'coworker', 'l2-350', 'l2-710', 'l2-1070'],
  },
];
