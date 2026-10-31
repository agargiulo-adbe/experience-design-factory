/**
 * L’ECOSISTEMA CRM DI BPER, E I DUE BLOCCHI CHE CAMBIANO.
 *
 * FONTE: lo schema «Architettura Ecosistema CRM» che il referente IT ha
 * condiviso il 26 ottobre 2026 (screenshot in `docs/BPER/`). Non è una nostra
 * ricostruzione né una deduzione dal sito: è il loro disegno, e per questo la
 * slide può dire «questo è quello che avete» senza il condizionale.
 *
 * ⚠️ QUELLO CHE LO SCHEMA DICE, E QUELLO CHE NON DICE. Lo schema nomina
 * «CDP ORACLE» come un blocco. Non dice se sia un data warehouse interrogabile
 * o una CDP applicativa, e la differenza decide se la federazione del dato è
 * possibile come la raccontiamo: è la prima delle domande aperte del capitolo
 * «Il dato resta dov’è», e non si risolve indovinando.
 *
 * I TRE VERSI, e il colore li distingue senza leggenda:
 *   resta  — roba loro, non la tocchiamo
 *   esce   — i due blocchi che Adobe sostituisce
 *   entra  — quello che prende il loro posto
 */
export type Verso = 'resta' | 'esce' | 'entra' | 'ingara';

export interface Blocco {
  k: { it: string; en: string };
  d: { it: string; en: string };
  verso: Verso;
  /** Il nome del prodotto: presente, ma non è il titolo del blocco. */
  pro?: string;
}

/** La fascia alta: il dato, che resta loro. */
export const DATO: Blocco[] = [
  {
    k: { it: 'BPER Data Platform', en: 'BPER Data Platform' },
    d: { it: 'La piattaforma dati di gruppo, dove confluisce quello che i sistemi producono', en: 'The group data platform, where what the systems produce converges' },
    verso: 'resta',
  },
  {
    k: { it: 'CDP Oracle', en: 'Oracle CDP' },
    d: { it: 'Rinnovata fino al 2030: non la sostituisce nessuno. Come ci si collega è una domanda aperta', en: 'Renewed to 2030: nobody replaces it. How we connect is an open question' },
    verso: 'resta',
  },
  {
    /* ⚠️ Resta, e accanto si aggiunge: la reportistica di oggi non sparisce,
       ma la misura sul percorso intero è una cosa che oggi non c'è. Marcarlo
       solo «resta» faceva a pugni con la tavola dei moduli, dove la misura
       entra: l'incoerenza l'ha trovata il controllo dei fatti. */
    k: { it: 'Tableau e analisi', en: 'Tableau and analysis' },
    d: { it: 'Resta per la reportistica. La misura sul percorso intero si aggiunge accanto', en: 'Stays for reporting. Journey-wide measurement is added alongside' },
    verso: 'resta',
  },
];

/** La fascia di mezzo: dove si decide che cosa dire. È qui che si cambia. */
export const REGIA: Blocco[] = [
  {
    k: { it: 'La regia dei percorsi', en: 'Journey orchestration' },
    d: { it: 'Oggi Marketing Cloud. Cambia dove si decide, non che si possa partire da un evento', en: 'Marketing Cloud today. What changes is where the decision sits, not event triggering' },
    verso: 'esce', pro: 'Salesforce Marketing Cloud',
  },
  {
    k: { it: 'La personalizzazione', en: 'Personalisation' },
    d: { it: 'Oggi Personalization. Stessa regola su sito, app e area riservata', en: 'Personalization today. One rule across site, app and logged-in area' },
    verso: 'esce', pro: 'Salesforce Personalization',
  },
  {
    k: { it: 'L’arbitro fra le proposte', en: 'The arbiter between offers' },
    d: { it: 'A parità di cliente decide oggi l’ordine delle campagne, non una regola unica', en: 'For the same customer, campaign order decides today, not a single rule' },
    verso: 'entra', pro: 'Adobe Journey Optimizer Decisioning',
  },
];

