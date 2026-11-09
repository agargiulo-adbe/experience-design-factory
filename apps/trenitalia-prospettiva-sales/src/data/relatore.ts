/**
 * LE NOTE PER CHI PRESENTA.
 *
 * PER CHI È SCRITTA: un collega che apre questo deck **per la prima volta**,
 * un'ora prima di entrare in sala. Non sa niente del cliente, non era al dry
 * run, e deve poter reggere la conversazione. Quindi ogni voce dice tre cose e
 * nessuna in più: **come si apre la slide a voce**, **qual è il fatto e da dove
 * viene**, e **che cosa arriva se chiedono**.
 *
 * ⚠️ QUESTA PAGINA È PUBBLICA, come tutto il deck. Qui dentro non entra niente
 * che non sia già in slide o già pubblico: nessun dato di contratto, nessun
 * nome di persona, nessuna misura interna, nessuna indicazione su che cosa non
 * si nomina in quella stanza. Quella parte vive nel dossier riservato e si
 * legge prima, non da qui.
 *
 * ⚠️ NON SI SCRIVE A MANO QUELLO CHE È GIÀ NEI DATI. Titoli, numeri e fonti li
 * rende la pagina leggendo `slides.ts`, `chapters.ts` e `contenuti.ts`: qui
 * sta solo quello che un dato non può dire, cioè come lo si racconta. Se una
 * slide entra nel registro e non ha la sua nota, la pagina lo segnala in
 * chiaro invece di tacere.
 */

export interface NotaSlide {
  /** L'id della slide, lo stesso del registro in `slides.ts`. */
  id: string;
  /** Come si apre a voce. Una frase, quella che si dice davvero. */
  dire: string;
  /** Che cosa regge la slide, e da dove viene. Omesso dove la slide è un respiro. */
  fatto?: string;
  /** La domanda che arriva più spesso, e la risposta onesta. */
  seChiedono?: { d: string; r: string };
  /** Una cautela — solo se è già dichiarata in slide. */
  attenzione?: string;
}

/** Quanto dura un capitolo, in minuti, su un'ora piena. */
export const MINUTI: Record<string, number> = {
  apertura: 3, domanda: 6, ricerca: 13, viaggio: 13,
  contenuto: 8, rete: 5, rotta: 12,
};

/** Le tre cose che devono restare se il resto si perde. */
export const TRE_COSE: string[] = [
  'Quattro idee per ottimizzare le vendite, dalla ricerca del viaggio all’acquisto.',
  'Su tre delle quattro idee una parte della tecnologia è già nel loro contratto.',
  'Non chiediamo un progetto: la domanda è quali di queste idee sono priorità vostre.',
];

/** Che cosa si chiede, parola per parola. È anche l'ultima slide.
 *  ⚠️ 6 nov 2026, sera: la mezza giornata sui dati della rete agenzie è uscita
 *  dall'ask. Quella sessione è già intrinseca al lavoro che corre con il
 *  presidio digitale e con la società tecnologica del Gruppo, quindi a lui non
 *  chiede niente che non stia già succedendo. */
export const ASK_A_VOCE =
  'Tre cose: quali di queste quattro direzioni sono priorità vostre, che cosa non abbiamo visto, e la possibilità di offrirvi il nostro contributo nella pianificazione dell’offerta integrata.';

