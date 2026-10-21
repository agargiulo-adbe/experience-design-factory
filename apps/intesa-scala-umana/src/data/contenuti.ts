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
      it: 'Da fuori risultano Analytics in uso, e Experience Manager e Forms dentro il Gruppo. Perimetro e versioni li verifichiamo con chi li governa',
      en: 'From outside we see Analytics in use, and Experience Manager and Forms inside the Group. Perimeter and versions we check with whoever governs them',
    },
    sBreve: {
      it: 'Da fuori risultano Analytics in uso, Experience Manager e Forms dentro il Gruppo',
      en: 'From outside we see Analytics in use, Experience Manager and Forms inside the Group',
    },
  },
  {
    kind: 'add',
    t: { it: 'Una persona sola, non cinque conteggi', en: 'One person, not five separate counts' },
    s: {
      it: 'Si passa dal contare le visite su un canale al seguire la stessa persona dal primo annuncio alla firma. Da lì si misura dove si perde, e quanto ha pesato ogni passaggio',
      en: 'You move from counting visits on one channel to following the same person from the first ad to signature. From there you measure where it breaks, and what each step was worth',
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
      it: 'Un solo arbitro davanti al cliente: prende i punteggi dai modelli che avete già e sceglie che cosa esce, su che canale e quanto spesso. I modelli restano dove sono. Cambia il punto di uscita: ogni canale che oggi decide da sé va ricollegato, uno alla volta',
      en: 'One arbiter in front of the customer: it takes the scores from the models you already have and picks what goes out, on which channel and how often. The models stay where they are. What changes is the point of exit: every channel that decides on its own today gets reconnected, one at a time',
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
      it: 'Si comincia dalle risposte che gli assistenti danno su di voi, non dalle immagini. Poi centinaia di offerte senza moltiplicare le mani che le scrivono, con le parti obbligatorie intatte e una persona che approva',
      en: 'It starts with the answers assistants give about you, not with images. Then hundreds of offers without multiplying the hands that write them, mandatory wording intact and a person who approves',
    },
    sBreve: {
      it: 'Dalle risposte degli assistenti alle centinaia di offerte, senza moltiplicare le mani che le scrivono',
      en: 'From the answers assistants give to hundreds of offers, without multiplying the hands that write them',
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
      it: 'Mezza giornata con chi fa contenuto e campagne. Non una presentazione.',
      en: 'Half a day with the people who do content and campaigns. Not a presentation.',
    },
    bBreve: {
      it: 'Mezza giornata con chi fa contenuto e campagne. Non una presentazione.',
      en: 'Half a day with the people who do content and campaigns. Not a presentation.',
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
      it: 'nell’arco del Piano d’Impresa 2026-2029 · principalmente via isybank e banche estere, dice il piano',
      en: 'over the 2026-2029 Business Plan · mainly through isybank and the International Banks, the plan says',
    },
    lettura: {
      it: 'Il numero cresce soprattutto altrove. Che cosa chiede alla Divisione, una crescita che passa da lì?',
      en: 'The number grows mostly elsewhere. What does growth that runs through there ask of the Division?',
    },
  },
  /* ORDINE. Il cloud stava qui e adesso sta in terza. Non è un gusto: dei tre
     obiettivi, due si giocano su quello che il cliente legge e il cloud no —
     è il più lontano dalla conversazione e il più vicino a un'altra direzione
     aziendale. I 20 miliardi invece sono la notizia più fresca (8 ottobre) e
     sono l'obiettivo che si attacca direttamente al contenuto: 800.000 imprese
     a cui parlare una per una. Un deck mette al secondo posto la cosa che
     vuole far discutere, non quella che gli capita in ordine di importanza
     altrui. */
  {
    n: '02',
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
  {
    n: '03',
    cifra: { it: '100%', en: '100%' },
    cosa: { it: 'delle applicazioni in cloud', en: 'of applications in the cloud' },
    ctx: {
      it: 'entro il 2029, dal 64% di fine 2025, dentro 4,6 miliardi di investimenti IT',
      en: 'by 2029, from 64% at end-2025, within €4.6bn of IT investment',
    },
    lettura: {
      it: 'Dentro quel 100% ci sono anche i sistemi che gestiscono contenuti e moduli. Se si spostano, cambia il tempo con cui una campagna va in aria.',
      en: 'Inside that 100% sit the systems that run content and forms. If they move, the time it takes a campaign to go live changes.',
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
/* QUI STAVA `SINTESI_OBIETTIVI`, e non torna.
   Diceva «tutti e tre passano da quello che il cliente legge», che era falso
   sul cloud — un tricolon forzato, il genere di simmetria che un CIO smonta in
   due secondi. Corretta il 20 ott, e poi tolta del tutto lo stesso giorno per
   una ragione più semplice: stava sulla slide SUBITO DOPO le tre carte e le
   ripeteva in prosa senza aggiungere niente. Se serve ridire gli obiettivi,
   il posto è la carta, non un paragrafo. */


/* ── L'aggancio ───────────────────────────────────────────────────────────
   «Non c'è un'agenda col cliente?», «qual è il link?», «devo capire com'è il
   nesso»: tre volte la stessa domanda, in revisione il 20 ott 2026, e nessuna
   risposta in pagina. Un'agenda standard però sarebbe un passo indietro — la
   copertina dice già che cosa ricevono, e un sommario in testa toglie proprio
   l'effetto «vi abbiamo guardati da fuori» su cui regge il primo capitolo.
   Quello che mancava non è l'indice: è PERCHÉ siamo a quel tavolo. Una riga.
   Dice l'aggancio e non dichiara di sapere che cosa stanno valutando: quello,
   se serve, lo dice a voce chi lo può garantire. */
export const AGGANCIO: Bilingue = {
  it: 'Siamo a questo tavolo con Accenture. Prima di proporre qualcosa, questo è come vi vediamo da fuori.',
  en: 'We are at this table with Accenture. Before proposing anything, this is how we see you from outside.',
};

/* ── Il titolo della slide ─────────────────────────────────────────────────
   Era «Tre obiettivi del vostro piano». Non reggeva: i 20 miliardi alle
   piccole imprese NON sono un obiettivo del Piano d'Impresa 2026-2029, sono
   un piano commerciale annunciato otto mesi dopo, l'8 ottobre, dalla
   Divisione. Il titolo metteva sotto un'unica etichetta due documenti di
   natura diversa — e la riga piccola della carta, che dice il vero, lo
   contraddiceva. In una stanza dove due persone conoscono quel piano meglio
   di chi presenta, era l'unico punto del primo capitolo che invitava a
   essere contraddetti sul merito. */
export const TITOLO_OBIETTIVI: Bilingue = {
  it: 'Tre cose che avete dichiarato quest’anno',
  en: 'Three things you stated this year',
};

/* ── La domanda sugli obiettivi ────────────────────────────────────────────
   «Gli obiettivi ce li facciamo raccontare da loro» è la regia giusta: una
   slide che ELENCA gli obiettivi di chi ascolta è una lezione, la stessa slide
   che CHIEDE è un'apertura. La riga costa sei parole e cambia che cosa succede
   nei primi due minuti. Vive qui perché la portano tutte e due le versioni del
   percorso. */
export const DOMANDA_OBIETTIVI: Bilingue = {
  it: 'Sono questi i tre che contano, o ne manca uno?',
  en: 'Are these the three that matter, or is one missing?',
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
  it: 'Un tavolo in due tempi. Prima mezza giornata con contenuto e campagne, che convocate voi. Accanto, per iscritto, che cosa ci serve da dati e da targeting e per quante ore.',
  en: 'A table in two steps. First a half-day with content and campaigns, which you convene. Alongside it, in writing, what we need from data and targeting and for how many hours.',
};