/** La fascia bassa: il CRM e i canali, che non si toccano. */
export const CANALI: Blocco[] = [
  {
    /* ⚠️ NON «resta vostro»: è esattamente l'oggetto della gara aperta.
       Dipingerlo come stabile davanti a chi la gara la gestisce fa dubitare
       di tutta la pagina. Lo strato che proponiamo regge comunque, e il
       capitolo di apertura lo dice: è la ragione per cui questo blocco può
       essere marcato come aperto senza indebolire la proposta. */
    k: { it: 'Salesforce FSC', en: 'Salesforce FSC' },
    d: { it: 'Portafogliazione, CRM operativo, CIB, FOL. In gara: lo strato sopra regge in entrambi gli esiti', en: 'Portfolio, operational CRM, CIB, FOL. In tender: the layer above holds either way' },
    verso: 'ingara',
  },
  {
    k: { it: 'Genesys e Unblu', en: 'Genesys and Unblu' },
    d: { it: 'Telefono, videocall, cobrowsing: il canale assistito', en: 'Phone, video call, cobrowsing: the assisted channel' },
    verso: 'resta',
  },
  {
    /* ⚠️ Lo schema ne porta dieci e la riga ne elencava sei: chi conosce i
       propri canali conta, e trova il buco. O si elencano tutti, o si dice
       quanti sono quelli nominati. Qui si elencano tutti e dieci. */
    k: { it: 'I dieci canali digitali', en: 'The ten digital channels' },
    d: { it: 'Internet e mobile banking, mail, sms, push, banner, chat, videochiamata, coapping, navigazione condivisa', en: 'Internet and mobile banking, mail, SMS, push, banner, chat, video call, co-apping, co-browsing' },
    verso: 'resta',
  },
];

/** Che cosa prende il posto di che cosa — la tavola del capitolo 03. */
export interface Scambio {
  oggi: { it: string; en: string };
  poi: { it: string; en: string };
  pro: string;
  /** Che cosa cambia davvero, in una riga. */
  d: { it: string; en: string };
  /** ⚠️ LA VERSIONE BREVE È UN CAMPO ACCANTO, NON UN'ALTRA VOCE.
      Il taglio da dieci minuti ha bisogno di meno parole, non di un altro
      contenuto: titoli, prodotti e ordine restano fisicamente lo stesso
      oggetto. Due copie a mano degli stessi blocchi divergono sempre, e
      diverge il taglio corto, perché le correzioni arrivano sul lungo. */
  dBreve: { it: string; en: string };
}

export const SCAMBI: Scambio[] = [
  {
    oggi: { it: 'Salesforce Marketing Cloud', en: 'Salesforce Marketing Cloud' },
    poi: { it: 'La regia dei percorsi', en: 'Journey orchestration' },
    pro: 'Adobe Journey Optimizer',
    d: {
      it: 'Il percorso parte da un evento e si corregge mentre gira, invece di essere una campagna costruita e lanciata.',
      en: 'The journey starts from an event and corrects itself as it runs, instead of being a campaign built and launched.',
    },
    dBreve: {
      it: 'Parte da un evento e si corregge mentre gira.',
      en: 'Starts from an event and corrects itself as it runs.',
    },
  },
  {
    oggi: { it: 'Salesforce Personalization', en: 'Salesforce Personalization' },
    poi: { it: 'La personalizzazione dei canali', en: 'Channel personalisation' },
    pro: 'Adobe Target',
    d: {
      it: 'Target porta l’esperienza e la prova; l’offerta da proporre la sceglie l’arbitro. Due mestieri, non uno.',
      en: 'Target carries the experience and the test; which offer to show is the arbiter’s job. Two roles, not one.',
    },
    dBreve: {
      it: 'L’esperienza e la prova; l’offerta la sceglie l’arbitro.',
      en: 'The experience and the test; the offer is the arbiter’s call.',
    },
  },
  {
    oggi: { it: 'Oggi frammentato fra le campagne', en: 'Today split across campaigns' },
    poi: { it: 'L’arbitro fra le proposte', en: 'The arbiter between offers' },
    pro: 'Adobe Journey Optimizer Decisioning',
    d: {
      it: 'Per lo stesso cliente arrivano quattro proposte, e a sceglierle è una regola invece dell’ordine in cui sono nate.',
      en: 'Four offers compete for the same customer, and a rule picks the winner instead of the order they were built in.',
    },
    dBreve: {
      it: 'Quattro proposte, e sceglie una regola invece dell’ordine.',
      en: 'Four offers, and a rule chooses instead of the order.',
    },
  },
  {
    oggi: { it: 'La misura, per canale', en: 'Measurement, channel by channel' },
    poi: { it: 'La misura, sul percorso intero', en: 'Measurement, across the whole journey' },
    pro: 'Customer Journey Analytics',
    d: {
      it: 'Lo stesso cliente su filiale, app e sito in un conteggio solo. Gli eventi di comportamento entrano in piattaforma: quelli sì si spostano.',
      en: 'The same customer across branch, app and site in one count. Behavioural events do enter the platform: those do move.',
    },
    dBreve: {
      it: 'Filiale, app e sito in un conteggio solo. Gli eventi entrano in piattaforma.',
      en: 'Branch, app and site in one count. Events do enter the platform.',
    },
  },
];

