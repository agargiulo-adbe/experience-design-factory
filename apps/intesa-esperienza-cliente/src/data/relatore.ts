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
    'slide-chi': { dire: 'Quattro verbi, una piattaforma: comprendere, decidere, creare, attivare. In fondo le quattro Forrester Wave e il link ad «Adobe in cifre», fuori dalle frecce.', seChiedono: 'Al Summit 2026 Adobe ha presentato CX Enterprise; le applicazioni che conoscono sono le stesse. Il comunicato non parla di un cambio di nome: non dirlo come fatto.' },
    'slide-cx': { dire: 'Con la freccia giù un blocco alla volta: tre canali, una sola misura e, sotto, il lavoro chiesto a parole.', seChiedono: 'AI decisioning è la capacità di decisione di Journey Optimizer: in documentazione si chiama Decisioning, nei casi pubblici Offer Decisioning. GenStudio controlla le varianti contro le linee guida di marchio e di canale; le informative restano nell’iter di approvazione legale.' },
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
    'slide-innesto': { dire: 'Si parte da quello che c’è: il vostro motore di targeting a monte, le campagne e gli invii dove sono. Sotto il titolo la riga di confine: sui clienti la next best action resta del loro motore. Freccia giù: Real-Time CDP sui prospect, poi Journey Optimizer con AI Decisioning, poi Customer Journey Analytics, infine la posizione «Accanto». Un clic su ciascun componente apre il mockup a passi.', attenzione: 'L’architettura attuale è una nostra ipotesi: si chiede di correggerla. Il nome SAS non è confermato: si dice «il vostro motore di targeting» e si chiede, senza darlo per fatto.', seChiedono: 'Il motore di targeting? Resta dov’è: target e propensione entrano come attributi; l’eleggibilità creditizia viene dal core banking, precalcolata nel profilo o passata nella richiesta di decisione. Due strumenti di campagna? Si parte «accanto»; le altre posizioni (per famiglia, tutto insieme) sono in «Le altre posizioni» e le decidono loro dopo la misura della fase 1. Far uscire i messaggi di Journey Optimizer dallo strumento che hanno oggi non è ancora nativo: chiederlo come domanda, non prometterlo. Customer Journey Analytics sostituisce il BI? No, gli si affianca.' },
    'slide-capacita': { dire: 'Una colonna per componente, con la freccia giù: tre capability ciascuno, nell’ordine dello schema. Si sceglie la colonna che interessa e si apre la demo da lì.', attenzione: 'Sono capability documentate: i link sono in fondo. Disponibilità e licenze si verificano sul loro contratto. Journey Optimizer non ha un canale social: gli annunci di ripresa partono da un pubblico di Real-Time CDP, aggiornato ogni giorno.' },
    'slide-cja-banca': { dire: 'Quattro risposte, una per freccia giù. La slide dopo è il passaggio da Analytics, che l’invito chiedeva.' },
    'slide-passaggio': { dire: 'Web Analytics: Adobe Analytics e Customer Journey Analytics convivono finché serve. Tre gruppi: resta, cambia nome, si aggiunge. Nel dettaglio: esportazioni, Activity Map, convivenza e formazione.', attenzione: 'È un’ipotesi sul loro installato: si corregge in sala. Quanto durano insieme le due licenze non si stima: si decide in fase 0.' },
    'slide-attribuzione': { dire: 'Si va oltre l’ultimo clic, fino a quanto il digitale porta in filiale.', seChiedono: 'Da chiedere: quale modello di attribuzione usate oggi in Adobe Analytics, e su quali canali?', attenzione: 'L’attribuzione si ferma ai canali osservati: dirlo subito.' },
    'slide-ritorno': { dire: 'Una riga alla volta con la freccia giù: che cosa si impara dal mutuo nel primo trimestre, e quale regola cambia nel secondo.' },
  },
  approfondimenti: {
    'slide-ingaggio-mappa': { dire: 'Che cosa hanno, che cosa si aggiunge, che cosa resta loro.', attenzione: 'L’installato è una nostra ipotesi: si chiede di correggerla.' },
    'slide-ingaggio-ciclo': { dire: 'Quattro componenti di un ciclo. Ognuno ha un dettaglio a un clic, che si apre solo se serve.' },
    'slide-integrazioni': { dire: 'I collegamenti della fase 1 e quelli che arrivano col cross-sell. I tratteggiati sono da disegnare insieme.', attenzione: 'Non contare i collegamenti ad alta voce: il numero lo fa Group Technology con noi in fase 0.' },
    'slide-integrazioni-dati': { dire: 'Dove gira la piattaforma e dove sta ogni tipo di dato.', attenzione: 'Su DORA la criticità la decidono loro, nella loro analisi d’impatto. Mai dire che Adobe è conforme a DORA. Retention e regione dei log CDN: da verificare con Adobe, non promettere.' },
    'slide-integrazioni-crm': { dire: 'La freccia verso il CRM: chi espone l’API, la chiave del lead, la deduplica, e che cosa succede se la chiamata fallisce.', seChiedono: 'L’API del CRM la identifichiamo con Group Technology in fase 0.' },
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
    'slide-cosa': { dire: 'Prepara fino all’approvazione: chi approva resta chi approva oggi.', attenzione: 'Nel settore finanziario l’attivazione per la loro istanza va richiesta e confermata da Adobe: il capitolo descrive, non promette.' },
    'slide-video': { dire: 'Una campagna di mutuo preparata in una sessione. La clip si carica dalla console.' },
  },
  risultati: {
    'slide-cover': { dire: 'Si passa dal racconto a chi lo fa già.' },
    'slide-tsb': { dire: 'La prima banca britannica su Experience Platform: le cifre sono sulla slide, con la fonte.' },
    'slide-italia': { dire: 'Due banche, due misure diverse, con i numeri che hanno pubblicato.', attenzione: 'Non sono banche come la loro: dirlo prima.' },
  },
  'prossimi-passi': {
    'slide-cover': { dire: 'Si passa dalla storia alla prova.' },
    'slide-da-voi': { dire: 'Sette misure dal giorno uno, ognuna con la domanda «oggi: lo misurate?». La prima è il tasso di consenso: senza, le altre non partono.' },
    'slide-soglia': { dire: 'La forma della soglia e del gruppo di controllo, poi la richiesta. Si legge la richiesta così com’è scritta.', attenzione: 'X, Y e la quota del gruppo non si dicono in sala: si fissano in fase 0 con il calcolo dei volumi.' },
    'slide-fasi': { dire: 'Tre tappe: il disegno, il mutuo sui prospect, gli altri casi.', seChiedono: 'Chi integra lo decidono loro, con noi o con un integratore.' },
    'slide-serve': { dire: 'Cinque cose e chi le porta: non è un preventivo, è il contenuto della prima sessione.' },
    'slide-firma': { dire: 'Si chiude sulla firma, senza aggiungere altro.' },
  },
  'adobe-in-cifre': {
    'slide-fsi': { dire: 'Fuori dalle frecce: si apre solo se chiedono chi è Adobe in numeri. I numeri sono nostri, il giudizio è di Forrester. Passando il mouse su un quadrante, si ingrandisce.' },
  },
};

/* LE SLIDE DAVANTI — una PROPOSTA, non una configurazione accesa.
   Il formato concordato col referente era «poche slide davanti», e il percorso
   ne ha una trentina (panel dell'11 nov 2026). Qui l'elenco proposto dal panel,
   più la copertina e la firma, che il contratto del co-brand vuole sempre.
   Niente si spegne di default: la pagina delle note costruisce il link `?c=`
   (formato del tab «Capitoli e slide»), che vale solo per chi lo apre e solo
   per la sessione. Si conferma al check col referente prima di usarlo. */
export const DAVANTI: Record<string, string[]> = {
  scenario: ['slide-segnale'],
  persona: ['slide-giro-di-giulia'],
  momenti: ['slide-m-03', 'slide-m-04', 'slide-m-07'],
  'messa-a-terra': ['slide-innesto', 'slide-attribuzione', 'slide-passaggio'],
  'prossimi-passi': ['slide-da-voi', 'slide-soglia', 'slide-serve', 'slide-firma'],
};