export const NOTE: Record<string, NotaSlide[]> = {
  index: [
    { id: 'slide-cover',
      dire: 'Un’ora, quattro idee per ottimizzare le vendite, e per ognuna i prodotti con cui realizzarla.',
      seChiedono: { d: 'È una proposta commerciale?', r: 'È una lettura del vostro anno fatta da fuori, con i prodotti che servirebbero. Non c’è un listino in queste pagine.' } },
    { id: 'slide-chi-siamo',
      dire: 'Chi siamo, che cosa copre Adobe dall’inizio alla fine, e il percorso fatto insieme dal 2017.',
      attenzione: 'Coworker è lo strato che attraversa le fasi: che cosa è attivo su quale prodotto si dice a voce. La tappa accesa è il 2026: il progetto di trasformazione del sito di FS Italiane.' },
  ],

  apertura: [
    { id: 'slide-cover', dire: 'Partiamo da quattro fatti che conoscete già: li mettiamo in fila per dire da dove nascono le idee.' },
    { id: 'slide-problemi',
      dire: 'Il territorio poco visitato, i mercati esteri, la concorrenza e il momento: nuovo sito e piano. Sono le premesse, e ci stiamo un minuto.',
      fatto: 'Il 75%/4% è un dato di contesto del TTG 2025, l’internazionalizzazione è una parola del Direttore Sales al TTG 2026, il sito di marzo 2027 è una sua dichiarazione. Fonti in slide.',
      attenzione: 'Il 75%/4% va detto come dato che circolava al TTG, mai come una sua dichiarazione.' },
  ],

  domanda: [
    { id: 'slide-domanda',
      dire: 'Il prezzo si muove già con la domanda. Allora come si ottimizzano le vendite?',
      attenzione: 'Qui si fa una pausa: è la domanda del documento.' },
    { id: 'slide-mappa',
      dire: 'Quattro idee, in ordine di percorso, e per ognuna che cosa avete già e che cosa si aggiunge.',
      seChiedono: { d: 'Che cosa cambia in ciascuna delle quattro idee?', r: 'Ogni idea ha il suo capitolo, raggiungibile dal nome.' } },
  ],

  ricerca: [
    { id: 'slide-cover', dire: 'Il primo punto sta prima di ogni vostra pagina. Ed è l’unico capitolo in cui portiamo una misura fatta da noi.' },
    { id: 'slide-campione',
      dire: 'Prima il campione: otto domande di viaggio, nessuna di marca, poste a due assistenti. Da qui vengono tutti i numeri che seguono.',
      fatto: 'Misura Adobe dell’11 e 12 ottobre 2026. Il metodo è in slide perché la prima cosa che si controlla è come è stata fatta la misura.',
      seChiedono: { d: 'Otto domande sono poche.', r: 'Sì, ed è scritto. Non è una statistica: è una fotografia ripetibile. L’offerta è rifarla insieme con le vostre domande.' } },
    { id: 'slide-idea',
      dire: 'Ne prendiamo una, la prima: come arrivo da Roma a Matera senza auto. Tutti e due gli assistenti AI aprono con gli operatori di autobus.',
      fatto: 'Tutti e due aprono con gli autobus e danno il combinato prima al concorrente. ChatGPT cita Freccialink dopo. La schermata riassume l’esito su ChatGPT.' },
    { id: 'slide-referto',
      dire: 'Su tutte e otto: su ChatGPT siete fra le fonti sette volte su otto, su Google due. E Google mette sullo stesso piano Frecciarossa, Italo, Trenitalia e Intercity, come fossero aziende in concorrenza.',
      attenzione: 'L’errore è dell’assistente, non loro: attribuirlo a «gli assistenti» in generale sarebbe falso, perché l’altro non sbaglia mai sulle otto.' },
    { id: 'slide-leva',
      dire: 'Non un intervento una tantum: molte domande, misurate spesso. Va tracciato il traffico, va distinto chi è una persona da chi è un agente, e così si governa la risposta. Poi c’è un secondo tempo: dove oggi vi citano, domani si potrebbe comprare.',
      attenzione: 'Sul secondo tempo basta dire che il presidio esiste, al condizionale: niente commissioni e accordi con le piattaforme, che sono ancora in divenire.',
      seChiedono: { d: 'È SEO?', r: 'No. La SEO ottimizza un posizionamento in un elenco; qui si lavora su che cosa un sistema generativo cita come fonte, e si misura.' } },
  ],

  viaggio: [
    { id: 'slide-cover', dire: 'Seconda idea: la personalizzazione su larga scala, prima chi non è registrato e poi chi lo è.' },
    { id: 'slide-idea',
      dire: 'Il punto è personalizzare su larga scala. Un cliente CartaFreccia Oro trova in homepage Matera e un vantaggio del suo livello. La combinazione esiste già, e con chi non è registrato si parte da posizione e navigazione.',
      fatto: 'Brightline è un operatore ferroviario ad alta velocità in Florida, con storia pubblica su prenotazione e personalizzazione.',
      attenzione: 'Il primo ↓ cambia la schermata da «prima» a «dopo». Si propone solo ciò che si può comprare: composizione, prezzo e acquisto restano nei loro sistemi. Il Freccialink oggi non si aggiunge a un Frecciarossa già acquistato. Non aprire il tema del pop-up di geolocalizzazione, se non lo aprono loro.' },
    { id: 'slide-momenti',
      dire: 'Si comincia da chi non è registrato, con posizione, navigazione e cookie, dove c’è il consenso. Con il nuovo CRM si aggiunge la storia del cliente. E la proposta deve sapere quando fermarsi.',
      attenzione: 'Se chiedono di CartaFreccia dopo la fine del 2026: la logica per livello vale per qualunque programma fedeltà. I tempi del nuovo CRM li dice il cliente, non noi.',
      seChiedono: { d: 'E la geolocalizzazione?', r: 'Si apre la pagina /appendice/: una slide, solo perimetro e che cosa dimostra, senza numeri.' } },
    { id: 'slide-prima',
      dire: 'La personalizzazione comincia prima, e altrove. Chi ha prenotato una crociera da Genova sta ancora decidendo come arrivarci: conoscendolo, gli si fa una proposta vantaggiosa prima del confronto con Italo.',
      fatto: 'Il protocollo con Costa Crociere presentato al TTG il 15 ottobre 2026: è il caso da cui partire perché ha una data ed è loro.' },
    { id: 'slide-collab',
      dire: 'Si lavora in due sugli stessi viaggiatori senza scambiarsi i dati: si incrocia solo chi interessa a entrambe le aziende.',
      seChiedono: { d: 'Dobbiamo consegnare la nostra base clienti?', r: 'No: gli elenchi si incrociano in un ambiente neutro, con controlli di accesso dichiarati da tutte e due le aziende. Titolarità e base giuridica si definiscono prima.' } },
  ],

  contenuto: [
    { id: 'slide-cover', dire: 'Terza idea, a valle: la squadra è una e i prodotti sono tre.' },
    { id: 'slide-idea',
      dire: 'Una campagna approvata una volta, e da lì le varianti per mercato: per chi arriva dall’estero il messaggio si fa più commerciale.',
      // ⚠️ 6 nov 2026: la riga diceva «la validazione lavora in inglese», ed
      // è falsa — le note di rilascio dichiarano 12 lingue in disponibilità
      // generale più 5 in beta. Era un limite inventato a nostro danno, e
      // stava in slide come prova di onestà.
      attenzione: 'Il primo ↓ cambia la schermata dalla campagna alle versioni per mercato. Non si vende la traduzione: non è una priorità, e non si propone lo stesso sito copiato in ogni paese. Content Analytics scompone i contenuti solo in inglese: se si parla di mercati esteri va detto.' },
    { id: 'slide-unposto',
      dire: 'Ogni campagna si crea, si approva, si adatta e si misura nello stesso strumento. Qui sotto i prodotti: quali avete e che cosa fa ognuno.',
      seChiedono: { d: 'Vuol dire sostituire l’agenzia creativa?', r: 'No. La campagna resta loro, e le versioni smettono di essere lavoro a mano.' } },
  ],

  rete: [
    { id: 'slide-cover', dire: 'Ultimo punto, e lo diciamo subito: è tutto da approfondire.' },
    { id: 'slide-idea',
      dire: 'Il venduto per agenzia lo avete già. L’ipotesi è legarlo a ciò che succede prima sul digitale, come fa Unipol nel suo settore.',
      fatto: 'Unipol misura sito, app e agenzie insieme. Settore diverso, e si dice.',
      attenzione: 'Nessun numero di agenzie. Le agenzie fisiche vendono su un sistema diverso dal sito, quindi è un’ipotesi. Le agenzie online restano fuori: non si dice a loro come vendere. Il codice è di campagna, non della persona: dà totali per codice, e solo se il sistema delle agenzie lo registra. Lo username al banco non esiste. CartaFreccia legherebbe la persona, ma va verificato che la vendita in agenzia la registri. Una locandina non genera eventi: si misura solo con un codice o un QR per materiale. Il tracciamento del personale va visto con i legali.',
      // ⚠️ 9 nov 2026: la frase di prima lasciava intendere che bastasse far
      // arrivare i consensi su Experience Platform. La documentazione chiede
      // Shield e un dataset Profile già popolato, e Customer Journey Analytics
      // legge soltanto: non sposta né riconcilia.
      seChiedono: { d: 'E i consensi fra le due piattaforme?', r: 'Customer Journey Analytics non li sposta e non li riconcilia. Con Privacy & Security Shield può riportare e filtrare i consensi già consolidati sul Profilo di Experience Platform. Prima va capito quale consenso si deve spostare e quale sistema fa fede: è un lavoro da disegnare con FS Technology.' } },
  ],

  rotta: [
    { id: 'slide-cover', dire: 'Quattro direzioni sono troppe per aprirle tutte. Quali sono le vostre, e quando se ne parla.' },
    { id: 'slide-ripresa',
      dire: 'Ecco le quattro idee di nuovo: le capacità da avere, e i prodotti. Su tre delle quattro una parte è già in casa vostra.',
      attenzione: 'È il momento in cui si tace e si lascia guardare la slide. La domanda in titolo è per loro.' },
    { id: 'slide-tempi',
      dire: 'Una possibile sequenza: prima quello che si può avviare subito, poi quello che dipende da nuovo CRM e sistemi di vendita. Si riordina con voi.',
      attenzione: 'Nessuna data del nuovo CRM: la dice il cliente. L’esperienza unica è un obiettivo di lungo periodo, da costruire con FS Technology.' },
    { id: 'slide-signature', dire: 'Grazie. Il link resta vostro: il percorso intero è nel menu, e c’è anche una versione da dieci minuti.' },
  ],

  appendice: [
    { id: 'slide-citta',
      dire: 'Una proposta legata alla città di provenienza, costruita e pubblicata dal vostro team.',
      attenzione: 'Si apre solo se lo chiedono. Solo perimetro e che cosa dimostra, nessun risultato: se qualcuno in sala vuole raccontarli, la parola è sua.' },
  ],

  'dieci-minuti': [
    { id: 'slide-cover',
      dire: 'Se l’ora diventa venti minuti si apre questa: stesse fonti, stessi numeri, poche slide e una possibile sequenza.',
      attenzione: 'È anche la versione che l’interlocutore gira al suo capo, e si legge senza nessuno accanto: per questo porta la riga del confine e non l’elenco dei prodotti.' },
    { id: 'slide-problemi', dire: 'Quattro fatti e le date, in un minuto.' },
    { id: 'slide-domanda', dire: 'La domanda. Identica al percorso intero, parola per parola.' },
    { id: 'slide-mappa', dire: 'Le quattro idee, con una riga ciascuna.' },
    { id: 'slide-contributi', dire: 'Le quattro idee e che cosa bisogna saper fare. I prodotti stanno nel percorso intero.' },
    { id: 'slide-tempi', dire: 'Prima quello che si può avviare subito, poi quello che dipende da altri sistemi.' },
    { id: 'slide-signature', dire: 'Chiusura.' },
  ],
};

/** La nota di una slide, se c'è. */
export function nota(slug: string, id: string): NotaSlide | undefined {
  return NOTE[slug]?.find((n) => n.id === id);
}
