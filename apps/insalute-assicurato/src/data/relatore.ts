/**
 * NOTE PER CHI PRESENTA — una per slide. Diventano anche le NOTE DEL RELATORE
 * del .pptx che si genera da questa experience.
 *
 * ⚠️ LA PAGINA È PUBBLICA come il deck: qui entra solo ciò che è già in slide o
 * già pubblico. Nomi del cliente, contratti, installato e letture riservate
 * stanno nel dossier gated (dossier-insalute, nell'app intesa-dopo-la-firma).
 */
export interface Nota { dire: string; attenzione?: string; seChiedono?: string }

export const TRE_COSE = [
  'È un primo incontro: si ascolta più di quanto si presenta.',
  'Tre idee da discutere, ognuna con una domanda: ci dicono loro quali contano.',
  'Il passo dopo lo scelgono loro: una sessione sul rimborso, un pilota sugli assistenti AI o un incontro su moduli e comunicazioni.',
];

export const NOTE: Record<string, Record<string, Nota>> = {
  index: { 'slide-cover': { dire: 'Si apre dall’agenda, quattro voci. Si dice subito che metà dell’ora è per ascoltare.' } },
  adobe: {
    'slide-cover': { dire: 'Chi siamo, in pochi minuti: il tema dell’incontro viene dopo.' },
    'slide-team': { dire: 'Si presentano le tre persone in sala, con il ruolo di ciascuno.' },
    'slide-fsi': { dire: 'Chi è Adobe in numeri: i numeri sono nostri, il giudizio è di Forrester. Passando il mouse su un quadrante, si ingrandisce.' },
    'slide-chi': { dire: 'La piattaforma in quattro funzioni: comprendere, decidere, creare, attivare. Le tre idee usano pezzi diversi della stessa piattaforma.' },
  },
  storie: {
    'slide-cover': { dire: 'Due storie pubbliche, scelte perché vicine al loro mestiere: moduli, comunicazioni, stato della pratica.', seChiedono: 'Una storia Adobe su un gestore di prestazioni sanitarie non è pubblicata: lo si dice, e per questo la proposta è partire da una prova sul loro caso.' },
    'slide-inail': { dire: 'Inail serve assicurati, aziende e partner come loro: oltre 200 moduli accessibili, il 98% di recapito su 135.000 comunicazioni.', attenzione: 'È un ente pubblico, non un assicuratore privato. Il 98% è il numero della pagina pubblica.' },
    'slide-css': { dire: 'Assicuratore malattia svizzero: una conferma a ogni passo, e chi sottoscrive riprende da dove si era fermato.', attenzione: 'Il caso è del 2020, su Adobe Campaign. Il «riprendere» riguarda chi sottoscrive una polizza, non chi chiede un rimborso: non dirlo dei rimborsi.' },
  },
  idee: {
    'slide-cover': { dire: 'Tre idee nate da ciò che si vede da fuori. Le portiamo per sapere se colgono nel segno.' },
    'slide-tre': { dire: 'Le tre idee in una pagina. Si può chiedere subito quale interessa di più e saltare lì.' },
    'slide-rimborso': { dire: 'Il percorso del rimborso su tutti i canali: dove le persone si fermano, e l’avviso sullo stato prima che chiamino. Poi la domanda sugli indicatori.', attenzione: 'Il dato sanitario resta nei loro sistemi: in piattaforma solo eventi di servizio. Dove passa il confine lo decide il loro responsabile della protezione dei dati.' },
    'slide-assistenti': { dire: 'Che cosa rispondono gli assistenti AI quando un assicurato chiede di loro. Un pilota di poche settimane: misurare, capire, correggere.', attenzione: 'Brand Visibility copre ChatGPT, Gemini, Google AI Overviews, Copilot e Perplexity: non nominare altri assistenti.' },
    'slide-moduli': { dire: 'Moduli compilabili al posto dei PDF, comunicazioni da modelli e dati, approvazione dentro lo strumento. Si apre con la domanda: chi li produce oggi?' },
  },
  confronto: {
    'slide-cover': { dire: 'La parte che conta di più: ascoltarli.' },
    'slide-domande': { dire: 'Sei domande, una per tema. Non serve farle tutte: si segue la conversazione.' },
    'slide-passo': { dire: 'Tre passi possibili, a loro scelta. Si chiude con la domanda: quale tema, e con chi del loro team.' },
    'slide-firma': { dire: 'Grazie, e il prossimo passo si fissa insieme.' },
  },
};

/** Le slide da tenere davanti se il tempo si accorcia (link `?c=` dalla pagina note). */
export const DAVANTI: Record<string, string[]> = {
  adobe: ['slide-team'],
  storie: ['slide-inail'],
  idee: ['slide-tre'],
  confronto: ['slide-domande', 'slide-passo', 'slide-firma'],
};
