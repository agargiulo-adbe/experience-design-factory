/**
 * LE TRE IDEE — fonte unica della pagina d'insieme e delle tre slide.
 *
 * Origine: il dossier interno del 15 nov 2026 (sezione «Le idee da portare»),
 * verificato su Fluffy e sulle fonti pubbliche. Qui la versione per il
 * cliente: niente installato, niente recensioni citate, niente paragoni.
 * Ogni idea chiude su UNA domanda, perché è un primo incontro.
 *
 * `passi` è il disegno (si legge da sinistra a destra, compare un passo alla
 * volta); `fuoco` accende il passo dove l'idea interviene; `strati` sono i
 * prodotti, nominati con quello che fanno; `confine` è ciò che va detto
 * prima che lo chieda il loro IT.
 */
type L = { it: string; en: string };
export interface Idea {
  n: string; slide: string;
  tag: L; titolo: L; riga: L; lead: L;
  prodotti: string[];
  passi: { t: L; d: L }[];
  fuoco?: number;
  strati: { p: string; d: L }[];
  confine?: L;
  domanda: L;
  fonte?: { url: string; nome: string }[];
}

export const IDEE: Idea[] = [
  {
    n: '1', slide: 'slide-rimborso',
    tag: { it: 'il vostro servizio', en: 'your service' },
    titolo: { it: 'Il rimborso, visto da chi lo chiede', en: 'The reimbursement, as the claimant sees it' },
    riga: { it: 'Il percorso intero, fra app, portale e telefono: dove le persone si fermano, e un avviso prima che debbano chiamare.', en: 'The whole journey, across app, portal and phone: where people stall, and a heads-up before they need to call.' },
    lead: { it: 'Ricostruire il percorso dal primo accesso all’esito, su tutti i canali, e trovare dove le persone si fermano.', en: 'Rebuild the journey from first login to outcome, across every channel, and find where people stall.' },
    prodotti: ['Customer Journey Analytics', 'Journey Optimizer'],
    passi: [
      { t: { it: 'Accesso', en: 'Login' }, d: { it: 'app, portale, credenziali', en: 'app, portal, credentials' } },
      { t: { it: 'Richiesta', en: 'Request' }, d: { it: 'dati, fatture, documenti', en: 'details, invoices, documents' } },
      { t: { it: 'Invio', en: 'Submission' }, d: { it: 'la pratica parte', en: 'the claim is filed' } },
      { t: { it: 'Stato della pratica', en: 'Claim status' }, d: { it: 'a che punto è', en: 'where it stands' } },
      { t: { it: 'Esito', en: 'Outcome' }, d: { it: 'liquidazione o integrazione', en: 'payment or a request for more' } },
    ],
    fuoco: 3,
    strati: [
      { p: 'Customer Journey Analytics', d: { it: 'dove ci si ferma, passando da un canale all’altro', en: 'where people stop, moving from one channel to another' } },
      { p: 'Journey Optimizer', d: { it: 'l’avviso sullo stato arriva prima della chiamata', en: 'the status update arrives before the call' } },
    ],
    confine: { it: 'Il dato sanitario resta nei vostri sistemi: in piattaforma entrano solo eventi di servizio, con le regole d’uso decise da voi.', en: 'Health data stays in your systems: only service events enter the platform, under usage rules you set.' },
    domanda: { it: 'Su quali indicatori vi misurate oggi: tempi di liquidazione, pratiche rifatte, chiamate?', en: 'Which indicators do you measure yourselves on today: payout times, resubmitted claims, calls?' },
    fonte: [
      { url: 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/flow/flow', nome: 'Customer Journey Analytics' },
      { url: 'https://experienceleague.adobe.com/en/docs/journey-optimizer/using/ajo-home', nome: 'Journey Optimizer' },
      { url: 'https://experienceleague.adobe.com/en/docs/experience-platform/data-governance/home', nome: 'Data governance' },
    ],
  },
  {
    n: '2', slide: 'slide-assistenti',
    tag: { it: 'il primo passo', en: 'the first step' },
    titolo: { it: 'Che cosa rispondono di voi gli assistenti AI', en: 'What AI assistants say about you' },
    riga: { it: 'La risposta di un assistente a chi chiede come avere un rimborso: cita voi, qualcun altro o nessuno?', en: 'An assistant’s answer to someone asking how to get reimbursed: does it cite you, someone else, or no one?' },
    lead: { it: 'Sempre più persone chiedono a un assistente prima di aprire il sito. Conviene sapere che cosa si sentono rispondere.', en: 'More and more people ask an assistant before opening the site. It pays to know what they are told.' },
    prodotti: ['Adobe Brand Visibility'],
    passi: [
      { t: { it: 'Misurare', en: 'Measure' }, d: { it: 'su un centinaio di domande vere, quante volte comparite', en: 'across about a hundred real questions, how often you appear' } },
      { t: { it: 'Capire', en: 'Understand' }, d: { it: 'con quali informazioni, e accanto a chi', en: 'with what information, and next to whom' } },
      { t: { it: 'Correggere', en: 'Correct' }, d: { it: 'che cosa cambiare sul sito perché la risposta sia giusta', en: 'what to change on the site so the answer is right' } },
    ],
    strati: [
      { p: 'Adobe Brand Visibility', d: { it: 'ChatGPT, Gemini, Google AI Overviews, Copilot e Perplexity', en: 'ChatGPT, Gemini, Google AI Overviews, Copilot and Perplexity' } },
    ],
    confine: { it: 'Un pilota di poche settimane, senza progetti da aprire, che misura il punto di partenza.', en: 'A pilot of a few weeks, with no project to open: the starting point, measured.' },
    domanda: { it: 'Vi è capitato di vedere che cosa rispondono, quando qualcuno chiede di voi?', en: 'Have you looked at what they answer when someone asks about you?' },
    fonte: [
      { url: 'https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/overview', nome: 'Adobe Brand Visibility' },
    ],
  },
  {
    n: '3', slide: 'slide-moduli',
    tag: { it: 'dietro le quinte', en: 'behind the scenes' },
    titolo: { it: 'Moduli e comunicazioni, già approvati', en: 'Forms and communications, already approved' },
    riga: { it: 'Moduli compilabili al posto dei PDF, lettere generate da modelli e dati, e l’approvazione dentro lo strumento.', en: 'Fillable forms instead of PDFs, letters generated from templates and data, and approval inside the tool.' },
    lead: { it: 'Per assicurati, aziende, fondi e strutture: meno documenti da compilare due volte, e meno giri di email per approvarli.', en: 'For policyholders, employers, funds and providers: fewer documents filled in twice, and fewer email rounds to approve them.' },
    prodotti: ['Experience Manager Forms', 'Workfront'],
    passi: [
      { t: { it: 'Modello', en: 'Template' }, d: { it: 'uno per tipo di documento', en: 'one per document type' } },
      { t: { it: 'Dati', en: 'Data' }, d: { it: 'quelli della pratica, già noti', en: 'from the claim, already known' } },
      { t: { it: 'Revisione', en: 'Review' }, d: { it: 'chi scrive e chi controlla', en: 'who writes and who checks' } },
      { t: { it: 'Approvazione', en: 'Approval' }, d: { it: 'la compliance firma nello strumento', en: 'compliance signs off in the tool' } },
      { t: { it: 'Uscita', en: 'Output' }, d: { it: 'web, app, PDF o stampa', en: 'web, app, PDF or print' } },
    ],
    fuoco: 3,
    strati: [
      { p: 'Experience Manager Forms', d: { it: 'moduli adattivi e comunicazioni generate da modelli', en: 'adaptive forms and communications built from templates' } },
      { p: 'Workfront', d: { it: 'pianificazione, revisione e approvazioni', en: 'planning, review and approvals' } },
    ],
    domanda: { it: 'Chi produce oggi moduli e comunicazioni, e con quali strumenti?', en: 'Who produces forms and communications today, and with what tools?' },
    fonte: [
      { url: 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/forms-overview/home', nome: 'Experience Manager Forms' },
      { url: 'https://experienceleague.adobe.com/en/docs/workfront', nome: 'Workfront' },
    ],
  },
];
