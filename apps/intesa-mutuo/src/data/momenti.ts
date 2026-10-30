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
 *   - non è nel CRM, quindi il gestore di filiale non ha una sua scheda;
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
 *   AI PLATFORM         06        il quadro si chiede a parole
 *   CX ANALYTICS        07        l'esito torna nella misura
 *
 * ── Perché ogni momento ha un'ORA ─────────────────────────────────────
 * È il meccanismo che fa funzionare la Storia di UniCredit. «Ore 21:40,
 * sul divano» è una scena; «il cliente cerca informazioni» è una riga di
 * requisiti.
 */

export type ChromeCliente = 'assistente' | 'feed' | 'sito' | 'posta' | 'filiale' | 'app';
export type SchermoAdobe =
  | 'visibilita' | 'genstudio' | 'profilo' | 'decisione'
  | 'percorso' | 'coworker' | 'misura';

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
export const DOMANDE_IN_SLIDE = true;

export const MOMENTI: Momento[] = [
  {
    n: '01', of: '07',
    blocco: { it: 'Farsi trovare', en: 'Brand visibility' },
    ora: { it: 'Ore 21:40, sul divano', en: '9:40 PM, on the sofa' },
    dove: { it: 'Prima di sapere chi siete', en: 'Before she knows who you are' },
    short: { it: 'Chiede', en: 'Asks' },
    funzione: { it: 'Vi trovano, o no', en: 'Found, or not' },
    canale: { it: 'Assistente AI', en: 'AI assistant' },
    gruppo: 'trovare',
    verifica: { it: 'Oggi sapete su quali domande venite citati, e su quali no?', en: 'Do you know today which questions cite you, and which do not?' },
    prodotto: 'Brand Visibility',
    cliente: {
      chrome: 'assistente', scena: 'scena-01-divano',
      titolo: { it: 'Non sta scegliendo fra le vostre offerte. Sta scegliendo se guardarvi.', en: 'She is not choosing among your offers. She is choosing whether to look at you.' },
      corpo: {
        it: 'Lo chiede a ChatGPT, non a un motore di ricerca: «qual è il mutuo migliore per chi compra la prima casa?». La risposta cita tre banche. Giulia non è vostra cliente e non ha motivo di partire da voi: se il marchio non compare qui, il confronto comincia senza di voi.',
        en: 'She asks ChatGPT, not a search engine: “which mortgage is best for a first home?”. The answer cites three banks. Giulia is not your customer and has no reason to start from you: if the brand is absent here, the comparison starts without you.',
      },
    },
    interno: {
      prodotto: 'visibilita', scena: 'lavoro-01-ricerca',
      titolo: { it: 'Dove compare il marchio, e dove no', en: 'Where the brand shows up, and where it does not' },
      corpo: {
        it: 'Su otto domande che contano, la banca è citata in tre. Si misura domanda per domanda, e si lavora sul contenuto che l’assistente non riesce a leggere. Per chi non vi conosce questa è la prima impressione, e spesso l’unica.',
        en: 'Across eight questions that matter, the bank is cited in three. It is measured question by question, and you work on the content the assistant cannot read. For someone who does not know you, this is the first impression, and often the only one.',
      },
    },
  },
  {
    n: '02', of: '07',
    blocco: { it: 'Content Factory', en: 'Content supply chain' },
    ora: { it: 'Il mattino dopo, al bar', en: 'Next morning, at the café' },
    dove: { it: 'Nel suo feed', en: 'In her feed' },
    short: { it: 'Riconosce', en: 'Recognises' },
    funzione: { it: 'Varianti già conformi', en: 'Pre-approved variants' },
    canale: { it: 'Social', en: 'Social' },
    gruppo: 'contenuto',
    verifica: { it: 'Oggi l’informativa si applica alla produzione, o si verifica in revisione?', en: 'Today, is the disclosure applied at production, or checked at review?' },
    prodotto: 'GenStudio',
    cliente: {
      chrome: 'feed', scena: 'scena-02-bar',
      titolo: { it: 'Il messaggio parla la sua lingua, non quella di tutti', en: 'The message speaks her language, not everyone’s' },
      corpo: {
        it: 'Fra un caffè e il tram compare un annuncio: «Il mutuo per la prima casa, a Torino». Non è la campagna per tutti: è la variante per chi compra la prima casa nella sua città, una delle dodici nate da un brief solo.',
        en: 'Between a coffee and the tram an ad appears: “First-home mortgage, in Turin.” Not the campaign for everyone. It is the variant for first-home buyers in her city, one of twelve born from a single brief.',
      },
    },
    interno: {
      prodotto: 'genstudio', scena: 'lavoro-02-contenuti',
      titolo: { it: 'Dodici varianti da un brief, già conformi', en: 'Twelve variants from one brief, already compliant' },
      corpo: {
        it: 'Il tempo non se ne va nel produrle: se ne va nell’approvarle. Qui le informative obbligatorie e i vincoli di marchio sono applicati per costruzione. Su chi non vi conosce ancora, un messaggio generico non lo recupera poi la relazione.',
        en: 'Time is not spent producing them: it is spent approving them. Here mandatory disclosures and brand rules are applied by construction. With someone who does not know you yet, no relationship later makes up for a generic message.',
      },
    },
  },
  {
    n: '03', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'Ore 21:48, al tavolo di cucina', en: '9:48 PM, at the kitchen table' },
    dove: { it: 'Sul vostro sito', en: 'On your site' },
    short: { it: 'Simula', en: 'Simulates' },
    funzione: { it: 'Da anonima a nome', en: 'Anonymous to named' },
    canale: { it: 'Sito', en: 'Website' },
    gruppo: 'engagement',
    verifica: { it: 'Oggi una visita anonima di due sere prima si ritrova, quando lascia il nome?', en: 'Today, is an anonymous visit from two evenings earlier recovered when she leaves a name?' },
    prodotto: 'Real-Time CDP',
    cliente: {
      chrome: 'sito', scena: 'scena-03-tavolo',
      titolo: { it: 'Simula senza dire chi è, e il numero la convince', en: 'She simulates without saying who she is, and the number convinces her' },
      corpo: {
        it: '180.000 euro su venticinque anni: 742 al mese. Per salvare la simulazione lascia l’indirizzo e dà il consenso. In quel momento smette di essere una visita anonima e diventa un nome, con una data.',
        en: '180,000 euro over twenty-five years: 742 a month. To save the simulation she leaves her address and gives consent. At that moment she stops being an anonymous visit and becomes a name, with a date.',
      },
    },
    interno: {
      prodotto: 'profilo', scena: 'lavoro-03-dati',
      titolo: { it: 'Era un numero di sessione. Adesso è una persona.', en: 'It was a session number. Now it is a person.' },
      corpo: {
        it: 'Le visite anonime delle sere prima si attaccano al profilo nell’istante del consenso, e non si perdono. Niente di tutto questo arriva al CRM: il CRM conosce i clienti, e lei non lo è ancora.',
        en: 'Her anonymous visits from the previous evenings attach to the profile the instant consent is given, and are not lost. None of this reaches the CRM: the CRM knows customers, and she is not one yet.',
      },
    },
  },
  {
    n: '04', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'Ore 22:05, la sera dopo', en: '10:05 PM, the next evening' },
    dove: { it: 'Sul vostro sito', en: 'On your site' },
    short: { it: 'Si ferma', en: 'Stalls' },
    funzione: { it: 'Si sceglie, col tetto', en: 'One is chosen, within the cap' },
    canale: { it: 'Sito', en: 'Website' },
    gruppo: 'engagement',
    verifica: { it: 'Oggi il tetto di contatto si valuta quando si sceglie, o si applica dopo?', en: 'Today, is the contact cap weighed when choosing, or applied afterwards?' },
    prodotto: 'Offer Decisioning',
    cliente: {
      chrome: 'sito', scena: 'scena-04-documenti',
      titolo: { it: 'Le manca una busta paga, e chiude', en: 'A payslip is missing, and she closes the tab' },
      corpo: {
        it: 'Non ha cambiato idea: le serve un documento che non ha sottomano. Chiude, e si dice che ci pensa nel weekend. Intanto la stessa domanda l’ha fatta ad altre due banche, e una di loro le scrive domani.',
        en: 'She has not changed her mind: she needs a document she does not have to hand. She closes the tab, telling herself she will deal with it at the weekend. Meanwhile she asked two other banks the same question, and one writes to her tomorrow.',
      },
    },
    interno: {
      prodotto: 'decisione', scena: 'lavoro-04-decisione',
      titolo: { it: 'Cinque cose da dirle, e una sola può partire', en: 'Five things to tell her, and only one can go' },
      corpo: {
        it: 'Su chi non è ancora cliente il profilo è sottile: due sessioni, una simulazione, un consenso. Serve il posto dove si decide quale proposta parte, su quale canale e dentro il tetto di contatto, valutato quando si decide.',
        en: 'For someone not yet a customer the profile is thin: two sessions, one simulation, one consent. What is missing is where to decide which proposal goes, on which channel and within the contact cap, evaluated at decision time.',
      },
    },
  },
  {
    n: '05', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'Ore 8:02, il mattino dopo', en: '8:02 AM, the next morning' },
    dove: { it: 'Nella sua posta', en: 'In her inbox' },
    short: { it: 'Riprende', en: 'Resumes' },
    funzione: { it: 'Parte dall’evento', en: 'Triggered by the event' },
    canale: { it: 'Email', en: 'Email' },
    gruppo: 'engagement',
    verifica: { it: 'Oggi quanto passa fra il gesto di una prospect e il primo contatto?', en: 'Today, how long passes between a prospect’s action and the first contact?' },
    prodotto: 'Journey Optimizer',
    cliente: {
      chrome: 'posta', scena: 'scena-05-colazione',
      titolo: { it: 'Un messaggio solo, e riprende da dove era rimasta', en: 'One message, and she picks up where she left off' },
      corpo: {
        it: 'Non ha la vostra app: ha lasciato un indirizzo, e quello è l’unico canale che avete. Arriva la sua simulazione, con il link per riprenderla. Carica il documento mentre fa colazione.',
        en: 'She does not have your app: she left an address, and that is the only channel you have. Her simulation arrives, with the link to resume it. She uploads the document over breakfast.',
      },
    },
    interno: {
      prodotto: 'percorso', scena: 'lavoro-05-orchestrazione',
      titolo: { it: 'Il percorso è partito dall’evento, non da una lista', en: 'The journey started from the event, not from a list' },
      corpo: {
        it: 'Nessuno ha costruito un’audience: si è mossa la sua simulazione. Il percorso aspetta dodici ore, prova la mail, e se non la apre la rimette in retargeting con la variante giusta. Dodici ore, non il ciclo di campagna del mese dopo.',
        en: 'Nobody built an audience: her simulation moved. The journey waits twelve hours, tries email, and if she does not open it puts her back into retargeting with the right variant. Twelve hours, not next month’s campaign cycle.',
      },
    },
  },
  {
    n: '06', of: '07',
    blocco: { it: 'AI Platform', en: 'AI platform' },
    ora: { it: 'Ore 11:30, due giorni dopo', en: '11:30 AM, two days later' },
    dove: { it: 'In filiale', en: 'In branch' },
    short: { it: 'In filiale', en: 'In branch' },
    funzione: { it: 'Il quadro si chiede', en: 'The briefing is asked for' },
    canale: { it: 'Filiale', en: 'Branch' },
    gruppo: 'piattaforma',
    verifica: { it: 'Oggi che cosa vede, di una persona non ancora cliente, chi riceve l’appuntamento?', en: 'Today, what does the person taking the appointment see about someone who is not yet a customer?' },
    prodotto: 'CX Enterprise Coworker',
    cliente: {
      chrome: 'filiale', scena: 'scena-06-filiale',
      titolo: { it: 'Non è ancora vostra cliente, e il gestore sa già tutto', en: 'She is not your customer yet, and the adviser already knows' },
      corpo: {
        it: 'Entra per l’appuntamento e trova la sua simulazione già aperta: stesso importo, stessa rata, stessi documenti. Non le viene chiesto di raccontare da capo quello che ha già fatto sul sito due sere prima.',
        en: 'She arrives for the appointment and finds her simulation already open: same amount, same instalment, same documents. She is not asked to retell what she already did on the site two evenings earlier.',
      },
    },
    interno: {
      prodotto: 'coworker', scena: 'lavoro-06-filiale-back',
      titolo: { it: 'Il quadro non si costruisce a mano: si chiede', en: 'The briefing is not built by hand: it is asked for' },
      corpo: {
        it: 'Di lei il CRM non ha una scheda, perché non è cliente. Quello che esiste è la traccia digitale delle ultime due sere. Chi riceve l’appuntamento scrive quello che gli serve e lo ottiene, senza dover usare sei strumenti.',
        en: 'The CRM has no record of her, because she is not a customer. What exists is the digital trail of the last two evenings. Whoever takes the appointment writes what they need and gets it, without having to use six tools.',
      },
    },
  },
  {
    n: '07', of: '07',
    blocco: { it: 'CX Analytics', en: 'CX analytics' },
    ora: { it: 'Tre settimane dopo', en: 'Three weeks later' },
    dove: { it: 'Qui diventa cliente', en: 'Here she becomes a customer' },
    short: { it: 'Firma', en: 'Signs' },
    funzione: { it: 'Quanto costa acquisirla', en: 'What acquiring her costs' },
    canale: { it: 'App', en: 'App' },
    gruppo: 'piattaforma',
    verifica: { it: 'Oggi sapete quale momento ha prodotto il cliente, o solo quanto ha reso il canale?', en: 'Today, do you know which moment produced the customer, or only what the channel returned?' },
    prodotto: 'Customer Journey Analytics',
    cliente: {
      chrome: 'app', scena: 'scena-07-casa',
      titolo: { it: 'Firma, e solo adesso scarica l’app', en: 'She signs, and only now downloads the app' },
      corpo: {
        it: 'Mutuo erogato. L’app le serve da oggi: prima non aveva motivo di averla, ed è il motivo per cui nei momenti precedenti non c’era. Da qui in avanti il canale è vostro, e la relazione comincia.',
        en: 'Mortgage granted. The app matters from today: before she had no reason to have it, which is why it was absent from the earlier moments. From here the channel is yours, and the relationship begins.',
      },
    },
    interno: {
      prodotto: 'misura', scena: 'lavoro-07-misura',
      titolo: { it: 'Dove si perde, e quanto è costato acquisirla', en: 'Where it leaks, and what it cost to acquire her' },
      corpo: {
        it: 'A che serve qui: manca una misura sola dall’assistente alla firma. Senza quella nessuno sa quale dei sette momenti ha prodotto la cliente, né su quale investire il mese dopo. Il numero che conta non è il tasso di apertura: è quanto costa acquisirla, e dove si perdono.',
        en: 'What it is for: there is no single measurement from the assistant to the signature. Without it nobody knows which of the seven moments produced the customer, or where to invest next month. The number that matters is not open rate: it is what she cost to acquire, and where others are lost.',
      },
    },
  },
];
