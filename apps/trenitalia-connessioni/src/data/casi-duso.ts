/**
 * I casi d'uso, in un posto solo.
 *
 * PERCHÉ ESISTE QUESTA SEZIONE
 * Chiesta dal Direttore dei canali digitali il 27 ottobre 2026: un quadro di
 * quattro o cinque casi d'uso importanti, con l'obiettivo dichiarato di
 * vendere di più. Nella stessa riunione ha posto due volte lo stesso vincolo
 * — non vuole comprare la tecnologia e doversi poi costruire tutto da solo —
 * ed è il motivo per cui ogni caso qui porta anche il lato di chi lo prepara.
 *
 * L'ORDINE NON È CASUALE: è il suo schema, non il nostro. Nella stessa
 * riunione ha descritto due sole strade per vendere di più — far entrare più
 * persone nel negozio, oppure convertire meglio chi è già entrato. Quindi i
 * casi si raggruppano in `leva`: `conversione` e `traffico`.
 *
 * I DUE PERIMETRI
 * Il responsabile della piattaforma dati ha ristretto il perimetro il 9 ottobre
 * a **trenitalia.com + CRM**; il Direttore il 27 lo ha allargato a **T-com,
 * Le Frecce, app e CRM**, con una ragione: i clienti non iscritti al CRM sono
 * circa la metà, e restringere il perimetro li taglierebbe fuori tutti.
 * Il deck non sceglie: ogni caso dichiara le fonti che richiede, e la figura
 * accende o spegne quelle fuori perimetro. Così la stessa pagina dice a uno
 * che cosa guadagnerebbe allargando e all'altro che cosa perde restringendo.
 */

/** Le fonti che un caso d'uso può richiedere. L'ordine è quello della figura. */
export type Fonte = 'tcom' | 'frecce' | 'app' | 'crm' | 'terzi';

export const FONTI: { id: Fonte; nome: string; nota: string; ristretto: boolean }[] = [
  { id: 'tcom', nome: 'trenitalia.com', nota: 'Adobe Analytics', ristretto: true },
  { id: 'frecce', nome: 'Le Frecce', nota: 'Adobe Analytics', ristretto: false },
  { id: 'app', nome: 'App', nota: 'la parte più grande del traffico', ristretto: false },
  { id: 'crm', nome: 'CRM', nota: 'in costruzione, fornitore di dati', ristretto: true },
  { id: 'terzi', nome: 'Società del gruppo e partner', nota: 'in clean room', ristretto: false },
];

/** Il perimetro ristretto: le fonti della prima fase concordata il 9 ottobre. */
export const RISTRETTO: Fonte[] = FONTI.filter((f) => f.ristretto).map((f) => f.id);

/**
 * Un gesto e il prodotto che lo esegue. `skill` è il nome della skill di
 * Coworker che lo copre: non è un'etichetta nostra, è quello che la
 * documentazione pubblica elenca (vedi FONTI_COWORKER in fondo al file).
 */
export interface Passo {
  t: string;
  dove: 'CJA' | 'Target';
  skill: string;
}

