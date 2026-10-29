/**
 * I sette momenti di Giulia — fonte UNICA.
 *
 * Da qui leggono: l'elenco dei passi sulla slide della persona, le sette
 * slide del capitolo «lato cliente» e le sette del capitolo «lato di chi
 * prepara». Due copie a mano degli stessi momenti divergono, sempre.
 *
 * ── Perché sette e non sei ────────────────────────────────────────────
 * Perché la Storia deve coprire TUTTO lo spettro dell'offerta, non solo il
 * blocco dell'engagement. La versione precedente raccontava profilo,
 * decisione e misura, e lasciava fuori due cose che sono un terzo della
 * proposta: Content Factory (GenStudio) e l'AI Platform (Coworker).
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
 *
 * `chrome` e `prodotto` scelgono lo SCHERMO: un'app, un assistente, un
 * feed e un sistema di filiale non si somigliano, e sette schermi uguali
 * di fila si leggono come un elenco.
 */

export type ChromeCliente = 'assistente' | 'feed' | 'app' | 'filiale';
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

export const MOMENTI: Momento[] = [
  {
    n: '01', of: '07',
    blocco: { it: 'Farsi trovare', en: 'Brand visibility' },
    ora: { it: 'Ore 21:40, sul divano', en: '9:40 PM, on the sofa' },
    dove: { it: 'Prima del vostro sito', en: 'Before your site' },
    short: { it: 'Chiede', en: 'Asks' },
    cliente: {
      chrome: 'assistente', scena: 'scena-01-divano',
      titolo: { it: 'Non apre dieci siti. Apre una conversazione.', en: 'She does not open ten sites. She opens one conversation.' },
      corpo: {
        it: '«Qual è il mutuo migliore per chi compra la prima casa?» La risposta arriva da un assistente e cita tre banche. Intesa Sanpaolo c’è, e non per fortuna: le sue schede prodotto sono scritte in modo che una macchina le sappia leggere.',
        en: '“Which mortgage is best for a first home?” The answer comes from an assistant and cites three banks. Intesa Sanpaolo is there, and not by luck: its product pages are written so a machine can read them.',
      },
    },
    interno: {
      prodotto: 'visibilita', scena: 'lavoro-01-ricerca',
      titolo: { it: 'Dove compare il marchio, e dove no', en: 'Where the brand shows up, and where it does not' },
      corpo: {
        it: 'Su otto domande che contano, la banca è citata in tre. Non è un’impressione: si misura domanda per domanda, e si lavora sul contenuto che l’assistente non riesce a leggere.',
        en: 'Across eight questions that matter, the bank is cited in three. Not an impression: it is measured question by question, and you work on the content the assistant cannot read.',
      },
    },
  },
  {
    n: '02', of: '07',
    blocco: { it: 'Content Factory', en: 'Content supply chain' },
    ora: { it: 'Il mattino dopo, al bar', en: 'Next morning, at the café' },
    dove: { it: 'Nel suo feed', en: 'In her feed' },
    short: { it: 'Riconosce', en: 'Recognises' },
    cliente: {
      chrome: 'feed', scena: 'scena-02-bar',
      titolo: { it: 'Il messaggio parla la sua lingua, non quella di tutti', en: 'The message speaks her language, not everyone’s' },
      corpo: {
        it: 'Fra un caffè e il tram compare un annuncio: «Il mutuo per la prima casa, a Torino». Non è la campagna per tutti: è la variante per chi compra la prima casa nella sua città, una delle dodici nate da un brief solo.',
        en: 'Between a coffee and the tram an ad appears: “First-home mortgage, in Turin.” Not the campaign for everyone: it is the variant for first-home buyers in her city, one of twelve born from a single brief.',
      },
    },
    interno: {
      prodotto: 'genstudio', scena: 'lavoro-02-contenuti',
      titolo: { it: 'Dodici varianti da un brief, già conformi', en: 'Twelve variants from one brief, already compliant' },
      corpo: {
        it: 'Il tempo non se ne va nel produrle: se ne va nell’approvarle. Qui le informative obbligatorie e i vincoli di marchio sono applicati per costruzione, e quello che esce ha già passato il controllo.',
        en: 'Time is not spent producing them: it is spent approving them. Here mandatory disclosures and brand rules are applied by construction, and what comes out has already passed review.',
      },
    },
  },
  {
    n: '03', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'Ore 21:48, a casa', en: '9:48 PM, at home' },
    dove: { it: 'In app', en: 'In the app' },
    short: { it: 'Simula', en: 'Simulates' },
    cliente: {
      chrome: 'app', scena: 'scena-03-tavolo',
      titolo: { it: 'Simula il mutuo, e il numero la convince', en: 'She runs the simulation, and the number convinces her' },
      corpo: {
        it: '180.000 euro su venticinque anni: 742 al mese, con lo sconto riservato ai clienti. Salva la richiesta e si dice che domani carica i documenti. Per lei è una sera qualunque; per voi è il momento in cui una visita diventa una pratica.',
        en: '180,000 euro over twenty-five years: 742 a month, with the customer discount. She saves the application and tells herself she will upload the documents tomorrow. For her an ordinary evening; for you, when a visit becomes an application.',
      },
    },
    interno: {
      prodotto: 'profilo', scena: 'lavoro-03-dati',
      titolo: { it: 'Il profilo si aggiorna mentre lei è ancora in app', en: 'The profile updates while she is still in the app' },
      corpo: {
        it: 'Quattro tracce — app, sito, contact center, filiale — diventano una persona sola. Lo score di propensione resta quello del vostro motore: il profilo lo riceve e lo usa, non lo ricalcola. Nessun modello viene sostituito.',
        en: 'Four traces — app, site, call centre, branch — become one person. The propensity score stays your engine’s: the profile receives and uses it, it does not recompute it. No model is replaced.',
      },
    },
  },
  {
    n: '04', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'Ore 22:05, la sera dopo', en: '10:05 PM, the next evening' },
    dove: { it: 'In app', en: 'In the app' },
    short: { it: 'Si ferma', en: 'Stalls' },
    cliente: {
      chrome: 'app', scena: 'scena-04-documenti',
      titolo: { it: 'Le manca una busta paga, e chiude l’app', en: 'A payslip is missing, and she closes the app' },
      corpo: {
        it: 'Non ha cambiato idea: le serve un documento che non ha sottomano. Chiude, e si dice che ci pensa nel weekend. Da qui in avanti non succede niente — e non succede niente neanche da parte vostra.',
        en: 'She has not changed her mind: she needs a document she does not have to hand. She closes the app, telling herself she will deal with it at the weekend. From here nothing happens — and nothing happens on your side either.',
      },
    },
    interno: {
      prodotto: 'decisione', scena: 'lavoro-04-decisione',
      titolo: { it: 'Cinque cose da dirle, e una sola può partire', en: 'Five things to tell her, and only one can go' },
      corpo: {
        it: 'I vostri modelli le hanno già assegnato cinque proposte. Manca il posto dove si decide quale parte, su quale canale, e dentro il tetto di contatto — valutato quando si decide, non applicato dopo in attivazione.',
        en: 'Your models have already assigned her five proposals. What is missing is where to choose which one goes, on which channel, and within the contact cap — evaluated at decision time, not applied later at activation.',
      },
    },
  },
  {
    n: '05', of: '07',
    blocco: { it: 'Customer Engagement', en: 'Customer engagement' },
    ora: { it: 'Ore 8:02, il mattino dopo', en: '8:02 AM, the next morning' },
    dove: { it: 'Notifica in app', en: 'App notification' },
    short: { it: 'Riprende', en: 'Resumes' },
    cliente: {
      chrome: 'app', scena: 'scena-05-colazione',
      titolo: { it: 'Una notifica, e riprende da dove era rimasta', en: 'One notification, and she picks up where she left off' },
      corpo: {
        it: 'Non è una campagna: è una cosa che la riguarda, arrivata il giorno dopo e non a fine mese. Carica il documento mentre fa colazione, e prenota l’appuntamento in filiale.',
        en: 'Not a campaign: something that concerns her, arriving the next day and not at month end. She uploads the document over breakfast, and books the branch appointment.',
      },
    },
    interno: {
      prodotto: 'percorso', scena: 'lavoro-05-orchestrazione',
      titolo: { it: 'Il percorso è partito dall’evento, non da una lista', en: 'The journey started from the event, not from a list' },
      corpo: {
        it: 'Nessuno ha costruito un’audience: si è mossa la sua pratica. Il percorso aspetta dodici ore, prova la notifica, e solo se non basta passa all’email. La stessa regia vale su app, email, sito e contact center.',
        en: 'Nobody built an audience: her application moved. The journey waits twelve hours, tries the notification, and only if that is not enough moves to email. The same orchestration covers app, email, site and call centre.',
      },
    },
  },
  {
    n: '06', of: '07',
    blocco: { it: 'AI Platform', en: 'AI platform' },
    ora: { it: 'Ore 11:30, due giorni dopo', en: '11:30 AM, two days later' },
    dove: { it: 'In filiale', en: 'In branch' },
    short: { it: 'Il gestore', en: 'Adviser' },
    cliente: {
      chrome: 'filiale', scena: 'scena-06-filiale',
      titolo: { it: 'Il gestore sa già tutto, e lei non ripete niente', en: 'The adviser already knows, and she repeats nothing' },
      corpo: {
        it: 'Entra per l’appuntamento e trova la sua simulazione già aperta: stesso importo, stessa rata, stessi documenti. Non le viene chiesto di raccontare da capo quello che ha già fatto in app due sere prima.',
        en: 'She arrives for the appointment and finds her simulation already open: same amount, same instalment, same documents. She is not asked to retell what she already did in the app two evenings earlier.',
      },
    },
    interno: {
      prodotto: 'coworker', scena: 'lavoro-06-filiale-back',
      titolo: { it: 'Il quadro non si costruisce a mano: si chiede', en: 'The briefing is not built by hand: it is asked for' },
      corpo: {
        it: '«Preparami il quadro di questa cliente per le 11.» Chi riceve l’appuntamento non deve sapere usare sei strumenti: scrive quello che gli serve e lo ottiene. Il CRM di filiale resta vostro e riceve il risultato via API.',
        en: '“Prepare this customer’s briefing for 11.” Whoever takes the appointment does not need to master six tools: they write what they need and get it. The branch CRM stays yours and receives the result via API.',
      },
    },
  },
  {
    n: '07', of: '07',
    blocco: { it: 'CX Analytics', en: 'CX analytics' },
    ora: { it: 'Tre settimane dopo', en: 'Three weeks later' },
    dove: { it: 'Il giro si chiude', en: 'The loop closes' },
    short: { it: 'Firma', en: 'Signs' },
    cliente: {
      chrome: 'app', scena: 'scena-07-casa',
      titolo: { it: 'Firma, e la relazione continua', en: 'She signs, and the relationship continues' },
      corpo: {
        it: 'Mutuo erogato. Fra un anno la polizza casa, poi forse il conto per la famiglia: proposte che arrivano quando servono a lei, non quando scade un trimestre. È la differenza fra una vendita e un cliente.',
        en: 'Mortgage granted. In a year the home cover, then perhaps a family account: proposals arriving when she needs them, not when a quarter closes. That is the difference between a sale and a customer.',
      },
    },
    interno: {
      prodotto: 'misura', scena: 'lavoro-07-misura',
      titolo: { it: 'Dove si perde, e quanto è costato recuperarla', en: 'Where it leaks, and what it cost to recover her' },
      corpo: {
        it: 'Il percorso intero in una misura sola — assistente, feed, app, filiale — e l’esito che rientra lo stesso giorno. Non un aggregato a campagna chiusa: il dato che serve alla decisione dopo.',
        en: 'The whole path in one measurement — assistant, feed, app, branch — and the outcome returning the same day. Not a total once the campaign closes: the data the next decision needs.',
      },
    },
  },
];
