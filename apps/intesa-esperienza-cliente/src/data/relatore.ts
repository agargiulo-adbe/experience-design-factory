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
  'L’acquisizione comincia prima che la persona diventi cliente: lì si decide chi entra nel confronto.',
  'La prima cosa da fare è una sessione di architettura.',
];

export const NOTE: Record<string, Record<string, Nota>> = {
  index: { 'slide-cover': { dire: 'Si apre dall’agenda, sette voci, e si dice subito che il motore di targeting resta dov’è.' } },
  adobe: {
    'slide-cover': { dire: 'Chi siamo, in pochi minuti: il tema dell’incontro viene dopo.' },
    'slide-team': { dire: 'Si presentano le persone, con il ruolo di ciascuno.' },
    'slide-chi': { dire: 'Quattro verbi, una piattaforma: comprendere, decidere, creare, attivare.', seChiedono: 'Experience Cloud oggi si chiama CX Enterprise: il prodotto è lo stesso che conoscono.' },
    'slide-fsi': { dire: 'I numeri sono nostri, il giudizio è di Forrester. Passando il mouse su un quadrante, si ingrandisce.' },
    'slide-cx': { dire: 'Con la freccia giù un blocco alla volta: tre canali, una sola misura e, sotto, il lavoro chiesto a parole.', seChiedono: 'AI Decisioning è il modulo di Journey Optimizer che nei casi pubblici si chiama ancora Offer Decisioning.' },
  },
  scenario: {
    'slide-cover': { dire: 'Si parte dal dato che c’è, e spesso riguarda chi è cliente di un’altra banca.' },
    'slide-segnale': { dire: 'Il segnale più forte, simulare la rata, arriva da chi è ancora anonimo. Poi si chiede: quanto tempo passa oggi fra quel gesto e una risposta?', attenzione: 'Il dato è di mercato (Nomisma e MutuiSupermarket.it, maggio 2026), non è loro. Il 45% «vuole» simulare la rata: non dire che la simula.' },
  },
  persona: {
    'slide-cover': { dire: 'Giulia, 34 anni, non è ancora cliente: tutto il racconto è su di lei.' },
    'slide-giro-di-giulia': { dire: 'A sinistra il punto di partenza: la banca non sa niente di lei. Con la freccia giù si costruisce il giro, una fermata alla volta; l’ultima apre a destra quello che la banca sa alla fine.' },
  },
  'messa-a-terra': {
    'slide-cover': { dire: 'Si esce dalla storia: da qui si guarda la loro architettura.' },
    'slide-innesto': { dire: 'Si parte da quello che c’è: SAS a monte, le campagne e gli invii restano dove sono. Freccia giù: Real-Time CDP sui prospect, poi Journey Optimizer con AI Decisioning, poi Customer Journey Analytics. Un clic su ciascuno apre il mockup a passi.', attenzione: 'L’architettura attuale è una nostra ipotesi: si chiede di correggerla.', seChiedono: 'Il motore di targeting? Resta dov’è: score, eleggibilità e politica di contatto entrano nella decisione. Chi segue oggi chi non è ancora nel CRM si chiede, non si dà per scontato. Due strumenti di campagna? Si parte dai percorsi a evento; Journey Optimizer copre anche le campagne pianificate (orchestrated campaigns), e se e quando spostarle lo decidono loro. Far uscire i messaggi di Journey Optimizer dallo strumento che hanno oggi non è ancora nativo: chiederlo come domanda, non prometterlo. Customer Journey Analytics sostituisce il BI? No, gli si affianca.' },
    'slide-capacita': { dire: 'Una colonna per componente, con la freccia giù: tre capability ciascuno, nell’ordine dello schema. Si sceglie la colonna che interessa e si apre la demo da lì.', attenzione: 'Sono capability documentate: i link sono in fondo. Disponibilità e licenze si verificano sul loro contratto.' },
    'slide-cja-banca': { dire: 'Quattro risposte, una per freccia giù. Il dettaglio del passaggio da Analytics è negli approfondimenti.' },
    'slide-attribuzione': { dire: 'Si va oltre l’ultimo clic, fino a quanto il digitale porta in filiale.', seChiedono: 'Da chiedere: quale modello di attribuzione usate oggi in Adobe Analytics, e su quali canali?', attenzione: 'L’attribuzione si ferma ai canali osservati: dirlo subito.' },
    'slide-ritorno': { dire: 'Una riga alla volta con la freccia giù: che cosa si impara da Giulia, e dove torna per il prossimo cliente. In fondo, il secondo giro: Giulia da cliente.' },
  },
  approfondimenti: {
    'slide-ingaggio-mappa': { dire: 'Che cosa hanno, che cosa si aggiunge, che cosa resta loro.', attenzione: 'L’installato è una nostra ipotesi: si chiede di correggerla.' },
    'slide-passaggio': { dire: 'Adobe Analytics e Customer Journey Analytics convivono finché serve. Che cosa resta, che cosa cambia nome, che cosa si aggiunge.', attenzione: 'È un’ipotesi sul loro installato: si corregge in sala.' },
    'slide-ingaggio-ciclo': { dire: 'Quattro componenti di un ciclo. Ognuno ha un dettaglio a un clic, che si apre solo se serve.' },
    'slide-integrazioni': { dire: 'Sei collegamenti. I due tratteggiati sono da disegnare insieme.', attenzione: 'Su DORA la criticità la decidono loro, nella loro analisi d’impatto. Mai dire che Adobe è conforme a DORA.' },
    'slide-brand-visibility': { dire: 'Prima si misura come si compare nelle risposte generate, poi si interviene.', seChiedono: 'Serve l’inoltro dei log del CDN: va concordato con il loro IT.' },
    'slide-content-factory': { dire: 'Una campagna di mutuo si ferma sulle approvazioni: la verifica sta dentro la produzione.' },
    'slide-ingaggio-dato': { dire: 'Fuori percorso: una sola misura e le quattro domande che apre.' },
    'slide-ingaggio-profilo': { dire: 'Fuori percorso: come si cuciono gli identificativi, e la scelta fra copiare il dato e lasciarlo dov’è.', attenzione: 'Le audience federate si aggiornano a ogni esecuzione pianificata, non a evento.' },
    'slide-ingaggio-regia': { dire: 'Fuori percorso: tre modi di eseguire la stessa decisione. Il terzo lascia l’orchestrazione dov’è.' },
    'slide-ingaggio-arbitro': { dire: 'Fuori percorso: cinque passaggi di una decisione, e dove si fermano le nostre regole.', attenzione: 'Eleggibilità, saldi e approvazioni restano nel core banking.' },
    'slide-ingaggio-casi': { dire: 'Fuori percorso: quattro casi che si perdono quando profilo, decisione e misura stanno in sistemi diversi.' },
  },
  coworker: {
    'slide-cover': { dire: 'Quello che si è appena visto si può chiedere a un agente.' },
    'slide-cosa': { dire: 'Prepara fino all’approvazione: chi approva resta chi approva oggi.', attenzione: 'Nel settore finanziario l’attivazione si chiede ad Adobe: la richiesta è in corso, e il capitolo descrive, non promette.' },
    'slide-video': { dire: 'Una campagna di mutuo preparata in una sessione. La clip si carica dalla console.' },
  },
  risultati: {
    'slide-cover': { dire: 'Si passa dal racconto a chi lo fa già.' },
    'slide-tsb': { dire: 'La prima banca britannica su Experience Platform: le cifre sono sulla slide, con la fonte.' },
    'slide-italia': { dire: 'Due banche, due misure diverse, con i numeri che hanno pubblicato.', attenzione: 'Non sono banche come la loro: dirlo prima.' },
  },
  'prossimi-passi': {
    'slide-cover': { dire: 'Si passa dalla storia alla prova.' },
    'slide-da-voi': { dire: 'Sei misure dal giorno uno, e la richiesta. Si legge la richiesta così com’è scritta.' },
    'slide-fasi': { dire: 'Tre tappe: il disegno, il mutuo sui prospect, gli altri casi.', seChiedono: 'Chi integra lo decidono loro, con noi o con un integratore.' },
    'slide-serve': { dire: 'Cinque cose e chi le porta: non è un preventivo, è il contenuto della prima sessione.' },
    'slide-firma': { dire: 'Si chiude sulla firma, senza aggiungere altro.' },
  },
};
