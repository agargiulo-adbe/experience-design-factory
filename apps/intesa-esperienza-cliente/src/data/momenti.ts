/**
 * I sette momenti di Giulia — fonte UNICA.
 *
 * Da qui leggono: l'elenco dei passi sulla slide della persona, le sette
 * slide del capitolo «lato cliente» e le sette del capitolo «lato di chi
 * prepara». Due copie a mano degli stessi momenti divergono, sempre.
 *
 * ── GIULIA È UNA PROSPECT, NON UNA CLIENTE (29 ott 2026, richiesta del
 *    cliente, e riscrive la Storia dalle fondamenta) ───────────────────
 * La versione precedente la faceva «già vostra cliente»: comoda da
 * raccontare, perché il profilo esiste già, il canale esiste già e il CRM
 * sa chi è. Ma è anche l'use case che porta chiunque, ed è il più facile.
 * Qui non c'è niente di tutto questo, ed è esattamente il punto:
 *
 *   - non ha la vostra app, quindi non potete notificarla;
 *   - nel CRM non ha una posizione: può avere un lead, aperto dal
 *     percorso con l'appuntamento (panel del 30 ott 2026: il deck si
 *     contraddiceva fra «niente arriva al CRM» e «appuntamento al CRM»);
 *   - non ha uno storico, quindi il profilo è sottile e va costruito
 *     mentre lei naviga;
 *   - e sta parlando anche con altre due banche.
 *
 * Il segno più forte lo porta il CHROME, non la copia: **l'app compare
 * solo al momento 07**, quando ha firmato. Prima non aveva motivo di
 * scaricarla. Chi guarda lo capisce senza che nessuno lo dica.
 *
 * ── Perché sette e non sei ────────────────────────────────────────────
 * Perché la Storia deve coprire TUTTO lo spettro dell'offerta, non solo il
 * blocco dell'engagement.
 *
 *   blocco              momento   che cosa si vede
 *   FARSI TROVARE       01        la banca è citata nella risposta
 *   CONTENT FACTORY     02        la variante per il suo segmento
 *   CUSTOMER ENGAGEMENT 03 04 05  profilo, decisione, regia
 *   CUSTOMER ENGAGEMENT 06        il percorso attiva la filiale, via CRM
 *   CX ANALYTICS        07        l'esito torna nella misura, filiale compresa
 *
 * ── Perché ogni momento ha un'ORA ─────────────────────────────────────
 * È il meccanismo che fa funzionare la Storia di UniCredit. «Ore 21:40,
 * sul divano» è una scena; «il cliente cerca informazioni» è una riga di
 * requisiti.
 */

export type ChromeCliente = 'assistente' | 'feed' | 'sito' | 'posta' | 'filiale' | 'app';
export type SchermoAdobe =
  | 'visibilita' | 'genstudio' | 'profilo' | 'decisione'
  | 'percorso' | 'filiale' | 'misura';

