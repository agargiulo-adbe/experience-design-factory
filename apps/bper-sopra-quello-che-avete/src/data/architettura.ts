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
    d: { it: 'La piattaforma dati di gruppo, dove confluisce quello che i sistemi producono', en: 'The group data platform, where what the systems produce converges' },
    verso: 'resta',
  },
  {
    k: { it: 'CDP Oracle', en: 'Oracle CDP' },
    /* ⚠️ ATTRIBUITO, non affermato. Nessuna fonte pubblica parla di una CDP
       Oracle né di un rinnovo al 2030: il dato viene da loro, e presentarlo
       come fatto nostro è il modo di farsi correggere in sala su una cosa
       che avevamo ragione di dire. */
    d: { it: 'Ci avete detto che è rinnovata fino al 2030. Come ci si colleghi resta da verificare', en: 'You told us it is renewed to 2030. How we connect is still to be verified' },
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
    d: { it: 'Oggi Marketing Cloud. Cambia dove si decide, non che si possa partire da un evento', en: 'Marketing Cloud today. What changes is where the decision sits, not event triggering' },
    verso: 'esce', pro: 'Salesforce Marketing Cloud',
  },
  {
    k: { it: 'La personalizzazione', en: 'Personalisation' },
    /* ⚠️ Il materiale pubblico del cliente nomina Marketing Cloud, Financial
       Services Cloud, Einstein, Tableau e Genesys: non il componente di
       personalizzazione, che ha due nomi vicini e diversi nel catalogo
       Salesforce. Finché non lo confermano loro, si dichiara da confermare. */
    d: { it: 'Oggi un componente Salesforce, da confermare con voi. Stessa regola su sito, app e area riservata', en: 'A Salesforce component today, to be confirmed with you. One rule across site, app and logged-in area' },
    verso: 'esce', pro: 'Salesforce Personalization (da confermare)',
  },
  {
    k: { it: 'L’arbitro fra le proposte', en: 'The arbiter between offers' },
    d: { it: 'Quale proposta fare a ogni cliente lo calcolate già; qui si arbitra fra proposte in competizione', en: 'Which offer fits each customer you already compute; here offers in competition get arbitrated' },
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
    d: { it: 'Portafogliazione, CRM operativo, CIB, FOL e Data Cloud. In gara: lo strato sopra regge in entrambi gli esiti', en: 'Portfolio, operational CRM, CIB, FOL and Data Cloud. In tender: the layer above holds either way' },
    verso: 'ingara',
  },
  {
    k: { it: 'Genesys e Unblu', en: 'Genesys and Unblu' },
    d: { it: 'Il canale assistito: la telefonia e il risponditore. Videochiamata e navigazione condivisa sono gli stessi dell’elenco qui sotto', en: 'The assisted channel: telephony and the IVR. Video call and co-browsing are the same ones listed below' },
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
    /* ⚠️ Diceva «parte da un evento invece di essere una campagna costruita e
       lanciata»: ma Journey Builder entra da evento, e in casa loro gira già
       così — su percorsi fatti dall'integratore che siede in sala. La frase
       giusta la scriveva già la mappa di questo stesso documento: il
       confronto sta su DOVE si decide, e sull'arbitrato fra percorsi
       concorrenti, non sulla possibilità di partire da un evento. */
    d: {
      it: 'Cambia dove si decide, non che si possa partire da un evento: il confronto sta sull’arbitrato fra percorsi concorrenti e sulla decisione in sessione.',
      en: 'What changes is where the decision sits, not event triggering: the comparison is about arbitrating competing journeys and deciding in session.',
    },
    dBreve: {
      it: 'Cambia dove si decide, non che si possa partire da un evento.',
      en: 'What changes is where the decision sits, not event triggering.',
    },
  },
  {
    oggi: { it: 'Salesforce Personalization', en: 'Salesforce Personalization' },
    poi: { it: 'La personalizzazione dei canali', en: 'Channel personalisation' },
    pro: 'Adobe Target',
    d: {
      it: 'Target porta l’esperienza e la prova; l’offerta da proporre la sceglie l’arbitro. Due mestieri, non uno.',
      en: 'Target carries the experience and the test; which offer to show is the arbiter’s job. Two roles, not one.',
    },
    dBreve: {
      it: 'L’esperienza e la prova; l’offerta la sceglie l’arbitro.',
      en: 'The experience and the test; the offer is the arbiter’s call.',
    },
  },
  {
    /* ⚠️ Due correzioni del secondo giro su una riga sola. L'etichetta
       «Oggi» la aggiunge la pagina, e il testo la ripeteva: in proiezione si
       leggeva «Oggi: Oggi frammentato», ed è il refuso che fa dubitare del
       resto. E il contenuto: il motore del cliente calcola già la proposta
       migliore per cliente, quindi non si scrive che manca — si scrive che
       cosa manca davvero, cioè l'arbitrato fra proposte in competizione. */
    oggi: { it: 'presente, non configurato come arbitro fra canali', en: 'present, not configured as an arbiter across channels' },
    poi: { it: 'L’arbitro fra le proposte', en: 'The arbiter between offers' },
    pro: 'Adobe Journey Optimizer Decisioning',
    d: {
      it: 'Il vostro motore calcola quale proposta fare a ogni cliente. Qui si decide chi vince quando più proposte competono sulla stessa persona, e chi possiede quella regola.',
      en: 'Your engine computes which offer fits each customer. Here the question is who wins when several offers compete for the same person, and who owns that rule.',
    },
    dBreve: {
      it: 'Chi vince quando più proposte competono sulla stessa persona.',
      en: 'Who wins when several offers compete for the same person.',
    },
  },
  {
    oggi: { it: 'La misura, per canale', en: 'Measurement, channel by channel' },
    poi: { it: 'La misura, sul percorso intero', en: 'Measurement, across the whole journey' },
    pro: 'Customer Journey Analytics',
    d: {
      it: 'Lo stesso cliente su filiale, app e sito in un conteggio solo. Gli eventi di comportamento entrano in piattaforma: quelli sì si spostano.',
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
  { k: { it: 'La chiave d’identità', en: 'The identity key' },
    d: { it: 'Un identificativo per canale e la tabella che li collega: senza, filiale, app e sito restano tre persone diverse', en: 'One identifier per channel and the table that links them: without it, branch, app and site stay three different people' } },
  { k: { it: 'Gli eventi di comportamento', en: 'Behavioural events' },
    d: { it: 'Le interazioni su sito, app e canali: servono alla misura e alla decisione in sessione', en: 'Interactions on site, app and channels: needed for measurement and in-session decisions' } },
  { k: { it: 'I recapiti', en: 'Contact details' },
    d: { it: 'Quello che serve a spedire. Il permesso si legge dai vostri registri nel momento della decisione', en: 'What it takes to send. The permission is read from your registers at decision time' } },
];

export const RESTA: Voce[] = [
  { k: { it: 'L’anagrafica estesa', en: 'The extended customer record' },
    d: { it: 'Resta nei vostri sistemi: non serve a decidere un messaggio', en: 'Stays in your systems: it is not needed to decide a message' } },
  { k: { it: 'I rapporti e i saldi', en: 'Accounts and balances' },
    d: { it: 'Restano dove sono. Si interrogano per comporre un’audience, non si copiano', en: 'Stay where they are. Queried to compose an audience, never copied' } },
  { k: { it: 'Gli attributi della vostra profilazione', en: 'Your profiling attributes' },
    d: { it: 'Score e segmenti restano nella vostra piattaforma dati: servono a comporre un’audience, e solo quelli che decidono entrano come arricchimento', en: 'Scores and segments stay in your data platform: they compose an audience, and only those that decide come in as enrichment' } },
  /* ⚠️ Il consenso non è un recapito, ed è l'unica voce di questa tabella con
     un titolare e una revoca. Marcarlo fra le cose che «entrano a spedire»
     era la correzione del primo giro fatta male: in banca quella riga la
     legge chi risponde al Garante. */
  { k: { it: 'Il registro dei consensi', en: 'The consent register' },
    d: { it: 'Resta vostro, col titolare che ha oggi. Una copia tecnica, se serve, non diventa la fonte di verità: oltre la latenza dichiarata non si contatta', en: 'Stays yours, with the controller it has today. A technical copy, if needed, does not become the source of truth: past the declared latency nobody is contacted' } },
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
export interface Passo {
  k: { it: string; en: string };
  oggi: { it: string; en: string };
  poi: { it: string; en: string };
  /** ⚠️ IL VERSO, e serve per una ragione sola: una riga che si allunga va
      detta. Un documento che elenca solo le cose che migliorano lo legge
      come promessa chi fa le campagne, e la prima settimana in cui una cosa
      diventa più lenta diventa la prova che non ci avevamo mai lavorato. */
  verso?: 'sparisce' | 'resta' | 'piu-lungo';
}

export const SETTIMANA: Passo[] = [
  { k: { it: 'La lista', en: 'The list' },
    oggi: { it: 'Si chiede, si aspetta, arriva quando arriva', en: 'You ask, you wait, it arrives when it arrives' },
    poi: { it: 'La regola si scrive una volta e il percorso parte da sé. La campagna a lista resta possibile', en: 'The rule is written once and the journey starts on its own. List campaigns still work' } },
  { k: { it: 'Il controllo prima dell’invio', en: 'The pre-send check' },
    oggi: { it: 'Si guarda la lista prima di premere', en: 'You look at the list before pressing send' },
    poi: { it: 'Si guarda la regola e un campione, e si può fermare tutto a percorso avviato', en: 'You check the rule and a sample, and can stop everything mid-journey' } },
  { k: { it: 'Chi scrive le regole', en: 'Who writes the rules' },
    oggi: { it: 'Chi costruisce la campagna, una alla volta', en: 'Whoever builds the campaign, one at a time' },
    poi: { it: 'Le scrivete voi, una volta, e valgono per tutte', en: 'You write them once, and they hold for all' },
    verso: 'resta' },
  { k: { it: 'La prova prima di partire', en: 'The test before going live' },
    oggi: { it: 'Un invio di prova a un campione', en: 'A test send to a sample' },
    poi: { it: 'Si simula il percorso su profili veri, prima che parta', en: 'You simulate the journey on real profiles, before it starts' },
    verso: 'resta' },
  { k: { it: 'Il primo percorso', en: 'The first journey' },
    oggi: { it: 'Si costruisce la campagna e si lancia', en: 'You build the campaign and launch it' },
    poi: { it: 'La prima volta è più lunga: la regola si scrive una volta per tutte', en: 'The first time takes longer: the rule is written once and for all' },
    verso: 'piu-lungo' },
  { k: { it: 'Il consuntivo', en: 'The wrap-up' },
    oggi: { it: 'Si chiede un report per canale, e si sommano a mano', en: 'You ask for a report per channel, and add them up by hand' },
    poi: { it: 'Il percorso intero si legge in un conteggio solo', en: 'The whole journey reads in a single count' },
    verso: 'sparisce' },
];

/* ══════════════════════════════════════════════════════════════════════
   COME SI MISURA IL BENEFICIO.
   ⚠️ Per due giri questo documento ha avuto un capitolo intitolato «che cosa
   si paga, e di che cosa» che diceva soltanto di che cosa si paga. Quattro
   lettori su cinque l'hanno messo fra le condizioni: «al comitato porto un
   listino e non un progetto», «nessuno firma tre persone senior per mezza
   giornata contro un listino di grandezze». E la prima fase della rotta dice
   che senza misura il confronto con oggi non esiste: dirlo e poi non portare
   gli indicatori è la contraddizione che si nota.
   I tre indicatori sono quelli su cui il cliente è misurato davvero — la
   vendita conclusa sui canali digitali sta nel suo piano industriale
   pubblico — e il valore di partenza resta IN BIANCO: lo riempiono loro,
   perché un numero di partenza inventato da noi vale zero.
   ══════════════════════════════════════════════════════════════════════ */
export const MISURE: Passo[] = [
  { k: { it: 'Vendita conclusa sui canali digitali', en: 'Sales completed on digital channels' },
    oggi: { it: 'La quota di oggi, che misurate voi', en: 'Today’s share, measured by you' },
    poi: { it: 'Il bersaglio a dodici mesi, che fissate voi', en: 'The twelve-month target, set by you' } },
  { k: { it: 'Contatti utili per cliente contattabile', en: 'Useful contacts per contactable customer' },
    oggi: { it: 'Quanti ne riceve oggi, e quanti servono', en: 'How many they get today, and how many are useful' },
    poi: { it: 'Meno contatti e più risposte: è quello che governa l’arbitro', en: 'Fewer contacts and more replies: that is what the arbiter governs' } },
  { k: { it: 'Giorni dal brief all’invio', en: 'Days from brief to send' },
    oggi: { it: 'Il tempo di un percorso nuovo, oggi', en: 'The time for a new journey, today' },
    poi: { it: 'Lo stesso tempo, dopo la prima fase', en: 'The same time, after the first phase' } },
];

/* ══════════════════════════════════════════════════════════════════════
   COME SI ESCE — il fascicolo di esternalizzazione.
   ⚠️ Due giri di revisione e zero righe su questo, mentre tre lettori su
   cinque lo chiamano cancello e non preferenza: in banca il fascicolo del
   fornitore ICT si apre PRIMA del prezzo, e la reversibilità è una clausola
   obbligatoria su un canale di primo livello. Scoperto dal loro rischio
   operativo fra due mesi costa un trimestre; dichiarato da noi adesso costa
   quattro righe.
   ⚠️ E si dice così, non diversamente: gli obblighi di DORA sono del
   cliente e arrivano a noi per contratto; la CRITICITÀ la classifica la
   banca nella sua analisi d'impatto, mai il fornitore.
   ══════════════════════════════════════════════════════════════════════ */
export const USCITA: Voce[] = [
  { k: { it: 'Nel vostro registro dei fornitori', en: 'In your supplier register' },
    d: { it: 'Entriamo con la documentazione che serve: sede del trattamento, subfornitori, addenda contrattuali', en: 'We come in with the paperwork: where processing happens, sub-processors, contractual addenda' } },
  { k: { it: 'La criticità la classificate voi', en: 'You classify the criticality' },
    d: { it: 'La decide la vostra analisi d’impatto. Noi portiamo i documenti per farla, non il giudizio', en: 'Your own impact analysis decides it. We bring the documents to run it, not the verdict' } },
  { k: { it: 'Come tornano indietro i dati', en: 'How the data comes back' },
    d: { it: 'Profili, eventi, definizioni dei percorsi e regole di arbitraggio: in quale formato e in quanto tempo si scrive nel contratto', en: 'Profiles, events, journey definitions and arbitration rules: format and timescale are written into the contract' } },
  { k: { it: 'Continuità e prove', en: 'Continuity and testing' },
    d: { it: 'Livelli di servizio, piano di continuità e prova di ripristino si allegano prima della firma', en: 'Service levels, continuity plan and recovery test are attached before signature' } },
];

/* ══════════════════════════════════════════════════════════════════════
   QUELLO CHE MANCA PER DARE UNA STIMA IN GIORNATE.
   ⚠️ «Quanto mi costa in rifacimenti» è la seconda delle due domande con cui
   il cliente ha aperto la porta, e dopo due giri era ancora senza risposta.
   Una Gantt inventata non si fa — si smonta in sala — ma «l'ordine, non il
   calendario» da solo è una risposta che non risponde. Quello che si può
   dire adesso è che cosa stringe la stima, chi la fa, e quando arriva
   scritta: una scadenza nostra, non un'intenzione.
   ══════════════════════════════════════════════════════════════════════ */
export const SFORZO: Voce[] = [
  { k: { it: 'Quanti percorsi attivi oggi', en: 'How many live journeys today' },
    d: { it: 'Il numero e la complessità media decidono la massa da ricostruire: li contiamo insieme, alla mezza giornata', en: 'Their number and average complexity decide the mass to rebuild: we count them together, at the half day' } },
  { k: { it: 'Quanti modelli e quante varianti', en: 'How many templates and variants' },
    d: { it: 'I modelli di messaggio si rifanno una volta: è la voce che si sottostima sempre', en: 'Message templates are rebuilt once: this is the line always underestimated' } },
  { k: { it: 'Chi fa che cosa', en: 'Who does what' },
    d: { it: 'Noi la misura e la prima configurazione, l’integratore le integrazioni verso i vostri sistemi, il vostro team le regole', en: 'Us for measurement and first setup, the integrator for integrations to your systems, your team for the rules' } },
  { k: { it: 'Il doppio esercizio', en: 'Running both' },
    d: { it: 'Le settimane in cui i due motori restano accesi entrano nella stima come costo, non come nota', en: 'The weeks with both engines running are in the estimate as a cost, not as a footnote' } },
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
  moduli: 'Journey Optimizer con Decisioning, Real-Time CDP, Customer Journey Analytics e Target',
  /* ⚠️ RISCRITTI SULLA FONTE, parola per parola, al secondo giro.
     Il «sei volte» era diventato «clienti raggiunti»: la storia pubblicata
     da Adobe misura i clienti MESSI IN CONTATTO con l'esperienza finanziaria
     che risolve il loro bisogno, che è un'altra cosa — e il numero più
     visibile della slide è il primo che qualcuno va a verificare.
     Il caso dei 3.000 addebiti è un'iniziativa dentro il programma, non il
     programma: va detto con il suo perimetro (oltre 300.000 clienti a
     rischio, cioè l'1%) o diventa una percentuale che non esiste. */
  data: '2024',
  fatti: [
    { it: 'Oltre 300.000 clienti senza addebito diretto sulla carta di credito, a rischio di spese per ritardo', en: 'Over 300,000 customers with no direct debit on their credit card, at risk of late-payment fees' },
    { it: 'Più di 3.000 addebiti attivati nella prima settimana, contro dieci nei sei mesi precedenti: l’1% dei clienti a rischio', en: 'More than 3,000 direct debits set up in the first week, against ten in the previous six months: 1% of the customers at risk' },
    { it: 'Sei volte più clienti messi in contatto con l’esperienza finanziaria che risolve il loro bisogno', en: 'Six times more customers connected to the financial experience that solves their need' },
  ],
} as const;