/* ══════════════════════════════════════════════════════════════════════
   CHE COSA ENTRA IN PIATTAFORMA, E CHE COSA NO.
   ⚠️ Nasce da una correzione, e la correzione vale più della slide.
   Il capitolo diceva «il dato resta dov'è» e in un punto affermava che
   anche la misura funziona senza spostare niente. È falso, e la
   documentazione è esplicita: i dati che si usano in Customer Journey
   Analytics sono ingeriti in Experience Platform. Davanti all'architetto
   dei dati di una banca quella riga non sopravvive dieci secondi, e si
   porta dietro la credibilità di tutto il resto.
   La distinzione vera è fra DUE cose diverse, e adesso sta in slide:
   le audience si compongono federate sugli attributi; gli eventi di
   comportamento, che servono alla misura e alla decisione in tempo
   reale, entrano. ══════════════════════════════════════════════════ */
export interface Voce { k: { it: string; en: string }; d: { it: string; en: string } }

export const ENTRA: Voce[] = [
  { k: { it: 'La chiave con cui vi riconoscete', en: 'The key you recognise people by' },
    d: { it: 'Un identificativo per canale e la mappa che li lega: senza, «stesso cliente» non esiste', en: 'One identifier per channel and the map that links them: without it, «same customer» does not exist' } },
  { k: { it: 'Gli eventi di comportamento', en: 'Behavioural events' },
    d: { it: 'Le interazioni su sito, app e canali: servono alla misura e alla decisione in sessione', en: 'Interactions on site, app and channels: needed for measurement and in-session decisions' } },
  { k: { it: 'I recapiti e i consensi', en: 'Contact details and consents' },
    d: { it: 'Quello che serve a spedire, e il permesso di farlo', en: 'What it takes to send, and the permission to do it' } },
];

export const RESTA: Voce[] = [
  { k: { it: 'L’anagrafica estesa', en: 'The extended customer record' },
    d: { it: 'Resta nei vostri sistemi: non serve a decidere un messaggio', en: 'Stays in your systems: it is not needed to decide a message' } },
  { k: { it: 'I rapporti e i saldi', en: 'Accounts and balances' },
    d: { it: 'Restano dove sono. Si interrogano per comporre un’audience, non si copiano', en: 'Stay where they are. Queried to compose an audience, never copied' } },
  { k: { it: 'Gli attributi della vostra profilazione', en: 'Your profiling attributes' },
    d: { it: 'Score e segmenti restano nel magazzino e si leggono da lì', en: 'Scores and segments stay in the warehouse and are read from there' } },
];

