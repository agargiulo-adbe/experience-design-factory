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

/**
 * La pila come la vuole `IsuStack`.
 *
 * I LINK CI SONO IN ENTRAMBI I PERCORSI, e cambiano solo bersaglio: nel
 * percorso intero l'approfondimento è una slide della stessa pagina (ancora
 * locale, salto immediato); nel taglio da dieci minuti quelle slide non
 * esistono, quindi la freccia porta alla pagina delle idee, sulla slide
 * giusta. Così chi presenta i dieci minuti può aprire il dettaglio solo se
 * la domanda arriva — che è esattamente il motivo per cui un taglio corto ha
 * senso: non toglie il contenuto, lo mette a un clic di distanza.
 *
 * `base` serve perché il sito vive sotto un percorso (`/experience-design-
 * factory/intesa-scala-umana/`): un href che parte da `/` finirebbe sulla
 * radice del dominio.
 */
export const strati = (taglio: 'lungo' | 'breve', base = '/') =>
  STRATI.map((l) => {
    const dove =
      !l.href ? undefined
      : taglio === 'lungo' ? l.href
      : `${base.replace(/\/?$/, '/')}idee/${l.href}`;
    return {
      kind: l.kind,
      t: l.t,
      s: taglio === 'lungo' ? l.s : l.sBreve,
      ...(dove ? { href: dove } : {}),
    };
  });

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

/* ── I tre obiettivi dichiarati ────────────────────────────────────────────
   `goal` è quello che ha detto il cliente (in grassetto la cifra), `ask` è la
   nostra lettura di che cosa chiede a chi comunica. La distinzione è dichiarata
   in pagina: una riga nostra spacciata per una loro è il modo più rapido di
   perdere credibilità in sala. `goal` contiene `<b>`, quindi va reso con
   `set:html`. */
export interface Obiettivo {
  n: string;
  goal: Bilingue;
  ask: Bilingue;
}

export const OBIETTIVI: Obiettivo[] = [
  {
    n: '01',
    goal: {
      it: '<b>2,5 milioni di clienti netti in più</b> nell’arco del Piano d’Impresa 2026-2029.',
      en: '<b>2.5 million net new customers</b> over the 2026-2029 Business Plan.',
    },
    ask: {
      it: 'Crescere di due milioni e mezzo vuol dire parlare a chi non vi conosce ancora, su canali dove la prima risposta non la date voi.',
      en: 'Growing by two and a half million means speaking to people who do not know you yet, on channels where the first answer is not yours to give.',
    },
  },
  {
    n: '02',
    goal: {
      it: '<b>100% delle applicazioni in cloud entro il 2029</b>, dal 64% di fine 2025, dentro 4,6 miliardi di nuovi investimenti IT.',
      en: '<b>100% of applications in the cloud by 2029</b>, from 64% at the end of 2025, within €4.6 billion of new IT investment.',
    },
    ask: {
      it: 'La rotta è decisa e vale anche per quello che gestisce i contenuti e i moduli: il tema non è se muoverli, è che cosa si guadagna nel farlo.',
      en: 'The route is set and it covers what runs content and forms too: the question is not whether to move them, but what you gain by doing it.',
    },
  },
  {
    n: '03',
    goal: {
      it: '<b>20 miliardi alle piccole imprese</b> di commercio, artigianato e turismo, annunciati dalla Banca dei Territori l’8 ottobre 2026.',
      en: '<b>€20 billion for small businesses</b> in retail, crafts and tourism, announced by the Banca dei Territori on 8 October 2026.',
    },
    ask: {
      it: 'Un impegno di questa portata si racconta a centinaia di migliaia di imprese diverse fra loro, e ognuna vuole sentirsi parlare della propria.',
      en: 'A commitment this size has to be told to hundreds of thousands of very different businesses, each wanting to hear about its own.',
    },
  },
];

/** La nota che distingue la loro parola dalla nostra lettura. */
export const NOTA_OBIETTIVI: Bilingue = {
  it: 'In grande gli obiettivi, come li avete dichiarati voi. In piccolo che cosa chiedono a chi comunica: quella riga è una nostra lettura, non una vostra parola.',
  en: 'In large type, the goals as you stated them. In small type, what they ask of whoever communicates: that line is our reading, not your words.',
};

/* ── La domanda che chiude il primo capitolo ───────────────────────────────
   Sta sui numeri, in entrambi i percorsi. È la riga che trasforma «il vostro
   anno visto da fuori» da verbale a domanda: senza, la slide afferma al
   cliente come stanno le sue cose. */
export const DOMANDA_LETTURA: Bilingue = {
  it: 'Questa lettura regge, vista da dentro?',
  en: 'Does this reading hold, seen from the inside?',
};

/* ── L'ask ─────────────────────────────────────────────────────────────────
   Una frase sola, in un posto solo: è la cosa che il cliente si porta via, e
   due versioni diverse della richiesta sono il modo più rapido di sembrare
   confusi. */
export const ASK: Bilingue = {
  it: 'Un tavolo in due: voi un referente, due casi e una data. Noi le persone, la piattaforma e la risposta scritta.',
  en: 'A table for two: you bring a contact, two cases and a date. We bring the people, the platform and the written answer.',
};
