/**
 * LA FONTE UNICA dei contenuti che vivono in due posti: il percorso intero e
 * il taglio «In dieci minuti».
 *
 * PERCHÉ ESISTE QUESTO FILE. Prima i due percorsi tenevano due copie a mano
 * degli stessi tre blocchi, con la raccomandazione scritta nei commenti che
 * «se divergono, è il lungo che comanda». Non ha funzionato: una correzione
 * al percorso lungo (il titolo di uno strato, la base della pila che diceva
 * una cosa falsa su Analytics) è rimasta fuori dal taglio exec, ed è uscita
 * solo guardando lo screenshot. Una regola che si affida alla memoria di chi
 * modifica non è una regola, è una speranza.
 *
 * COME FUNZIONA. Qui ogni voce è definita UNA volta, bilingue. Dove il taglio
 * da dieci minuti ha bisogno di una riga più corta, la versione corta è un
 * campo accanto a quella lunga (`sBreve`, `bBreve`), non un'altra voce: i
 * titoli, i numeri, l'ordine e le etichette restano fisicamente gli stessi
 * oggetti. Così si può accorciare una descrizione senza poter cambiare, per
 * distrazione, che cosa dice la slide.
 *
 * REGOLA: nessuna delle due pagine riscrive a mano quello che sta qui. Se
 * serve una variante, si aggiunge un campo in questo file.
 */

export interface Bilingue {
  it: string;
  en: string;
}

/* ── I numeri del cliente su sé stesso ─────────────────────────────────────
   `l` è l'etichetta, `s` il complemento. Il percorso lungo li mostra su due
   righe sotto l'anello; il taglio exec li unisce in una riga sola. Nessuno
   dei due riscrive il testo. */
export interface Numero {
  /** Riempimento dell'anello, 0-100. */
  v: number;
  /** Il numero come si legge (può non coincidere con `v`: «~150» su 100). */
  label: string;
  l: Bilingue;
  s: Bilingue;
}

export const NUMERI: Numero[] = [
  {
    v: 95,
    label: '95%',
    l: { it: 'dei prodotti per i privati', en: 'of retail products' },
    s: { it: 'è già gestibile digitalmente', en: 'can already be handled digitally' },
  },
  {
    v: 70,
    label: '~70%',
    l: { it: 'dei customer journey', en: 'of customer journeys' },
    s: { it: 'è già omnicanale', en: 'are already omnichannel' },
  },
  {
    v: 64,
    label: '64%',
    l: { it: 'applicazioni in cloud', en: 'applications in the cloud' },
    s: { it: 'a fine 2025, verso il 100% nel 2029', en: 'at end-2025, heading to 100% in 2029' },
  },
  {
    v: 100,
    label: '~150',
    l: { it: 'use case di AI', en: 'AI use cases' },
    s: { it: 'già in produzione', en: 'already in production' },
  },
];

/** Etichetta e complemento su una riga sola, per il taglio da dieci minuti. */
export const numeroInRiga = (n: Numero): Bilingue => ({
  it: `${n.l.it} ${n.s.it}`,
  en: `${n.l.en} ${n.s.en}`,
});

/* ── La pila dell'innesto ──────────────────────────────────────────────────
   L'array va DAL BASSO: la fondazione per prima, il componente impila al
   contrario. `href` porta alla slide che racconta lo strato per esteso e vale
   solo nel percorso lungo: nel taglio exec quelle slide non ci sono, quindi
   un link lì porterebbe fuori strada. */
export interface Strato {
  kind: 'base' | 'add';
  t: Bilingue;
  /** La riga sotto il titolo, nel percorso lungo. */
  s: Bilingue;
  /** La stessa riga, accorciata per il taglio exec. */
  sBreve: Bilingue;
  /** Ancora alla slide di dettaglio. Solo percorso lungo. */
  href?: string;
}

