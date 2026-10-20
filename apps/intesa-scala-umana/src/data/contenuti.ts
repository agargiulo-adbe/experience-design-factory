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
   LA FORMA È IL MESSAGGIO. Prima ogni obiettivo era una frase intera in
   grassetto, e la slide diventava un muro: tre periodi lunghi più tre periodi
   di lettura più una nota di trentaquattro parole che spiegava la tipografia.
   Adesso la cifra fa il lavoro che faceva la frase — `cifra` si legge da
   lontano, `cosa` dice di che si tratta, `ctx` porta la precisione che la
   cifra da sola perderebbe (il punto di partenza, la data, l'ordine di
   grandezza), e `lettura` è la conseguenza per chi comunica.

   LA DISTINZIONE FRA LA LORO PAROLA E LA NOSTRA non vive più in una nota a
   piè di slide che descriveva i corpi del carattere («in grande… in
   piccolo…»): quella nota diceva una cosa vera nel posto sbagliato, e a
   telefono, dove i due corpi quasi coincidono, diventava falsa. Adesso è
   un'etichetta attaccata esattamente alla riga che qualifica. */
export interface Obiettivo {
  n: string;
  /** La cifra, come si legge. È l'elemento grafico della slide. Bilingue
      perché il separatore decimale e le abbreviazioni non sono gli stessi:
      «2,5 mln» in italiano è «2.5m» in inglese, e un numero scritto con la
      virgola in una slide inglese si legge come un errore di battitura. */
  cifra: Bilingue;
  /** Di che cosa è la cifra: quattro o cinque parole, non una frase. */
  cosa: Bilingue;
  /** Il contorno che la cifra da sola perderebbe: da dove, entro quando, chi. */
  ctx: Bilingue;
  /** La nostra lettura: che cosa chiede a chi comunica. Dichiarata come tale. */
  lettura: Bilingue;
}

export const OBIETTIVI: Obiettivo[] = [
  {
    n: '01',
    cifra: { it: '2,5 mln', en: '2.5m' },
    cosa: { it: 'clienti netti in più', en: 'net new customers' },
    ctx: {
      it: 'nell’arco del Piano d’Impresa 2026-2029',
      en: 'over the 2026-2029 Business Plan',
    },
    lettura: {
      it: 'Sono clienti che oggi non vi conoscono, e su quei canali la prima risposta su di voi non la date voi.',
      en: 'These are customers who do not know you today, and on those channels the first answer about you is not yours to give.',
    },
  },
  {
    n: '02',
    cifra: { it: '100%', en: '100%' },
    cosa: { it: 'delle applicazioni in cloud', en: 'of applications in the cloud' },
    ctx: {
      it: 'entro il 2029, dal 64% di fine 2025, dentro 4,6 miliardi di investimenti IT',
      en: 'by 2029, from 64% at end-2025, within €4.6bn of IT investment',
    },
    lettura: {
      it: 'Dentro quel 100% ci sono anche i sistemi che gestiscono contenuti e moduli: la scelta su di loro si fa in questa finestra, non dopo.',
      en: 'Inside that 100% sit the systems that run content and forms: the choice about them is made in this window, not after.',
    },
  },
  {
    n: '03',
    cifra: { it: '20 mld', en: '€20bn' },
    cosa: {
      it: 'alle piccole imprese di commercio, artigianato e turismo',
      en: 'for small firms in retail, crafts and tourism',
    },
    /* Le «circa 800.000 piccole e piccolissime aziende clienti della Divisione»
       stanno nello stesso comunicato dell'8 ottobre: è un fatto loro, quindi
       sta qui e non nella riga di lettura. */
    ctx: {
      it: 'annunciati l’8 ottobre 2026 · circa 800.000 sono già clienti della Divisione',
      en: 'announced 8 October 2026 · around 800,000 are already Division customers',
    },
    lettura: {
      it: 'Ognuna vuole sentirsi parlare della propria attività, non di un piano per tutte.',
      en: 'Each one wants to hear about its own business, not about a plan for everyone.',
    },
  },
];

/** L'etichetta che dichiara la riga di lettura per quella che è. */
export const LETTURA_NOSTRA: Bilingue = {
  it: 'La nostra lettura',
  en: 'Our reading',
};

/**
 * La stessa cosa dei tre OBIETTIVI, detta in una riga: serve al taglio «In dieci
 * minuti», dove le tre carte non entrano. Sta QUI e non nella pagina perché i numeri
 * sono gli stessi di sopra — se uno cambia, deve cambiare in un posto solo.
 */
/* «Tutti e tre passano da quello che il cliente legge» era falso sul secondo,
   ed è il genere di falso che un CIO smonta in due secondi — dopodiché non
   crede più nemmeno agli altri due. Il 100% in cloud è un obiettivo di
   infrastruttura: non passa da quello che il cliente legge, passa da dove
   girano i sistemi. La simmetria era forzata (il tricolon che la rubrica
   de-AI chiama «bullet sovra-paralleli»): tre fatti diversi costretti nella
   stessa conclusione.
   La versione vera è anche l'argomento più forte, perché porta una scadenza
   invece di una generalità: due obiettivi passano dal contenuto, il terzo
   decide QUANDO si sceglie il sistema che quel contenuto lo produce. È la
   stessa cosa che dice la riga di lettura della seconda carta. */
export const SINTESI_OBIETTIVI: Bilingue = {
  it: 'Gli obiettivi dichiarati sono tre: 2,5 milioni di clienti netti in più, il 100% delle applicazioni in cloud entro il 2029, i 20 miliardi alle piccole imprese. Due passano da quello che il cliente legge. Il terzo decide quando si sceglie il sistema che lo produce.',
  en: 'Three stated goals: 2.5 million net new customers, 100% of applications in the cloud by 2029, €20 billion for small businesses. Two of them run through what the customer reads. The third decides when the system that produces it gets chosen.',
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