export interface Caso {
  id: string;
  /** La leva di vendita, con le sue parole: più gente dentro, o conversione migliore. */
  leva: 'conversione' | 'traffico';
  /** Il nome del caso. Sei parole al massimo: è un'ancora. */
  titolo: string;
  /** Una riga: che cosa cambia. */
  punto: string;
  /** Com'è oggi — e dove possibile sono parole loro, non nostre. */
  oggi: string;
  /** Che cosa vede il viaggiatore. È il lato visibile. */
  viaggiatore: string;
  /** Che cosa fa chi lavora in marketing. È il lato che decide se la cosa esiste. */
  marketer: string;
  /** Le fonti che servono: decidono se il caso sta dentro il perimetro ristretto. */
  fonti: Fonte[];
  /**
   * La sessione con Coworker: chi parla e che cosa dice. Alternata, perché è
   * una conversazione e non un elenco di gesti — ed è la scena `data-converse`
   * del motore, che fa comparire le bolle una alla volta dai due lati.
   */
  conversazione: { chi: 'utente' | 'coworker'; t: string }[];
  /**
   * Le informazioni di profilo che decidono che cosa viene mostrato. Tre,
   * perché il punto è «da questi tre attributi discende quella variante», non
   * fare l'inventario del profilo. Scena `data-clienteling`.
   */
  profilo: { k: string; v: string }[];
  /**
   * Le varianti in gioco: quello che vedrebbero profili diversi. Una sola
   * corrisponde a questo profilo e si afferma, le altre si smorzano — scena
   * `data-personalize`. Senza le alternative, «personalizzato» è una parola.
   */
  varianti: { t: string; n: string; match?: true }[];
  /** Che cosa aggiunge CJA fra la fonte grezza e l'attivazione. Una riga. */
  arricchimento: string;
  /**
   * Che cosa si vede davvero sulla pagina. Non è decorazione: un mockup di
   * rettangoli grigi fa vedere che «qualcosa cambia» e non dice che cosa, che
   * è esattamente la metà che a chi decide non interessa.
   */
  schermo: {
    /** La barra dell'indirizzo: dove succede. */
    dove: string;
    /** La riga che compare perché il gruppo è stato riconosciuto. */
    titolo: string;
    /** Le tessere che cambiano: una cosa e la sua cifra. */
    tessere: { t: string; n: string }[];
  };
  /**
   * La frase che chi lavora in marketing SCRIVE, in italiano, dentro Coworker
   * Chat. È il punto su cui il Direttore dei canali digitali si è fermato due
   * volte, quando dice che non vuole ritrovarsi lo strumento senza saperlo
   * usare: la risposta non è un corso, è che il gruppo e il test si chiedono
   * a parole.
   */
  chiesta: string;
  /**
   * I tre gesti, ciascuno col prodotto che lo esegue. Sono tre e non quattro
   * perché il quarto nessuno se lo ricorda, e il terzo — la misura — è quello
   * che rende la cosa una prova e non una scommessa.
   */
  passi: [Passo, Passo, Passo];
  /**
   * I KPI su cui il caso agisce. Tre, nel vocabolario di chi li guarda: sono
   * la risposta alla domanda «e questo che cosa muove?», che arriva sempre e
   * che un elenco di funzionalità non soddisfa.
   */
  kpi: [string, string, string];
  /**
   * Chi l'ha già fatto, e con che numero. La prova è PUBBLICA e il numero è
   * verbatim dalla pagina: se non si può citare col nome, non entra qui — si
   * racconta a voce. Volutamente fuori dal trasporto: non è stato chiesto un
   * concorrente, è stato chiesto che funzioni.
   *
   * Le fonti sono due, verificate il 28 ott 2026 aprendo ogni pagina:
   * **Telmore** (telco danese, 750.000 clienti) e **Santander** (banca). Il
   * numero di ciascun caso è quello che misura DAVVERO quella cosa, non il più
   * grosso disponibile: i banner personalizzati stanno sul caso della home, le
   * vendite incrociate sull'upgrade, il carrello abbandonato su chi torna, il
   * riconoscimento sui due casi che dipendono dal riconoscere.
   */
  prova: { chi: string; settore: string; v: string; l: string; url: string };
  /** Chi l'ha messo sul tavolo: `cliente` pesa molto più di `adobe`. */
  origine: 'cliente' | 'adobe';
}