export const STRATI: Strato[] = [
  {
    kind: 'base',
    t: { it: 'Quello che avete già', en: 'What you already have' },
    s: {
      it: 'Analytics, già in uso e già in cloud · Experience Manager e Forms, oggi dentro la banca',
      en: 'Analytics, already in use and already in the cloud · Experience Manager and Forms, today inside the bank',
    },
    sBreve: {
      it: 'Analytics, già in uso e già in cloud · Experience Manager e Forms, dentro la banca',
      en: 'Analytics, already in use and in the cloud · Experience Manager and Forms, inside the bank',
    },
  },
  {
    kind: 'add',
    t: { it: 'Una persona sola, non cinque conteggi', en: 'One person, not five separate counts' },
    s: {
      it: 'Dal contare le visite su un canale al seguire la stessa persona dal primo annuncio alla firma: da lì in poi si misura dove si perde, e quanto ha pesato ogni passaggio',
      en: 'From counting visits on one channel to following the same person from the first ad to signature: from there you can measure where it breaks, and what each step was worth',
    },
    sBreve: {
      it: 'Seguire la stessa persona dal primo annuncio alla firma, e misurare dove si perde',
      en: 'Following the same person from the first ad to signature, and measuring where it breaks',
    },
    href: '#slide-viaggio',
  },
  {
    kind: 'add',
    t: { it: 'Decidere che cosa arriva, a chi', en: 'Deciding what reaches whom' },
    s: {
      it: 'Un solo arbitro davanti al cliente: prende i punteggi dai modelli che avete già e sceglie cosa esce, su che canale e quanto spesso, senza rifare nulla di quello che c’è',
      en: 'One arbiter in front of the customer: it takes the scores from the models you already have and picks what goes out, on which channel and how often, without redoing any of it',
    },
    sBreve: {
      it: 'Un solo arbitro davanti al cliente, sopra i modelli che avete già',
      en: 'One arbiter in front of the customer, on top of the models you already have',
    },
    href: '#slide-decisioning',
  },
  {
    kind: 'add',
    t: { it: 'Produrre contenuto alla scala della banca', en: 'Producing content at the scale of the bank' },
    s: {
      it: 'Centinaia di offerte e decine di mercati senza moltiplicare le mani che le scrivono, con le parti obbligatorie che restano intatte e una persona che approva',
      en: 'Hundreds of offers and dozens of markets without multiplying the hands that write them, with mandatory wording left intact and a person who approves',
    },
    sBreve: {
      it: 'Centinaia di offerte senza moltiplicare le mani, con le parti obbligatorie intatte',
      en: 'Hundreds of offers without multiplying the hands, with mandatory wording intact',
    },
    href: '#slide-filiera',
  },
];

/** La pila come la vuole `IsuStack`: lunga con i link, breve senza. */
export const strati = (taglio: 'lungo' | 'breve') =>
  STRATI.map((l) => ({
    kind: l.kind,
    t: l.t,
    s: taglio === 'lungo' ? l.s : l.sBreve,
    ...(taglio === 'lungo' && l.href ? { href: l.href } : {}),
  }));

/* ── La proposta ───────────────────────────────────────────────────────────
   Tre passi. Il taglio exec usa `bBreve`, che è la stessa frase senza gli
   incisi: non un'altra promessa. */
export interface Passo {
  n: string;
  t: Bilingue;
  b: Bilingue;
  bBreve: Bilingue;
}

export const PASSI: Passo[] = [
  {
    n: '01',
    t: { it: 'Un tavolo di lavoro', en: 'A working session' },
    b: {
      it: 'Mezza giornata con le persone che il lavoro lo fanno: canali, contenuto, dati. Non una presentazione.',
      en: 'Half a day with the people who do the work: channels, content, data. Not a presentation.',
    },
    bBreve: {
      it: 'Mezza giornata con canali, contenuto e dati. Non una presentazione.',
      en: 'Half a day with channels, content and data. Not a presentation.',
    },
  },
  {
    n: '02',
    t: { it: 'Due casi scelti da voi', en: 'Two cases you choose' },
    b: {
      it: 'Si guardano sui vostri processi e sui vostri vincoli, non sui nostri esempi.',
      en: 'We look at them against your processes and your constraints, not our examples.',
    },
    bBreve: {
      it: 'Sui vostri processi e sui vostri vincoli.',
      en: 'On your processes and your constraints.',
    },
  },
  {
    n: '03',
    t: { it: 'Una risposta netta', en: 'A clear answer' },
    b: {
      it: 'Che cosa conviene fare, che cosa no, e in che ordine. Per iscritto, entro fine anno.',
      en: 'What is worth doing, what is not, and in what order. In writing, before the year is out.',
    },
    bBreve: {
      it: 'Che cosa conviene fare, che cosa no, in che ordine. Per iscritto, entro fine anno.',
      en: 'What is worth doing, what is not, in what order. In writing, before the year is out.',
    },
  },
];

export const passi = (taglio: 'lungo' | 'breve') =>
  PASSI.map((p) => ({ n: p.n, t: p.t, b: taglio === 'lungo' ? p.b : p.bBreve }));

/* ── L'ask ─────────────────────────────────────────────────────────────────
   Una frase sola, in un posto solo: è la cosa che il cliente si porta via, e
   due versioni diverse della richiesta sono il modo più rapido di sembrare
   confusi. */
export const ASK: Bilingue = {
  it: 'Un tavolo in due: voi un referente, due casi e una data. Noi le persone, la piattaforma e la risposta scritta.',
  en: 'A table for two: you bring a contact, two cases and a date. We bring the people, the platform and the written answer.',
};