export interface Momento {
  n: string;
  of: string;
  blocco: { it: string; en: string };
  ora: { it: string; en: string };
  dove: { it: string; en: string };
  short: { it: string; en: string };
  /** La MAPPA: che cosa fa il marketer in questo passo, e con che cosa.
      Due campi corti per forza — stanno in una colonna su sette. */
  funzione: { it: string; en: string };
  /** La tessera sotto il titolo interno, quando deve dire PIÙ della
      `funzione`. La funzione resta corta perché sta anche in una colonna
      su sette (mappa e circolo); qui c'è la riga intera. */
  tessera?: { it: string; en: string };
  /** Lo stato di Giulia nel chip in alto, quando non è più «non ancora
      cliente» (momento 07: ha firmato la richiesta e aperto il conto). */
  statoGiulia?: { it: string; en: string };
  /** Il TOUCHPOINT, in due parole. Chiesto in riunione il 29 ott 2026:
      «il classico percorso XD […] il percorso di vari touchpoint». `dove`
      è narrativo e non sta in una colonna su sette; questo sì. */
  canale: { it: string; en: string };
  /** Il GRUPPO dell'offerta, per la codifica a colori. Quattro e non
      cinque: `piattaforma` tiene insieme AI Platform e CX Analytics,
      perché non sono canali — servono gli altri tre. Vedi il blocco
      «LA CODIFICA A COLORI» in global.css per il perché del numero. */
  gruppo: 'trovare' | 'contenuto' | 'engagement' | 'piattaforma';
  /** IL PUNTO DA VERIFICARE — vedi `DOMANDE_IN_SLIDE` qui sotto.
      Una domanda sullo stato ATTUALE della banca, non un'affermazione su
      un concorrente: chi conosce il mercato sente il differenziante da
      sé, e in sala nessuno deve difendere una scelta già fatta. */
  verifica: { it: string; en: string };
  prodotto: string;
  /** COME ARRIVA SUL VOSTRO CANALE (check col referente, 11 nov 2026): i
      mockup sono semplificati, e i Canali e Group Technology vogliono sapere
      che cosa è prodotto Adobe, che cosa entra via API sul loro front-end e
      che cosa sviluppano loro. «Anche solo un accenno»: una riga, non una slide. */
  messa: { it: string; en: string };
  cliente: {
    chrome: ChromeCliente;
    scena: string;
    titolo: { it: string; en: string };
    corpo: { it: string; en: string };
  };
  interno: {
    prodotto: SchermoAdobe;
    scena: string;
    titolo: { it: string; en: string };
    corpo: { it: string; en: string };
  };
}

/* ══════════════════════════════════════════════════════════════════════
   L'INTERRUTTORE DELLE DOMANDE  (29 ott 2026)

   Ogni momento porta una domanda sullo stato attuale della banca, marcata
   in slide sul SOLO lato interno. Serve a far notare la meccanica che
   differenzia senza nominare nessun concorrente: si chiede com'è oggi, e
   chi conosce il mercato conclude da sé.

   Si spegne in TRE modi, dal più rapido al più definitivo:

     1 · in sala, subito — si apre il deck con `?domande=0` nell'indirizzo.
         La scelta resta per tutto il percorso e si può condividere così.
         `?domande=1` le riaccende.
     2 · per sempre su questa copia — si mette `false` qui sotto e si
         ricompila: il markup non viene nemmeno reso.
     3 · del tutto — si toglie il campo `verifica` e il componente.

   Il primo serve se al team non piacciono mezz'ora prima dell'incontro;
   il secondo se la decisione è presa.
   ══════════════════════════════════════════════════════════════════════ */
export const DOMANDE_IN_SLIDE = false;

/* Il paragrafo sotto i titoli dei sette momenti: spento il 9 nov 2026 su
   richiesta di chi presenta («togli sottotitoli da tutti i passaggi»). Il testo
   resta qui, in `corpo`, ed è la traccia di chi parla: `true` lo riaccende. */
export const CORPO_IN_SLIDE = false;

