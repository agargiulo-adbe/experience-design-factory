/**
 * NOTE PER CHI PRESENTA. Per un collega che apre il deck un'ora prima di entrare.
 *
 * ⚠️ LA PAGINA È PUBBLICA come il deck: qui entra solo ciò che è già in slide o
 * già pubblico. Niente nomi di persone, dati di contratto, misure interne o
 * indicazioni su chi c'è in sala: quelli stanno nel dossier riservato.
 *
 * I sette momenti non hanno nota qui: la pagina rende il testo di `momenti.ts`,
 * che è quello tolto dalle slide. Una slide nuova senza nota appare in rosso.
 */
export interface Nota { dire: string; attenzione?: string; seChiedono?: string }

export const TRE_COSE = [
  'Il vostro motore di targeting resta dov’è: l’arbitro entra su chi non è ancora cliente.',
  'Il ciclo di vita del cliente comincia prima che vi conosca: lì si decide chi entra nel confronto.',
  'La prima cosa da fare è una sessione di architettura, non un acquisto.',
];

export const NOTE: Record<string, Record<string, Nota>> = {
  index: { 'slide-cover': { dire: 'Si apre dall’agenda, sette voci, e si dice subito che il motore di targeting resta dov’è.' } },
  adobe: {
    'slide-cover': { dire: 'Chi siamo, in pochi minuti: il tema dell’incontro viene dopo.' },
    'slide-team': { dire: 'Si presentano le persone, con il ruolo di ciascuno.' },
    'slide-chi': { dire: 'Quattro verbi, una piattaforma: comprendere, decidere, creare, attivare.', seChiedono: 'Experience Cloud oggi si chiama CX Enterprise: il prodotto è lo stesso che conoscono.' },
    'slide-fsi': { dire: 'I numeri sono nostri, il giudizio è di Forrester: quattro report, con il link.' },
    'slide-cx': { dire: 'Con la freccia giù un blocco alla volta: tre canali, una sola misura e, sotto, il lavoro chiesto a parole.', seChiedono: 'Decisioning è il modulo di Journey Optimizer che nei casi pubblici si chiama ancora Offer Decisioning.' },
  },
  scenario: {
    'slide-cover': { dire: 'Si parte dal dato che c’è. Il mutuo è l’acquisizione più lunga, e spesso riguarda chi è cliente di un’altra banca.' },
    'slide-segnale': { dire: 'Quanto tempo passa oggi fra il gesto e la decisione? La domanda si fa e si aspetta la risposta.', attenzione: 'I numeri dell’imbuto sono illustrativi, non sono i loro: dirlo.' },
  },
  analytics: {
    'slide-unifica': { dire: 'La misura che tiene insieme il percorso: è il tema chiesto dal cliente. Con la freccia giù: i canali, la misura, il percorso.', attenzione: 'Filiale e contact center entrano nel dato solo se si decide di portarceli.' },
    'slide-passaggio': { dire: 'Adobe Analytics e Customer Journey Analytics convivono finché serve. Che cosa resta, che cosa cambia nome, che cosa si aggiunge.', attenzione: 'È un’ipotesi sul loro installato: si corregge in sala.' },
    'slide-attribuzione': { dire: 'Si va oltre l’ultimo clic, fino a quanto il digitale porta in filiale.', attenzione: 'L’attribuzione si ferma ai canali osservati: dirlo subito.' },
  },
  persona: {
    'slide-cover': { dire: 'Giulia, 34 anni, non è ancora cliente: tutto il racconto è su di lei.' },
    'slide-giro-di-giulia': { dire: 'Sette momenti in tre settimane: con la freccia giù si costruisce il giro, una fermata alla volta. L’ultima freccia chiude il cerchio, perché quello che si impara da Giulia serve per la prossima.' },
  },
  momenti: { 'slide-cover': { dire: 'In ogni slide, sopra la sua vista, sotto la vostra nello stesso istante.' } },
  'messa-a-terra': {
    'slide-cover': { dire: 'Si esce dalla storia: da qui si guarda la loro architettura.' },
    'slide-ingaggio-mappa': { dire: 'Che cosa hanno, che cosa si aggiunge, che cosa resta loro.', attenzione: 'L’installato è una nostra ipotesi: si chiede di correggerla.' },
    'slide-motore': { dire: 'Tre cose loro entrano, l’arbitro sceglie, ne esce una. Il motore non si tocca.', seChiedono: 'Nel dettaglio a richiesta: il cliente, la firma, il tetto per persona, perché non costruirlo in casa.' },
    'slide-integrazioni': { dire: 'Sei collegamenti. I due tratteggiati sono da disegnare insieme.', attenzione: 'Su DORA la criticità la decidono loro, nella loro analisi d’impatto. Mai dire che Adobe è conforme a DORA.' },
    'slide-brand-visibility': { dire: 'Prima si misura come si compare nelle risposte generate, poi si interviene.', seChiedono: 'Serve l’inoltro dei log del CDN: va concordato con il loro IT.' },
    'slide-content-factory': { dire: 'Una campagna di mutuo si ferma sulle approvazioni: la verifica sta dentro la produzione.' },
    'slide-ingaggio-ciclo': { dire: 'Quattro componenti di un ciclo. Ognuno ha un dettaglio a un clic, che si apre solo se serve.' },
    'slide-ritorno': { dire: 'Il percorso lascia qualcosa a lei e alla prospect successiva: acquisire costa, il resto è margine.' },
  },
  approfondimenti: {
    'slide-ingaggio-dato': { dire: 'Fuori percorso: una sola misura e le quattro domande che apre.' },
    'slide-ingaggio-profilo': { dire: 'Fuori percorso: come si cuciono gli identificativi, e la scelta fra copiare il dato e lasciarlo dov’è.', attenzione: 'Le audience federate si aggiornano a ogni esecuzione pianificata, non a evento.' },
    'slide-ingaggio-regia': { dire: 'Fuori percorso: tre modi di eseguire la stessa decisione. Il terzo lascia l’orchestrazione dov’è.' },
    'slide-ingaggio-arbitro': { dire: 'Fuori percorso: cinque passaggi di una decisione, e dove si fermano le nostre regole.', attenzione: 'Eleggibilità, saldi e approvazioni restano nel core banking.' },
    'slide-ingaggio-casi': { dire: 'Fuori percorso: quattro casi che si perdono quando profilo, decisione e misura stanno in sistemi diversi.' },
  },
  coworker: {
    'slide-cover': { dire: 'Quello che si è appena visto si può chiedere a un agente.' },
    'slide-cosa': { dire: 'Prepara fino all’approvazione: chi approva resta chi approva oggi.', attenzione: 'Nel settore finanziario l’attivazione si chiede ad Adobe: la richiesta è in corso, e il capitolo descrive, non promette.' },
    'slide-video': { dire: 'Dall’obiettivo alla campagna, in una sessione. La clip si carica dalla console.' },
  },
  risultati: {
    'slide-cover': { dire: 'Si passa dal racconto a chi lo fa già.' },
    'slide-tsb': { dire: 'La prima banca britannica su Experience Platform: le cifre sono sulla slide, con la fonte.' },
    'slide-italia': { dire: 'Due banche, due misure diverse: dicono che cosa si misura, non quanto.', attenzione: 'Non sono banche come la loro: dirlo prima.' },
  },
  'prossimi-passi': {
    'slide-cover': { dire: 'Si passa dalla storia alla prova.' },
    'slide-ripresa': { dire: 'Tre cose da portare via. La mappa dell’installato è la prima da aprire al tavolo tecnico.' },
    'slide-da-voi': { dire: 'Sei misure dal giorno uno, e la richiesta. Si legge la richiesta così com’è scritta.' },
    'slide-fasi': { dire: 'Tre tappe: il disegno, il mutuo sui prospect, gli altri casi.', seChiedono: 'Chi integra lo decidono loro, con noi o con un integratore.' },
    'slide-serve': { dire: 'Cinque cose e chi le porta: non è un preventivo, è il contenuto della prima sessione.' },
    'slide-firma': { dire: 'Si chiude sulla firma, senza aggiungere altro.' },
  },
};
