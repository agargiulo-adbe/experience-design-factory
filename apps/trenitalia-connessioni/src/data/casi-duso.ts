/**
 * I casi d'uso, in un posto solo.
 *
 * PERCHÉ ESISTE QUESTA SEZIONE
 * Chiesta dal Direttore dei canali digitali il 27 ottobre 2026, con parole sue:
 * «quello che è importante è avere in mente dei casi vittoriosi, dei veri e
 * propri casi […] riusciamo ad avere un quadro di 4-5 casi d'uso importanti?
 * L'obiettivo finale è vendere di più». E con un vincolo ripetuto due volte,
 * che è il motivo per cui ogni caso qui porta anche il lato marketer: «se tu
 * mi dai il pezzo di ferro e poi mi devo costruire tutto da solo… noi vogliamo
 * vendere il sistema, io me lo compro e poi non so che fare».
 *
 * L'ORDINE NON È CASUALE: è il suo schema, non il nostro. Sempre dalla stessa
 * riunione: «a vendere di più ci arrivi facendo entrare più persone nel
 * negozio; oppure sei così bravo dentro che quei clienti, pur essendo meno,
 * convertono di più». Quindi i casi si raggruppano in `leva`: `conversione`
 * (chi è già entrato) e `traffico` (chi deve ancora entrare).
 *
 * I DUE PERIMETRI
 * Il responsabile della piattaforma dati ha ristretto il perimetro il 9 ottobre
 * a **trenitalia.com + CRM**; il Direttore il 27 lo ha allargato a **T-com,
 * Le Frecce, app e CRM**, con una ragione: «non dimenticherei l'altra metà del
 * mio pianeta, i clienti non iscritti al CRM, che sono la metà precisa».
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
   * volte — «io me lo compro e poi non so che fare» —: la risposta non è un
   * corso, è che il gruppo e il test si chiedono a parole.
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
    // Verbatim del 27 ott: «ti colleghi da Verona, io sull'homepage faccio
    // vedere i quattro principali collegamenti da Verona, da 19, 29, 39 euro».
    oggi: 'Si fa con un pop-up sopra la pagina. Parole loro: «mi piacerebbe che i componenti si adattassero in automatico».',
    viaggiatore: 'La prima schermata porta le tratte che partono da dove si trova, con le fasce di prezzo.',
    marketer: 'Una regola per area di partenza, e un elenco di tratte pronte da abbinare. Si prepara una volta e vale per tutte le città.',
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
    prova: { chi: 'Santander', settore: 'banca', v: '2,3×', l: 'la conversione sulle campagne personalizzate', url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html' },
    origine: 'cliente',
  },
  {
    id: 'upgrade',
    leva: 'conversione',
    titolo: 'L’upgrade che oggi si offre a tutti',
    punto: 'La stessa proposta, fatta a chi ha davvero motivo di accettarla.',
    // Dalla sintesi d'account del 27 ott: «la proposta di passaggio a classe
    // superiore a costo zero o a costo marginale oggi si fa a tutti i
    // viaggiatori e non su base propensione».
    oggi: 'Il passaggio di classe si propone a tutti i viaggiatori, non a chi ha propensione a prenderlo.',
    viaggiatore: 'Chi viaggia sempre in Standard trova la Business al prezzo della Standard, per ventiquattr’ore.',
    marketer: 'Il segmento esce dalla vista unica, «sempre Standard, alta frequenza», e diventa un’offerta a tempo su treni scelti. Si misura su due settimane.',
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
    prova: { chi: 'Santander', settore: 'banca', v: '1,8×', l: 'l’impatto di business dagli output validati in Target', url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html' },
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
    oggi: 'Chi ha lo status Oro vede la pagina di chiunque. Il programma chiude il 31 dicembre 2026: il livello deve comunque arrivare alla pagina.',
    viaggiatore: 'Al riconoscimento arriva il servizio compreso nel suo livello. Non uno sconto.',
    marketer: 'Il livello arriva dal CRM come attributo e diventa una condizione di esposizione, non una campagna a parte.',
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
    kpi: ['Uso dei servizi compresi', 'Ricavo per socio', 'Ritorno del socio nel tempo'],
    prova: { chi: 'Santander', settore: 'banca', v: '100 mln', l: 'di profili uniti in una vista sola: senza quella, riconoscere non si può', url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html' },
    origine: 'adobe',
  },
  {
    id: 'insieme',
    leva: 'traffico',
    titolo: 'I clienti che avete in due',
    punto: 'Sapere chi è già cliente anche dall’altra parte, senza scambiarsi gli elenchi.',
    oggi: 'Le due società non possono unire le liste, quindi non sanno quanto si sovrappongono.',
    viaggiatore: 'Chi ha già prenotato dall’altra parte trova una sola offerta, non due scollegate.',
    marketer: 'In uno spazio neutro si misura la sovrapposizione: ciascuno tiene i propri dati, e si attiva solo il gruppo comune.',
    schermo: {
      dove: 'due basi, uno spazio neutro',
      titolo: 'Il viaggio e la sosta, in una cosa sola',
      tessere: [
        { t: 'Già cliente di entrambe', n: 'il gruppo comune' },
        { t: 'Elenchi scambiati', n: 'nessuno' },
        { t: 'Quello che si attiva', n: 'solo la sovrapposizione' },
      ],
    },
    chiesta: 'Misura quanto si sovrappongono le due basi e prepara l’offerta solo per il gruppo comune.',
    fonti: ['terzi'],
    passi: [
      { t: 'Il gruppo: la sovrapposizione fra le due basi', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: l’offerta che le tiene insieme', dove: 'Target', skill: 'target-design' },
      { t: 'La misura: quanti comprano entrambe', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Sovrapposizione attivabile', 'Conversione dell’offerta combinata', 'Costo di acquisizione'],
    prova: { chi: 'Santander', settore: 'banca', v: 'da 50% a 70%', l: 'il tasso di riconoscimento, con ROI sulla media a pagamento +20%', url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html' },
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