export const MOMENTI: Momento[] = [
  {
    n: '01', of: '07',
    blocco: { it: 'Farsi trovare', en: 'Brand visibility' },
    ora: { it: 'Una sera a casa', en: 'One evening at home' },
    dove: { it: 'Chiede a un assistente AI', en: 'Asking an AI assistant' },
    short: { it: 'Cerca un mutuo', en: 'Looks for a mortgage' },
    funzione: { it: 'La banca viene citata', en: 'The bank gets cited' },
    canale: { it: 'Assistente AI', en: 'AI assistant' },
    gruppo: 'trovare',
    verifica: { it: 'Oggi sapete su quali domande venite citati, e su quali no?', en: 'Do you know today which questions cite you, and which do not?' },
    prodotto: 'Brand Visibility',
    messa: { it: 'Prodotto Adobe: agisce sui vostri contenuti', en: 'An Adobe product: it acts on your content' },
    cliente: {
      chrome: 'assistente', scena: 'scena-01-divano',
      titolo: { it: 'Chiede a un assistente AI quale mutuo scegliere e trova Intesa Sanpaolo', en: 'She asks an AI assistant which mortgage to choose and finds Intesa Sanpaolo' },
      corpo: {
        it: 'Chiede a ChatGPT: «qual è il mutuo migliore per chi compra la prima casa?». La risposta cita tre banche. Giulia non è vostra cliente e non ha motivo di partire da voi: se il marchio non compare qui, il confronto comincia senza di voi.',
        en: 'She asks ChatGPT: “which mortgage is best for a first home?”. The answer cites three banks. Giulia is not your customer and has no reason to start from you: if the brand is absent here, the comparison starts without you.',
      },
    },
    interno: {
      prodotto: 'visibilita', scena: 'lavoro-01-ricerca',
      titolo: { it: 'Intesa misura su quali domande è citata e copre quelle che mancano', en: 'Intesa measures which questions cite it and covers the missing ones' },
      corpo: {
        it: 'Su otto domande che contano, la banca è citata in tre: i numeri si misurano insieme, domanda per domanda. Sulle cinque che mancano si verifica prima il perché. Per chi non vi conosce questa è la prima impressione, e spesso l’unica.',
        en: 'Across eight questions that matter, the bank is cited in three: the numbers get measured together, question by question. On the five missing ones the why is checked first. For someone who does not know you, this is the first impression, and often the only one.',
      },
    },
  },
  {
    n: '02', of: '07',
    blocco: { it: 'Content Factory', en: 'Content supply chain' },
    ora: { it: 'Il mattino dopo', en: 'The next morning' },
    dove: { it: 'Sui social', en: 'On social media' },
    short: { it: 'Vede l’annuncio', en: 'Sees the ad' },
    funzione: { it: 'Annuncio su misura', en: 'A tailored ad' },
    tessera: { it: 'Controlli di compliance mentre si produce; un processo che si può agentizzare', en: 'Compliance checks during production; a process that can be agentised' },
    canale: { it: 'Social', en: 'Social' },
    gruppo: 'contenuto',
    verifica: { it: 'Oggi l’informativa si applica alla produzione, o si verifica in revisione?', en: 'Today, is the disclosure applied at production, or checked at review?' },
    prodotto: 'GenStudio for Performance Marketing',
    messa: { it: 'Prodotto Adobe; l’annuncio arriva spento in Meta', en: 'An Adobe product; the ad lands paused in Meta' },
    cliente: {
      chrome: 'feed', scena: 'scena-02-bar',
      titolo: { it: 'Vede un annuncio sul mutuo per la prima casa a Torino', en: 'She sees an ad for a first-home mortgage in Turin' },
      corpo: {
        it: 'Fra un caffè e il tram compare un annuncio: «Il mutuo per la prima casa, a Torino». È la variante per chi compra la prima casa nella sua città, una delle dodici nate da un brief solo.',
        en: 'Between a coffee and the tram an ad appears: “First-home mortgage, in Turin”. It is the variant for first-home buyers in her city, one of twelve born from a single brief.',
      },
    },
    interno: {
      prodotto: 'genstudio', scena: 'lavoro-02-contenuti',
      titolo: { it: 'Dodici annunci da un solo brief, con i controlli di compliance dentro la produzione', en: 'Twelve ads from one brief, with compliance checks built into production' },
      corpo: {
        it: 'Il tempo se ne va soprattutto nelle approvazioni. Varianti controllate contro le linee guida di marchio e di canale mentre si producono; le informative restano nell’iter di approvazione legale. Su chi non vi conosce ancora, un messaggio generico non lo recupera poi la relazione.',
        en: 'Most of the time goes into approvals. Variants are checked against brand and channel guidelines while they are produced; disclosures stay in the legal approval process. With someone who does not know you yet, no relationship later makes up for a generic message.',
      },
    },
  },
  {
    n: '03', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'La sera stessa', en: 'That same evening' },
    dove: { it: 'Sul sito della banca', en: 'On the bank’s website' },
    short: { it: 'Simula la rata', en: 'Simulates the payment' },
    funzione: { it: 'La visita diventa un contatto', en: 'The visit becomes a contact' },
    canale: { it: 'Sito', en: 'Website' },
    gruppo: 'engagement',
    verifica: { it: 'Oggi una visita anonima di due sere prima si ritrova quando lascia l’email, e con quale consenso?', en: 'Today, is an anonymous visit from two evenings earlier recovered when she leaves her email, and under which consent?' },
    prodotto: 'Real-Time CDP',
    messa: { it: 'Simulatore vostro; i dati li raccoglie il Web SDK', en: 'Your simulator; the Web SDK collects the data' },
    cliente: {
      chrome: 'sito', scena: 'scena-03-tavolo',
      titolo: { it: 'Simula 180.000 euro su 25 anni e lascia l’indirizzo per salvare il risultato', en: 'She simulates 180,000 euro over 25 years and leaves her address to save the result' },
      corpo: {
        it: '180.000 euro su venticinque anni: 863 al mese. Per salvare la simulazione lascia l’indirizzo e dà il consenso. In quel momento smette di essere una visita anonima e diventa un profilo, con una data.',
        en: '180,000 euro over twenty-five years: 863 a month. To save the simulation she leaves her address and gives consent. At that moment she stops being an anonymous visit and becomes a profile, with a date.',
      },
    },
    interno: {
      prodotto: 'profilo', scena: 'lavoro-03-dati',
      titolo: { it: 'Quando lascia l’email, le due sessioni sotto pseudonimo (raccolte col consenso) si uniscono al suo profilo', en: 'When she leaves her email, the two pseudonymous sessions (collected under consent) merge into her profile' },
      corpo: {
        it: 'Le visite anonime delle sere prima si uniscono al profilo quando arriva un identificativo, l’email. Serve che il consenso alla profilazione ci fosse già: se manca, si riparte dalla simulazione di oggi. Nel CRM non ha una scheda cliente: può avere un lead.',
        en: 'Her anonymous visits from the previous evenings merge into the profile when an identifier arrives, the email, if profiling consent was already there. If not, it starts from today’s simulation. In the CRM she has no customer record: she can have a lead.',
      },
    },
  },
  {
    n: '04', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'La sera dopo', en: 'The next evening' },
    dove: { it: 'Sul sito della banca', en: 'On the bank’s website' },
    short: { it: 'Si interrompe', en: 'Stops halfway' },
    funzione: { it: 'Una proposta sola, la più utile', en: 'One offer, the most useful' },
    canale: { it: 'Sito', en: 'Website' },
    gruppo: 'engagement',
    verifica: { it: 'Oggi la politica di contatto si valuta quando si sceglie, o si applica all’invio?', en: 'Today, is the contact policy weighed when choosing, or applied at send time?' },
    prodotto: 'Journey Optimizer · AI Decisioning',
    messa: { it: 'La proposta arriva via API; il componente è vostro', en: 'The offer arrives over API; the component is yours' },
    cliente: {
      chrome: 'sito', scena: 'scena-04-documenti',
      titolo: { it: 'Si ferma perché le manca un documento', en: 'She stops because a document is missing' },
      corpo: {
        it: 'Le serve un documento che non ha sottomano. Chiude, e si dice che ci pensa nel weekend. Intanto la stessa domanda l’ha fatta ad altre due banche, e una di loro le scrive domani.',
        en: 'She needs a document she does not have to hand. She closes the tab, telling herself she will deal with it at the weekend. Meanwhile she asked two other banks the same question, and one writes to her tomorrow.',
      },
    },
    interno: {
      prodotto: 'decisione', scena: 'lavoro-04-decisione',
      titolo: { it: 'Delle quattro proposte possibili, il sito le mostra il promemoria con un appuntamento proposto', en: 'Of the four possible offers, the site shows her the reminder with a proposed appointment' },
      corpo: {
        it: 'Il profilo è sottile: due sessioni, una simulazione, un consenso. Su chi non è ancora cliente il motore di targeting non ha punteggi: valgono la priorità dell’offerta e le regole scritte insieme. La regola di contatto resta vostra.',
        en: 'The profile is thin: two sessions, one simulation, one consent. For someone not yet a customer the targeting engine has no scores: the offer’s priority and the rules written together apply. The contact rule stays yours.',
      },
    },
  },
  {
    n: '05', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'Il mattino dopo', en: 'The next morning' },
    dove: { it: 'Via email', en: 'By email' },
    short: { it: 'Riprende la pratica', en: 'Resumes the application' },
    funzione: { it: 'Un richiamo, più canali', en: 'One follow-up, several channels' },
    canale: { it: 'Email', en: 'Email' },
    gruppo: 'engagement',
    verifica: { it: 'Oggi quanto passa fra il gesto di un non cliente e il primo contatto?', en: 'Today, how long passes between a non-customer’s action and the first contact?' },
    prodotto: 'Journey Optimizer',
    messa: { it: 'Canale nativo di Journey Optimizer', en: 'A native Journey Optimizer channel' },
    cliente: {
      chrome: 'posta', scena: 'scena-05-colazione',
      titolo: { it: 'Riceve un’email e completa la richiesta', en: 'She gets an email and completes the application' },
      corpo: {
        it: 'Ha lasciato un indirizzo email, ed è l’unico modo per scriverle. Arriva la sua simulazione, con il link per riprenderla e una proposta di appuntamento. Carica il documento mentre fa colazione, e accetta la data.',
        en: 'She left an email address, and that is the only way to write to her. Her simulation arrives, with the link to resume it and a proposed appointment. She uploads the document over breakfast, and accepts the date.',
      },
    },
    interno: {
      prodotto: 'percorso', scena: 'lavoro-05-orchestrazione',
      titolo: { it: 'Se lascia la richiesta a metà, la banca gliela ricorda per email, sul sito e con un annuncio', en: 'If she leaves the application half-done, the bank reminds her by email, on the website and with an ad' },
      corpo: {
        it: 'L’audience si definisce una volta, con le regole, e il percorso parte dall’evento. Aspetta dodici ore, prova la mail con la proposta di appuntamento e, se il clic non arriva, riprova con la variante giusta.',
        en: 'The audience is defined once, with rules, and the journey starts from the event. It waits twelve hours, tries email with the proposed appointment and, if the click does not come, tries again with the right variant.',
      },
    },
  },
  {
    n: '06', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'Il mercoledì', en: 'On the Wednesday' },
    dove: { it: 'In filiale', en: 'In branch' },
    short: { it: 'Va in filiale', en: 'Goes to the branch' },
    funzione: { it: 'La filiale è informata', en: 'The branch is informed' },
    canale: { it: 'Filiale', en: 'Branch' },
    gruppo: 'engagement',
    verifica: { it: 'Oggi che cosa arriva al CRM di filiale, di una persona non ancora cliente?', en: 'Today, what reaches the branch CRM about someone who is not yet a customer?' },
    prodotto: 'Journey Optimizer',
    messa: { it: 'Lead e simulazione nel vostro CRM, via API', en: 'Lead and simulation in your CRM, over API' },
    cliente: {
      chrome: 'filiale', scena: 'scena-06-filiale',
      titolo: { it: 'In filiale trova un gestore che conosce già il suo percorso', en: 'In the branch she finds an adviser who already knows her journey' },
      corpo: {
        it: 'Entra per l’appuntamento e trova la sua simulazione già aperta: stesso importo, stessa rata, stessi documenti. Non le viene chiesto di raccontare da capo quello che ha già fatto sul sito tre sere prima.',
        en: 'She arrives for the appointment and finds her simulation already open: same amount, same instalment, same documents. She is not asked to retell what she already did on the site three evenings earlier.',
      },
    },
    interno: {
      prodotto: 'filiale', scena: 'lavoro-06-filiale-back',
      titolo: { it: 'Le informazioni di Giulia passano al CRM della filiale, e al gestore', en: 'Giulia’s information passes to the branch CRM, and to the adviser' },
      corpo: {
        it: 'Il percorso scrive nel CRM di filiale il lead, la data e la simulazione appena lei accetta l’appuntamento, via API e dentro i consensi. Chi la riceve lavora nel CRM che usa già. La stessa azione vale per un’audience intera: ogni persona arriva in filiale come lead da lavorare. Il collegamento con il vostro CRM si disegna con voi.',
        en: 'When she accepts the appointment, the journey writes the lead, the date and the simulation into the branch CRM, over API and within consent. Whoever receives her works in the CRM they already use. The same action works for a whole audience: each person reaches the branch as a lead to work. The link with your CRM gets designed with you.',
      },
    },
  },
  {
    n: '07', of: '07',
    blocco: { it: 'CX Analytics', en: 'CX analytics' },
    /* ⚠️ Tre settimane dal mercoledì 18 novembre: mercoledì 9 dicembre.
       NON martedì 8, che è l'Immacolata e le filiali sono chiuse; e non
       più sabato 5 alle 18:40, che il panel dell'11 nov 2026 ha visto. */
    ora: { it: 'Tre settimane dopo', en: 'Three weeks later' },
    dove: { it: 'In filiale', en: 'In branch' },
    short: { it: 'Diventa cliente', en: 'Becomes a customer' },
    funzione: { it: 'Costo per richiesta firmata, per canale', en: 'Cost per signed application, per channel' },
    tessera: { it: 'Costo per richiesta firmata, per canale, una volta portata in piattaforma la spesa', en: 'Cost per signed application, per channel, once spend is brought into the platform' },
    statoGiulia: { it: 'Richiesta firmata · cliente da oggi', en: 'Application signed · customer from today' },
    canale: { it: 'Filiale e app', en: 'Branch and app' },
    gruppo: 'piattaforma',
    verifica: { it: 'Oggi sapete quale momento ha prodotto il cliente, o solo quanto ha reso il canale?', en: 'Today, do you know which moment produced the customer, or only what the channel returned?' },
    prodotto: 'Customer Journey Analytics',
    messa: { it: 'Dati di filiale via file o connettore', en: 'Branch data by file or connector' },
    cliente: {
      chrome: 'app', scena: 'scena-07-casa',
      titolo: { it: 'Firma la richiesta e apre il conto: da oggi la pratica è nell’app', en: 'She signs the application and opens an account: from today the file is in the app' },
      corpo: {
        it: 'Firma la richiesta in filiale e apre il conto; l’istruttoria comincia adesso. L’app le serve da oggi: prima non aveva un rapporto, ed è il motivo per cui nei momenti precedenti non c’era. Da qui in avanti il canale è vostro.',
        en: 'She signs the application in branch and opens an account; the credit assessment starts now. The app matters from today: before she had no relationship, which is why it was absent from the earlier moments. From here the channel is yours.',
      },
    },
    interno: {
      prodotto: 'misura', scena: 'lavoro-07-misura',
      titolo: { it: 'Si vede dove si perdono i non clienti, filiale compresa', en: 'You can see where non-customers are lost, branch included' },
      corpo: {
        it: 'A che serve qui: manca una misura sola dall’assistente alla firma. Senza quella nessuno sa quale dei sette momenti ha prodotto la cliente, né su quale investire il mese dopo. Appuntamento tenuto, pratica e delibera tornano dal CRM di filiale nello stesso dato. Il numero da guardare è quanto costa una richiesta firmata, per canale, una volta portata in piattaforma la spesa, e dove si perdono le altre.',
        en: 'What it is for: there is no single measurement from the assistant to the signature. Without it nobody knows which of the seven moments produced the customer, or where to invest next month. Appointment held, application and approval come back from the branch CRM into the same data. The number to watch is what a signed application costs, per channel, once spend is in the platform, and where others are lost.',
      },
    },
  },
];
