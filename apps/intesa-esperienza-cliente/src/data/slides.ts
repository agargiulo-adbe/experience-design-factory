/** Ogni slide del deck, pagina per pagina: la leggono la console e le note per chi presenta. Ogni <Slide id> nuova va registrata qui. */
export interface SlideEntry { id: string; label: string; }
export interface PageEntry { slug: string; label: string; slides: SlideEntry[]; }

export const PAGE_REGISTRY: PageEntry[] = [
  { slug: 'index', label: 'Copertina dell’incontro (00)', slides: [
    { id: 'slide-cover', label: 'Copertina dell’incontro: titolo e agenda a sei voci' },
  ]},
  { slug: 'adobe', label: 'Adobe, chi siamo (01)', slides: [
    { id: 'slide-cover',     label: 'Cover: Adobe per Intesa Sanpaolo' },
    { id: 'slide-team',      label: 'Il team Adobe che partecipa' },
    { id: 'slide-fsi',       label: 'Chi è Adobe: i numeri e i quattro Forrester Wave' },
    { id: 'slide-chi',       label: 'Dati, contenuti e decisioni nello stesso sistema: le quattro funzioni' },
    { id: 'slide-cx',        label: 'Per Intesa Sanpaolo: tre bisogni, la stessa piattaforma' },
  ]},
  { slug: 'scenario', label: 'Giulia: un mutuo, sette momenti · Il segnale (02)', slides: [
    { id: 'slide-cover',      label: 'Cover: Dal dato alla decisione' },
    { id: 'slide-segnale',    label: 'Il segnale c’è già: l’imbuto' },
  ]},
  { slug: 'persona', label: 'Giulia: un mutuo, sette momenti · La persona (02)', slides: [
    { id: 'slide-cover',  label: 'Cover: Giulia, 34 anni, non è vostra cliente' },
    { id: 'slide-giro-di-giulia', label: 'La protagonista, che cosa non avete di lei, e le sette fermate' },
  ]},
  { slug: 'momenti', label: 'Giulia: un mutuo, sette momenti · I momenti (02)', slides: [
    { id: 'slide-m-01', label: '01 Farsi trovare: l’assistente la cita, o no' },
    { id: 'slide-m-02', label: '02 Content Factory: la variante per la sua città' },
    { id: 'slide-m-03', label: '03 Engagement: da pseudonimo a nome' },
    { id: 'slide-m-04', label: '04 Engagement: quattro candidate, una parte' },
    { id: 'slide-m-05', label: '05 Engagement: il percorso parte dall’evento' },
    { id: 'slide-m-06', label: '06 Customer Engagement: il percorso attiva la filiale' },
    { id: 'slide-m-07', label: '07 CX Analytics: quanto è costato acquisirla' },
  ]},
  { slug: 'messa-a-terra', label: 'Dove si collega Adobe e che cosa si misura (03)', slides: [
    { id: 'slide-cover', label: 'Cover: Dove si collega Adobe e che cosa si misura' },
    { id: 'slide-innesto', label: 'L’innesto: Adobe si aggiunge, si parte dai percorsi nuovi, Real-Time CDP, Journey Optimizer · AI Decisioning e CJA' },
    { id: 'slide-capacita', label: 'Che cosa porta ciascun componente: le capability' },
    { id: 'slide-chiave', label: 'Più identificativi, una persona sola: la storia da non‑cliente a cliente' },
    { id: 'slide-cja-banca', label: 'Quattro risposte che una banca ottiene da CJA' },
    { id: 'slide-attribuzione', label: 'Quanto del digitale arriva in filiale' },
    { id: 'slide-ritorno', label: 'Quello che si misura sul mutuo nel primo trimestre cambia le regole del secondo' },
  ]},
  { slug: 'coworker', label: 'CX Enterprise Coworker (04)', slides: [
    { id: 'slide-cover', label: 'Cover: divisore del capitolo' },
    // slide-cosa depubblicata il 13 nov 2026 (COSA_PUBBLICATA in coworker.astro)
    { id: 'slide-video', label: 'Video demo con i dati del cliente: slot da console' },
  ]},
  { slug: 'risultati', label: 'Banche che lo fanno già (05)', slides: [
    { id: 'slide-cover',   label: 'Cover: una banca che lo fa già' },
    { id: 'slide-santander',       label: 'Santander Brasil: reagire entro 15 minuti' },
    { id: 'slide-credit-agricole', label: 'Crédit Agricole Italia: +15% al primo acquisto' },
    { id: 'slide-tsb',             label: 'TSB: il dato in meno di 24 ore' },
    { id: 'slide-unipol',          label: 'Unipol: agenzie e digitale nella stessa analisi' },
  ]},
  { slug: 'prossimi-passi', label: 'I prossimi passi (06)', slides: [
    { id: 'slide-cover',  label: 'Cover: prossimi passi' },
    { id: 'slide-da-voi', label: 'La proposta: un trimestre sul mutuo, quattro misure e l’ask (le altre a richiesta)' },
    { id: 'slide-fasi',   label: 'Come si parte: tre tappe, chi guida e quando (il dettaglio a richiesta)' },
    { id: 'slide-firma',  label: 'La firma: Adobe × Intesa Sanpaolo, chiude il percorso' },
  ]},
  /* ⚠️ Le pagine FUORI PERCORSO stanno in coda. La console costruisce
     l'ordine del link `?c=` da questo elenco, e il runtime salta i capitoli
     spenti cercando il primo capitolo vivo in quell'ordine: una pagina fuori
     percorso in mezzo diventerebbe la destinazione delle frecce. */
  { slug: 'approfondimenti', label: 'Approfondimenti (fuori percorso)', slides: [
    { id: 'slide-ingaggio-mappa', label: 'La mappa: esistente, nuovo, e ciò che resta vostro' },
    { id: 'slide-ingaggio-ciclo', label: 'I quattro componenti del ciclo di ingaggio' },
    { id: 'slide-ingaggio-dato', label: 'Una sola misura, e le quattro domande di CJA' },
    { id: 'slide-ingaggio-profilo', label: 'Il profilo: stitching, grafo, e duplicare o federare' },
    { id: 'slide-ingaggio-regia', label: 'Tre modi di eseguire la stessa decisione' },
    { id: 'slide-ingaggio-arbitro', label: 'Come ragiona una decisione, e dove si ferma' },
    { id: 'slide-ingaggio-casi', label: 'Quattro casi d’uso che reggono solo a stack intero' },
    { id: 'slide-integrazioni', label: 'I collegamenti della fase 1, e quelli che arrivano dopo' },
    { id: 'slide-integrazioni-dati', label: 'Dove gira, e dove sta ogni dato (DORA, regione, retention)' },
    { id: 'slide-integrazioni-crm', label: 'La freccia verso il CRM di filiale, in quattro punti' },
    { id: 'slide-brand-visibility', label: 'Brand Visibility, quattro capacità e due strati' },
    { id: 'slide-content-factory', label: 'Content Factory, dal brief alla misura' },
    { id: 'slide-passaggio', label: 'Web Analytics: da Adobe Analytics a CJA, che cosa resta, cambia, si aggiunge' },
    { id: 'slide-serve', label: 'Le cinque cose da portare alla fase 0, e chi le porta' },
  ]},
];

