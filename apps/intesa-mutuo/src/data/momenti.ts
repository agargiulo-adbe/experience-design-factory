/**
 * I sei momenti di Giulia — fonte UNICA.
 *
 * Da qui leggono tre cose: l'elenco dei momenti sulla slide della persona,
 * le sei slide del capitolo «lato cliente» e le sei del capitolo «lato di
 * chi prepara». Tenere due copie a mano degli stessi momenti significa
 * farli divergere: è una certezza, non un rischio.
 *
 * La forma è quella della Storia di UniCredit, che funziona per una ragione
 * precisa: ogni momento ha un'ORA e un luogo. «Ore 21:40, sul divano» è una
 * scena; «il cliente cerca informazioni» è una riga di requisiti.
 *
 * `mockCliente` e `mockInterno` dicono quale schermo si vede a destra:
 * quello di Giulia o quello di chi prepara la campagna.
 */

export interface Momento {
  n: string;
  of: string;
  ora: { it: string; en: string };
  dove: { it: string; en: string };
  /** L'etichetta corta, per l'elenco dei sei passi sulla slide della persona. */
  short: { it: string; en: string };
  /** Lo sfondo generato di questa scena. */
  bg: string;
  cliente: {
    mock: 'ricerca' | 'simulazione' | 'documenti' | 'ripresa' | 'firma';
    titolo: { it: string; en: string };
    corpo: { it: string; en: string };
  };
  interno: {
    mock: 'misura' | 'profilo' | 'decisione' | 'percorso' | 'esito';
    titolo: { it: string; en: string };
    corpo: { it: string; en: string };
  };
}