/* ══════════════════════════════════════════════════════════════════════
   LA SETTIMANA DI CHI FA CAMPAGNE, OGGI E DOPO.
   ⚠️ Nasce da un buco: tre capitoli di fila parlavano di blocchi, innesti
   e driver, e non c'era una riga sulla giornata di chi le campagne le fa.
   Chi legge il documento inoltrato — e il business lo legge sempre, anche
   quando non è in sala — concludeva che avevamo parlato solo con
   l'informatica. È anche la sezione dove il documento smette di essere
   un'architettura e diventa una promessa verificabile: ogni riga ha un
   prima e un dopo che si misurano.
   ══════════════════════════════════════════════════════════════════════ */
export interface Passo { k: { it: string; en: string }; oggi: { it: string; en: string }; poi: { it: string; en: string } }

export const SETTIMANA: Passo[] = [
  { k: { it: 'La lista', en: 'The list' },
    oggi: { it: 'Si chiede, si aspetta, arriva quando arriva', en: 'You ask, you wait, it arrives when it arrives' },
    poi: { it: 'La regola si scrive una volta e il percorso parte da sé. La campagna a lista resta possibile', en: 'The rule is written once and the journey starts on its own. List campaigns still work' } },
  { k: { it: 'Il controllo prima dell’invio', en: 'The pre-send check' },
    oggi: { it: 'Si guarda la lista prima di premere', en: 'You look at the list before pressing send' },
    poi: { it: 'Si guarda la regola e un campione, e si può fermare tutto a percorso avviato', en: 'You check the rule and a sample, and can stop everything mid-journey' } },
  { k: { it: 'Chi scrive le regole', en: 'Who writes the rules' },
    oggi: { it: 'Chi costruisce la campagna, una alla volta', en: 'Whoever builds the campaign, one at a time' },
    poi: { it: 'Le scrivete voi, una volta, e valgono per tutte', en: 'You write them once, and they hold for all' } },
];

/** I tre indicatori con cui si misura se è andata meglio. Si dichiarano
 *  prima, e si misurano nella prima fase: senza, non esiste un confronto. */
export const MISURE: Passo[] = [
  { k: { it: 'Dal brief all’invio', en: 'From brief to send' },
    oggi: { it: 'Il tempo che passa oggi', en: 'The time it takes today' },
    poi: { it: 'Lo stesso tempo, dopo', en: 'The same time, after' } },
  { k: { it: 'Risposta sul percorso scelto', en: 'Response on the chosen journey' },
    oggi: { it: 'La resa della campagna di oggi', en: "Today’s campaign performance" },
    poi: { it: 'La resa con la decisione', en: 'Performance with the decision' } },
  { k: { it: 'Disiscrizioni a parità di contatti', en: 'Opt-outs at equal contact volume' },
    oggi: { it: 'Quante se ne perdono oggi', en: 'How many you lose today' },
    poi: { it: 'Quante dopo, con il tetto applicato', en: 'How many after, with the cap applied' } },
];

/* ══════════════════════════════════════════════════════════════════════
   LA REFERENZA CHE SI PUÒ NOMINARE.
   ⚠️ Il capitolo sulle referenze diceva «nessun nome in questa pagina» e
   spiegava bene il perché per i casi non verificati. Il controllo dei
   fatti ha però trovato che una banca c'è, ed è pubblicata da Adobe sugli
   stessi moduli che proponiamo qui: dichiarare prudenza anche dove la
   prudenza non serve regala l'unica referenza che abbiamo.
   I numeri sono quelli della storia pubblicata, non nostri. Non porta il
   link perché l'indirizzo esatto della pagina non è stato confermato: si
   cita per che cos'è, e il link si aggiunge quando si apre la pagina. */
export const TSB = {
  nome: 'TSB Bank',
  moduli: 'Journey Optimizer, Real-Time CDP e Customer Journey Analytics',
  fatti: [
    { it: 'Oltre 300.000 clienti senza addebito automatico sulla carta, a rischio di mora', en: 'Over 300,000 customers with no direct debit on their card, at risk of late fees' },
    { it: 'Più di 3.000 addebiti attivati nella prima settimana: più dei sei mesi precedenti', en: 'More than 3,000 direct debits set up in the first week: more than the previous six months' },
    { it: 'Sei volte più clienti raggiunti da un’offerta pertinente', en: 'Six times more customers reached with a relevant offer' },
  ],
} as const;