export const CASI: Caso[] = [
  {
    id: 'geo',
    leva: 'conversione',
    titolo: 'La home sa da dove parti',
    punto: 'Chi arriva da Verona vede le tratte da Verona, non la pagina di tutti.',
    // Esempio portato da loro il 27 ott: chi si collega da Verona dovrebbe
    // trovare in homepage i principali collegamenti da Verona, con le fasce di
    // prezzo. Le cifre qui sotto sono quelle dell'esempio, dichiarate
    // illustrative nella slide della matrice.
    oggi: 'Oggi si fa con un pop-up sopra la pagina, e la richiesta loro è che siano i componenti ad adattarsi da soli.',
    viaggiatore: 'La prima schermata porta le tratte che partono da dove si trova, con le fasce di prezzo.',
    marketer: 'Una regola per area di partenza, e un elenco di tratte pronte da abbinare. Si prepara una volta e vale per tutte le città.',
    conversazione: [
      { chi: 'utente', t: 'Crea un gruppo per chi si collega dall’area di Verona e mostragli le tratte più prenotate da lì.' },
      { chi: 'coworker', t: 'Gruppo costruito su trenitalia.com e Le Frecce. Lo porto su Target?' },
      { chi: 'utente', t: 'Sì, in cima alla home, con la fascia di prezzo.' },
      { chi: 'coworker', t: 'Attività pronta. Due settimane di prova, poi ship, wait o stop.' },
    ],
    profilo: [
      { k: 'Area', v: 'Verona' },
      { k: 'Dispositivo', v: 'app' },
      { k: 'Ultima ricerca', v: 'Milano' },
    ],
    varianti: [
      { t: 'La pagina di tutti', n: 'offerta nazionale' },
      { t: 'Le tratte da Verona', n: 'da 19 €', match: true },
      { t: 'Promozione generica', n: '−10%' },
    ],
    arricchimento: 'area di partenza e tratte più prenotate da lì',
    schermo: {
      dove: 'trenitalia.com',
      titolo: 'Da Verona Porta Nuova',
      tessere: [
        { t: 'Milano Centrale', n: 'da 19 €' },
        { t: 'Venezia Santa Lucia', n: 'da 29 €' },
        { t: 'Roma Termini', n: 'da 39 €' },
      ],
    },
    chiesta: 'Crea un gruppo per chi si collega dall’area di Verona e mostragli in cima le tratte più prenotate da lì, con la fascia di prezzo.',
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: chi si collega da una certa area', dove: 'Target', skill: 'target-audience-composer' },
      { t: 'Che cosa vede: le tratte da quella stazione', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti arrivano all’acquisto', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Conversione della home', 'Prosecuzione fino alla ricerca', 'Ricavo per visita'],
    prova: { chi: 'Telmore', settore: 'telco', v: '+11%', l: 'le vendite dai banner personalizzati', url: 'https://business.adobe.com/customer-success-stories/telmore-case-study.html' },
    origine: 'cliente',
  },
  {
    id: 'upgrade',
    leva: 'conversione',
    titolo: 'L’upgrade che oggi si offre a tutti',
    punto: 'La stessa proposta, fatta a chi ha davvero motivo di accettarla.',
    // Dalla sintesi d'account del 27 ott: oggi la proposta di passaggio a
    // classe superiore, a costo zero o marginale, va a tutti i viaggiatori e
    // non su base propensione.
    oggi: 'Il passaggio di classe si propone a tutti i viaggiatori, non a chi ha propensione a prenderlo.',
    viaggiatore: 'Chi viaggia sempre in Standard trova la Business al prezzo della Standard, per ventiquattr’ore.',
    marketer: 'Il segmento esce dalla vista unica, sempre Standard e alta frequenza, e diventa un’offerta a tempo su treni scelti.',
    conversazione: [
      { chi: 'utente', t: 'Chi viaggia sempre in Standard almeno due volte al mese: proponi la Business allo stesso prezzo.' },
      { chi: 'coworker', t: 'Trovato il gruppo. Lo limito ai treni che partono con posti liberi?' },
      { chi: 'utente', t: 'Sì, e l’offerta vale ventiquattr’ore.' },
      { chi: 'coworker', t: 'Attiva su Target. Misuro le salite di classe e ti dico quando decidere.' },
    ],
    profilo: [
      { k: 'Classe abituale', v: 'Standard' },
      { k: 'Viaggi', v: '2 al mese' },
      { k: 'Treno scelto', v: 'posti liberi' },
    ],
    varianti: [
      { t: 'Sconto del 10%', n: 'su tutto' },
      { t: 'Business allo stesso prezzo', n: '49 €', match: true },
      { t: 'Nessuna proposta', n: '—' },
    ],
    arricchimento: 'frequenza di viaggio e classe abituale',
    schermo: {
      dove: 'trenitalia.com · il tuo viaggio', // copy-audit-ignore — etichetta d'interfaccia dentro il mock, non voce del deck
      titolo: 'Business al prezzo della Standard',
      tessere: [
        { t: 'Standard, il suo solito', n: '49 €' },
        { t: 'Business, oggi', n: '49 €' },
        { t: 'Resta valida', n: '24 ore' },
      ],
    },
    chiesta: 'Chi viaggia sempre in Standard almeno due volte al mese: proponi la Business allo stesso prezzo sui treni che partono con posti liberi, per ventiquattr’ore.',
    fonti: ['tcom', 'crm'],
    passi: [
      { t: 'Il gruppo: sempre Standard, alta frequenza', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: la Business allo stesso prezzo', dove: 'Target', skill: 'target-design' },
      { t: 'La misura: quante salite di classe in più', dove: 'CJA', skill: 'target-test-calculator' },
    ],
    kpi: ['Quota di passaggi di classe', 'Ricavo medio per biglietto', 'Posti premium venduti'],
    prova: { chi: 'Telmore', settore: 'telco', v: '+25%', l: 'le vendite incrociate ai clienti già acquisiti', url: 'https://business.adobe.com/customer-success-stories/telmore-case-study.html' },
    origine: 'cliente',
  },
  {
    id: 'ritorno',
    leva: 'conversione',
    titolo: 'Chi torna senza dire chi è',
    punto: 'Metà del traffico non è registrato, e oggi riparte da zero ogni volta.',
    oggi: 'Le vendite sono per metà di clienti iscritti e per metà no. Chi torna senza login riparte dalla pagina di chiunque.',
    viaggiatore: 'Chi era già passato ritrova in evidenza la tratta che aveva cercato, senza aver fatto login.',
    marketer: 'Un gruppo costruito sul comportamento invece che sull’anagrafica: ultima ricerca, frequenza, giorno della settimana.',
    conversazione: [
      { chi: 'utente', t: 'Chi è già passato negli ultimi sette giorni e non ha fatto login: rimetti in cima la tratta che cercava.' },
      { chi: 'coworker', t: 'Il gruppo esiste anche senza anagrafica: lo costruisco sul comportamento.' },
      { chi: 'utente', t: 'Procedi, e misura quanti tornano e comprano.' },
      { chi: 'coworker', t: 'Fatto. Con questo traffico la lettura è affidabile in due settimane.' },
    ],
    profilo: [
      { k: 'Login', v: 'no' },
      { k: 'Ultima ricerca', v: 'Bologna → Firenze' },
      { k: 'Giorni dall’ultima visita', v: '2' },
    ],
    varianti: [
      { t: 'La home di chiunque', n: 'partenza vuota' },
      { t: 'La tratta che cercava', n: 'Bologna → Firenze', match: true },
      { t: 'Promozione generica', n: '−10%' },
    ],
    arricchimento: 'ultima ricerca e frequenza, senza bisogno del login',
    schermo: {
      dove: 'trenitalia.com',
      titolo: 'Riprendi da dove eri',
      tessere: [
        { t: 'Bologna → Firenze', n: 'cercata ieri' },
        { t: 'Partenza che guardava', n: '07:35' },
        { t: 'Posti ancora liberi', n: '12' },
      ],
    },
    chiesta: 'Chi è già passato negli ultimi sette giorni e non ha fatto login: rimetti in cima l’ultima tratta che aveva cercato.',
    fonti: ['tcom', 'app'],
    passi: [
      { t: 'Il gruppo: già passato, senza login', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: la tratta che cercava', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti tornano e comprano', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Conversione di chi non è loggato', 'Ritorno entro sette giorni', 'Ricerche riprese'],
    prova: { chi: 'Santander', settore: 'banca', v: '+600%', l: 'le conversioni sulle campagne di carrello abbandonato', url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html' },
    origine: 'cliente',
  },
  {
    id: 'oro',
    leva: 'conversione',
    titolo: 'Il cliente Oro trattato da Oro',
    punto: 'Il livello della carta sta nel CRM e non arriva alla pagina.',
    oggi: 'Chi ha lo status Oro vede la pagina di chiunque, e il programma chiude il 31 dicembre 2026.',
    viaggiatore: 'Al riconoscimento arriva il servizio compreso nel suo livello. Non uno sconto.',
    marketer: 'Il livello arriva dal CRM come attributo e diventa una condizione di esposizione, non una campagna a parte.',
    conversazione: [
      { chi: 'utente', t: 'Chi ha lo status Oro: mostragli il servizio che il suo livello comprende, non uno sconto.' },
      { chi: 'coworker', t: 'Prendo il livello dal CRM come attributo. Lo uso come condizione di esposizione?' },
      { chi: 'utente', t: 'Sì, e non come campagna a parte.' },
      { chi: 'coworker', t: 'Pronto. Ti riporto uso del servizio e ritorno nel tempo.' },
    ],
    profilo: [
      { k: 'Status', v: 'Oro' },
      { k: 'Punti status', v: 'oltre 3.000' },
      { k: 'Tratta abituale', v: 'Roma → Milano' },
    ],
    varianti: [
      { t: 'Sconto sul biglietto', n: '−10%' },
      { t: 'I servizi del suo livello', n: 'FrecciaLounge, Fast Track', match: true },
      { t: 'Invito a iscriversi', n: 'già socio' },
    ],
    arricchimento: 'livello della carta, che arriva dal CRM',
    schermo: {
      dove: 'trenitalia.com · area personale',
      titolo: 'Riconosciuto come CartaFreccia Oro',
      tessere: [
        { t: 'Ingresso FrecciaLounge', n: 'con un ospite' },
        { t: 'Upgrade di servizio', n: '3 gratuiti' },
        { t: 'Fast Track', n: 'Termini e Centrale' },
      ],
    },
    chiesta: 'Chi ha lo status Oro: mostragli il servizio che il suo livello già comprende, non uno sconto.',
    fonti: ['tcom', 'crm'],
    passi: [
      { t: 'Il gruppo: livello della carta, dal CRM', dove: 'Target', skill: 'target-audience-composer' },
      { t: 'Che cosa vede: il servizio compreso', dove: 'Target', skill: 'target-design' },
      { t: 'La misura: uso del servizio e ritorno', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
    ],
    kpi: ['Uso dei servizi compresi', 'Ricavo per socio', 'Ritorno nel tempo'],
    prova: { chi: 'Telmore', settore: 'telco', v: '+19,5%', l: 'i clienti riconosciuti sui canali a pagamento', url: 'https://business.adobe.com/customer-success-stories/telmore-case-study.html' },
    origine: 'adobe',
  },
  {
    id: 'insieme',
    leva: 'traffico',
    titolo: 'I clienti che avete in due',
    punto: 'Sapere chi è già cliente di entrambe, senza scambiarsi gli elenchi.',
    oggi: 'Le due società non possono unire le liste: non sanno quanto si sovrappongono.',
    viaggiatore: 'Chi ha già prenotato dall’altra parte trova una sola offerta, non due scollegate.',
    marketer: 'In uno spazio neutro si misura la sovrapposizione: ciascuno tiene i propri dati, e si attiva solo il gruppo comune.',
    conversazione: [
      { chi: 'utente', t: 'Misura quanto si sovrappongono le due basi e prepara l’offerta solo per il gruppo comune.' },
      { chi: 'coworker', t: 'Lo faccio in uno spazio neutro: nessun elenco passa da una parte all’altra.' },
      { chi: 'utente', t: 'Attiva solo la sovrapposizione.' },
      { chi: 'coworker', t: 'Gruppo comune pronto su Target. Misuro quanti comprano entrambe.' },
    ],
    profilo: [
      { k: 'Cliente Trenitalia', v: 'sì' },
      { k: 'Cliente dell’altra parte', v: 'sì' },
      { k: 'Elenchi scambiati', v: 'nessuno' },
    ],
    varianti: [
      { t: 'Due offerte scollegate', n: 'separate' },
      { t: 'Viaggio e sosta insieme', n: 'una sola offerta', match: true },
      { t: 'Nessuna offerta', n: '—' },
    ],
    arricchimento: 'la sovrapposizione fra le due basi, calcolata in spazio neutro',
    schermo: {
      dove: 'due basi, uno spazio neutro',
      titolo: 'Il viaggio e la sosta, in una cosa sola',
      tessere: [
        { t: 'Cliente di entrambe', n: 'il gruppo comune' },
        { t: 'Elenchi scambiati', n: 'nessuno' },
        { t: 'Si attiva', n: 'la sovrapposizione' },
      ],
    },
    chiesta: 'Misura quanto si sovrappongono le due basi e prepara l’offerta solo per il gruppo comune.',
    fonti: ['terzi'],
    passi: [
      { t: 'Il gruppo: la sovrapposizione fra le due basi', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: l’offerta che le tiene insieme', dove: 'Target', skill: 'target-design' },
      { t: 'La misura: quanti comprano entrambe', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Sovrapposizione attivabile', 'Conversione dell’offerta', 'Costo per cliente'],
    prova: { chi: 'Santander', settore: 'banca', v: 'da 50% a 70%', l: 'il tasso di riconoscimento', url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html' },
    origine: 'adobe',
  },
];

/** Un caso è nel perimetro ristretto se tutte le sue fonti lo sono. */
export const dentroRistretto = (c: Caso) => c.fonti.every((f) => RISTRETTO.includes(f));

/**
 * La referenza pubblica che regge il capitolo. Brightline è l'unico operatore
 * ferroviario con una storia Adobe PUBBLICA e numeri citabili: alta velocità,
 * posizionamento premium, la stessa combinazione di strumenti. Gli altri casi
 * che abbiamo (una compagnia aerea americana, un operatore ferroviario
 * nordamericano, un portale di viaggi) stanno in materiale riservato: si
 * raccontano senza nome, e senza cifre che non siano pubbliche.
 */
/**
 * Le fonti che il capitolo cita, verificate il 28 ott 2026 aprendo ogni pagina.
 *
 * Le due del cliente servono a non sbagliare i nomi dei suoi servizi — ed è
 * così che è saltata fuori la cosa che conta di più in questo capitolo:
 * **CartaFreccia chiude il 31 dicembre 2026**, i punti si spendono entro il
 * 31 marzo 2027, e per l'alta velocità non risulta annunciato un sostituto.
 * Non è «non ci sarà»: è «non è stato detto», e si chiede.
 *
 * Le due di Adobe reggono la riga «lo chiedi a parole»: le skill nominate
 * accanto ai gesti sono quelle che la documentazione pubblica elenca, non
 * etichette nostre.
 */
export const FONTI_CAPITOLO = [
  {
    cosa: 'Status CartaFreccia Oro, vantaggi e soglia',
    url: 'https://www.trenitalia.com/it/cartafreccia/scopri-gli-status-cartafreccia/cartafreccia-oro.html',
  },
  {
    cosa: 'Programma CartaFreccia, chiusura al 31 dicembre 2026',
    url: 'https://www.trenitalia.com/it/cartafreccia.html',
  },
  {
    cosa: 'Telmore, personalizzazione con Target e Real-Time CDP',
    url: 'https://business.adobe.com/customer-success-stories/telmore-case-study.html',
  },
  {
    cosa: 'Santander, personalizzazione in scala con Experience Platform',
    url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html',
  },
  {
    cosa: 'Coworker Chat, le skill su Target e sui segmenti',
    url: 'https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows',
  },
  {
    cosa: 'Coworker dentro Customer Journey Analytics, limiti compresi',
    url: 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/coworker',
  },
];

export const RIFERIMENTO = {
  nome: 'Brightline',
  cosa: 'Operatore ferroviario ad alta velocità, posizionamento premium, stessa combinazione di strumenti.',
  numeri: [
    { v: '70%', l: 'più rapida la prenotazione in app' },
    { v: '95%', l: 'della crescita dei ricavi arriva dai canali digitali' },
    { v: '618%', l: 'in più il traffico organico non di marca' },
  ],
  url: 'https://business.adobe.com/customer-success-stories/brightline.html',
  // Verificato il 28 ott 2026 sulla pagina stessa: «70% reduction in time to
  // book in-app», «95% of revenue growth now comes from digital channels»,
  // «618% increase in traffic from unbranded organic search». I prodotti che la
  // pagina dichiara sono RTCDP, CJA, AJO, AEM Sites e Assets — la stessa
  // combinazione di cui parla Convergenza, ed è il motivo per cui regge qui.
};