export const MOMENTI: Momento[] = [
  {
    n: '01', of: '06', bg: 'cap-01',
    ora: { it: 'Ore 21:40, sul divano', en: '9:40 PM, on the sofa' },
    dove: { it: 'Prima del vostro sito', en: 'Before your site' },
    short: { it: 'Chiede', en: 'Asks' },
    cliente: {
      mock: 'ricerca',
      titolo: { it: 'Giulia non apre dieci siti. Apre una conversazione.', en: 'Giulia does not open ten sites. She opens one conversation.' },
      corpo: {
        it: '«Qual è il mutuo migliore per chi compra la prima casa?» La risposta arriva da un assistente, non da un motore di ricerca, e cita tre banche. Intesa Sanpaolo c’è, perché le sue schede prodotto sono scritte in modo che una macchina le sappia leggere.',
        en: '“Which mortgage is best for a first home?” The answer comes from an assistant, not a search engine, and it cites three banks. Intesa Sanpaolo is there, because its product pages are written so a machine can read them.',
      },
    },
    interno: {
      mock: 'misura',
      titolo: { it: 'Quel clic non assomiglia a nessun altro clic', en: 'That click looks like no other click' },
      corpo: {
        it: 'Arriva senza referral riconoscibile e il web analytics lo conta come traffico diretto. Separarlo si può, ma si legge dai log della CDN, non dallo strumento di analisi: è la prima cosa che chiediamo al vostro IT.',
        en: 'It arrives with no recognisable referral and web analytics counts it as direct traffic. It can be separated, but it is read from CDN logs, not from the analytics tool: that is the first thing we ask your IT.',
      },
    },
  },
  {
    n: '02', of: '06', bg: 'cap-02',
    ora: { it: 'Ore 21:48, ancora sul divano', en: '9:48 PM, still on the sofa' },
    dove: { it: 'In app', en: 'In the app' },
    short: { it: 'Simula', en: 'Simulates' },
    cliente: {
      mock: 'simulazione',
      titolo: { it: 'Simula il mutuo, e il numero la convince', en: 'She runs the simulation, and the number convinces her' },
      corpo: {
        it: '180.000 euro su venticinque anni: 742 euro al mese, con lo sconto riservato ai clienti. Salva la richiesta e si dice che domani carica i documenti. Per lei è una sera qualunque; per voi è il momento in cui smette di essere una visita e diventa una pratica.',
        en: '180,000 euro over twenty-five years: 742 a month, with the customer discount. She saves the application and tells herself she will upload the documents tomorrow. For her it is an ordinary evening; for you it is when a visit becomes an application.',
      },
    },
    interno: {
      mock: 'profilo',
      titolo: { it: 'Il profilo si aggiorna mentre lei è ancora in app', en: 'The profile updates while she is still in the app' },
      corpo: {
        it: 'Quattro tracce — app, sito, contact center, filiale — diventano una persona sola. Lo score di propensione resta quello del vostro motore: il profilo lo riceve e lo usa, non lo ricalcola. Nessun modello viene sostituito.',
        en: 'Four traces — app, site, call centre, branch — become one person. The propensity score stays your engine’s: the profile receives and uses it, it does not recompute it. No model is replaced.',
      },
    },
  },
  {
    n: '03', of: '06', bg: 'cap-03',
    ora: { it: 'Ore 22:05, la sera dopo', en: '10:05 PM, the next evening' },
    dove: { it: 'In app', en: 'In the app' },
    short: { it: 'Si ferma', en: 'Stalls' },
    cliente: {
      mock: 'documenti',
      titolo: { it: 'Le manca una busta paga, e chiude l’app', en: 'A payslip is missing, and she closes the app' },
      corpo: {
        it: 'Non ha cambiato idea: le serve un documento che non ha sottomano. Chiude, e si dice che ci pensa nel weekend. Da qui in avanti non succede niente, e non succede niente anche da parte vostra.',
        en: 'She has not changed her mind: she needs a document she does not have to hand. She closes the app, telling herself she will deal with it at the weekend. From here nothing happens — and nothing happens on your side either.',
      },
    },
    interno: {
      mock: 'decisione',
      titolo: { it: 'Cinque cose da dirle, e una sola può partire', en: 'Five things to tell her, and only one can go' },
      corpo: {
        it: 'I vostri modelli le hanno già assegnato cinque proposte: promemoria documenti, email con la simulazione, surroga, polizza casa, richiamo del gestore. Manca il posto dove si decide quale parte, su quale canale, e dentro il tetto di contatto.',
        en: 'Your models have already assigned her five proposals: document reminder, simulation email, remortgage, home cover, adviser call-back. What is missing is where to decide which one goes, on which channel, within the contact cap.',
      },
    },
  },
  {
    n: '04', of: '06', bg: 'cap-04',
    ora: { it: 'Ore 8:02, il mattino dopo', en: '8:02 AM, the next morning' },
    dove: { it: 'Notifica in app', en: 'App notification' },
    short: { it: 'Riprende', en: 'Resumes' },
    cliente: {
      mock: 'ripresa',
      titolo: { it: 'Una notifica, e riprende da dove era rimasta', en: 'One notification, and she picks up where she left off' },
      corpo: {
        it: '«La tua richiesta è ancora valida: manca solo la busta paga.» Non è una campagna: è una cosa che la riguarda, arrivata il giorno dopo e non a fine mese. Carica il documento mentre fa colazione.',  // copy-audit-ignore V1 — la frase fra virgolette è il messaggio che l'app manda A GIULIA, citato alla lettera: un'app parla al singolare, e riscriverlo al plurale lo renderebbe finto.
        en: '“Your application is still valid: only the payslip is missing.” Not a campaign: something that concerns her, arriving the next day and not at month end. She uploads the document over breakfast.',
      },
    },
    interno: {
      mock: 'percorso',
      titolo: { it: 'Il percorso è partito dall’evento, non da una lista', en: 'The journey started from the event, not from a list' },
      corpo: {
        it: 'Nessuno ha costruito un’audience: si è mossa la sua pratica. Il percorso aspetta dodici ore, prova la notifica, e solo se non basta passa all’email. Il tetto di contatto è un vincolo dell’offerta, valutato quando si decide.',
        en: 'Nobody built an audience: her application moved. The journey waits twelve hours, tries the notification, and only if that is not enough moves to email. The contact cap is a constraint on the offer, evaluated at decision time.',
      },
    },
  },
  {
    n: '05', of: '06', bg: 'cap-05',
    ora: { it: 'Ore 11:30, due giorni dopo', en: '11:30 AM, two days later' },
    dove: { it: 'In filiale', en: 'In branch' },
    short: { it: 'Il gestore', en: 'Adviser' },
    cliente: {
      mock: 'firma',
      titolo: { it: 'Il gestore sa già tutto, e lei non ripete niente', en: 'The adviser already knows, and she repeats nothing' },
      corpo: {
        it: 'Entra per l’appuntamento e trova la sua simulazione già aperta: stesso importo, stessa rata, stessi documenti. Non le viene chiesto di raccontare da capo quello che ha già fatto in app due sere prima.',
        en: 'She arrives for the appointment and finds her simulation already open: same amount, same instalment, same documents. She is not asked to retell what she already did in the app two evenings earlier.',
      },
    },
    interno: {
      mock: 'percorso',
      titolo: { it: 'Il CRM di filiale resta vostro, e riceve', en: 'The branch CRM stays yours, and receives' },
      corpo: {
        it: 'Niente viene sostituito: il CRM riceve l’evento e la proposta già pronta via API, e rimanda l’esito dell’incontro. È il punto di integrazione che chiediamo di validare per primo.',
        en: 'Nothing is replaced: the CRM receives the event and the ready-made proposal via API, and returns the meeting outcome. It is the integration point we ask to validate first.',
      },
    },
  },
  {
    n: '06', of: '06', bg: 'cap-06',
    ora: { it: 'Tre settimane dopo', en: 'Three weeks later' },
    dove: { it: 'Il giro si chiude', en: 'The loop closes' },
    short: { it: 'Firma', en: 'Signs' },
    cliente: {
      mock: 'firma',
      titolo: { it: 'Firma, e la relazione continua', en: 'She signs, and the relationship continues' },
      corpo: {
        it: 'Mutuo erogato. Fra un anno la polizza casa, poi forse il conto per la famiglia: proposte che arrivano quando servono a lei, non quando scade un trimestre. È la differenza fra una vendita e un cliente.',
        en: 'Mortgage granted. In a year the home cover, then perhaps a family account: proposals arriving when she needs them, not when a quarter closes. That is the difference between a sale and a customer.',
      },
    },
    interno: {
      mock: 'esito',
      titolo: { it: 'L’esito torna nella misura lo stesso giorno', en: 'The outcome returns into measurement the same day' },
      corpo: {
        it: 'Quale offerta è partita, su quale canale, a chi somigliava, e come è finita. Non un aggregato a campagna chiusa: il dato che serve alla decisione dopo. È qui che il giro si chiude, ed è l’anello che oggi manca.',
        en: 'Which offer went out, on which channel, who it resembled, and how it ended. Not a total once the campaign closes: the data the next decision needs. This is where the loop closes, and it is the link missing today.',
      },
    },
  },
];
