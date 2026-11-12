/**
 * «Ciascuno conta» — la copia del deck, una volta sola.
 *
 * Regola di questo file: ogni riga deve poter essere letta dal cliente senza
 * danno. Il deck è la base della versione che andrà alla Direzione Sales; quello
 * che è solo nostro — persone per nome, strategia, GNARR, costi, compliance —
 * sta nella pagina gated `/dossier/` (contenuto in Supabase, seed git-ignorato
 * in docs/Ferrovie/).
 *
 * Voce: plurale istituzionale, ancore e non prosa. La prosa vive dietro
 * «Scopri come», in forma di figura + ancora + una riga.
 */

export const COVER = {
  occhiello: 'Una proposta di lavoro · novembre 2026',
  conta: 'Conta ciascuno',
  sub: 'Dimostrare sui vostri dati che parlare a ciascun viaggiatore fa vendere di più, e farne il lavoro di ogni giorno.',
  firma: 'Ciascuno conta. E si conta, uno per uno.',
};

/* ── 01 · Il numero di ogni giorno ─────────────────────────────────────── */
export const NUMERO = {
  eyebrow: 'Il punto di partenza',
  titolo: 'Il venduto del giorno prima si guarda ogni mattina',
  sub: 'Il numero dice quanto si è venduto. Il progetto serve a leggerci anche il perché.',
  ancore: [
    { k: '01', t: 'Quale proposta fa vendere', b: 'E quale no, misurato sul venduto.' },
    { k: '02', t: 'Perché il numero si muove', b: 'Le cause di un calo, lette subito.' },
    { k: '03', t: 'Dall’idea al sito, presto', b: 'Una prova in giorni, non in mesi.' },
    { k: '04', t: 'Investimenti e ritorni', b: 'Il budget legato al ritorno atteso.' },
    { k: '05', t: 'Il digitale con gli altri canali', b: 'App e sito letti insieme a biglietteria e agenzie.' },
  ],
  dettaglio: [
    { fig: 'prova-su-una-parte', a: 'Una proposta contro l’altra', r: 'Una parte del traffico riceve la proposta nuova, il resto no: la differenza si legge sul venduto.' },
    { fig: 'tre-tracce-un-percorso', a: 'Più canali, un percorso', r: 'Chi si informa sull’app e compra altrove resta la stessa persona, e così si conta.' },
    { fig: 'chi-chiede-chi-approva', a: 'Dall’idea alla messa in linea', r: 'Il tempo si accorcia con un modo di lavorare stabile, prima ancora che con gli strumenti.' },
  ],
};

export const DOMANDA = {
  eyebrow: 'La domanda delle nove',
  titolo: '«Ieri il venduto è sceso. Perché?»',
  sub: 'Oggi la risposta arriva in giorni. L’obiettivo è averla in un minuto, con l’azione da fare accanto.',
  chiusa: 'La risposta tiene conto di tutto ciò che muove le vendite: canali, offerta, calendario, servizio.',
};

/* ── 02 · Dalla promessa alla prova ────────────────────────────────────── */
export const PROVA = {
  eyebrow: 'La forma',
  titolo: 'Qualche settimana di lavoro, chiusa da un risultato misurato',
  sub: 'Tre criteri decidono che cosa entra. Quello che non serve a nessuno dei tre resta fuori.',
  ancore: [
    { k: 'La prova', t: 'Che cosa fa vendere', b: 'Una proposta su misura, valutata sul vostro venduto.' },
    { k: 'La risposta', t: 'Il perché in un minuto', b: 'Un calo spiegato su richiesta, con il dato sotto.' },
    { k: 'Il consenso', t: 'Le priorità scelte insieme', b: 'Business, tecnologia e partner allo stesso tavolo.' },
  ],
};

export const DATI = {
  eyebrow: 'Sui vostri dati',
  titolo: 'Si parte da quello che già usate',
  sub: 'Analytics e Target sono già al lavoro su trenitalia.com e sull’app. Si aggiunge la lettura dei percorsi.',
  cifre: [
    { k: '6–8', v: 'settimane di lavoro congiunto prima della giornata' },
    { k: '2–3', v: 'casi d’uso nel primo giro, scelti con voi' },
    { k: '2', v: 'fonti di dati nel primo perimetro, dichiarato in partenza' },
    { k: '1', v: 'giornata in cui il risultato si vede e si decide' },
  ],
  chiusa: 'Il primo caso è già in produzione: la proposta legata alla posizione di chi cerca un viaggio.',
};

/* ── 03 · Il percorso ──────────────────────────────────────────────────── */
export const TAPPE = {
  eyebrow: 'Le tappe',
  titolo: 'Sei tappe, dai casi d’uso alla giornata',
  sub: 'Le date sono indicative e si fissano insieme alla prima tappa.',
  passi: [
    { l: 'I casi d’uso', d: 'Una prima lista, discussa con la Direzione · fine novembre' },
    { l: 'L’accesso ai dati', d: 'Il perimetro concordato con FS Technology · inizio dicembre' },
    { l: 'I criteri di successo', d: 'Che cosa vuol dire riuscire, scritto prima · settimana 1' },
    { l: 'Il lavoro sui dati', d: 'Analisi e test, con un punto ogni settimana · settimane 2–5' },
    { l: 'L’anteprima', d: 'Il risultato alla Direzione, prima di tutti · una settimana prima' },
    { l: 'La giornata', d: 'Il risultato davanti a chi lo porterà a terra · gennaio–febbraio 2027' },
  ],
  dettaglio: [
    { fig: 'un-posto-solo', a: 'Un gruppo di lavoro solo', r: 'Stesso ambiente, un punto fisso ogni settimana.' },
    { fig: 'prova-su-una-parte', a: 'Un perimetro dichiarato', r: 'Due fonti di dati nel primo giro, scritte in partenza.' },
    { fig: 'chi-chiede-chi-approva', a: 'Chi decide che cosa', r: 'La Direzione sceglie i casi; FS Technology governa i dati.' },
  ],
};

export const CRITERI = {
  eyebrow: 'Prima di cominciare',
  titolo: 'Che cosa vuol dire riuscire si scrive il primo giorno',
  sub: 'Quattro misure, concordate con voi. Alla giornata si guardano queste, non altre.',
  ancore: [
    { k: 'Venduto', t: 'Quanto fa vendere la proposta', b: 'Rispetto a chi non l’ha ricevuta.' },
    { k: 'Tempo', t: 'Dal dato all’azione', b: 'Quanto ci vuole a passare da un’evidenza a una prova.' },
    { k: 'Canali', t: 'Che cosa si vede in più', b: 'Il percorso fra app, sito e gli altri canali.' },
    { k: 'Scala', t: 'Quanto costa allargare', b: 'Che cosa serve per farlo diventare ordinario.' },
  ],
};

/* ── 04 · La giornata ──────────────────────────────────────────────────── */
export const SCALETTA = {
  eyebrow: 'La giornata, ora per ora',
  titolo: 'La mattina il risultato, il pomeriggio le scelte',
  sub: 'Una giornata intera, a Roma. La Direzione è presente nel primo blocco e alla rotta.',
  voci: [
    { o: '09:30', t: 'Apertura', d: 'Padrone di casa la Direzione Sales', dir: true },
    { o: '10:00', t: 'La prova', d: 'Il risultato sui vostri dati, presentato dal gruppo di lavoro comune. Poi le domande della sala, con la risposta dal vivo', dir: true },
    { o: '11:30', t: 'Le mani sugli strumenti', d: 'Tre postazioni a rotazione: leggere, proporre, produrre' },
    { o: '14:30', t: 'Chi l’ha fatto', d: 'Un’azienda di viaggio racconta come si è organizzata' },
    { o: '15:15', t: 'Le priorità, scelte insieme', d: 'Dieci casi d’uso, ne restano tre' },
    { o: '16:00', t: 'La squadra che serve', d: 'Chi fa che cosa, fra interni, partner e Adobe' },
    { o: '16:45', t: 'La rotta', d: 'Le tappe a 3, 6 e 9 mesi', dir: true },
    { o: '17:15', t: 'Il vostro giudizio, e la chiusura', d: 'Domande in sala, dal vivo' },
  ],
};

export const POSTAZIONI = {
  eyebrow: 'Le mani sugli strumenti',
  titolo: 'Due ore, tre postazioni, gruppi misti',
  sub: 'Al tavolo siedono insieme business, tecnologia e partner. Una postazione la conduce il partner.',
  ancore: [
    { k: 'Leggere', t: 'Che cosa dicono i percorsi', b: 'Customer Journey Analytics sui dati della prova.' },
    { k: 'Proporre', t: 'Una proposta per un pubblico vero', b: 'Un’attività di Adobe Target su un vostro segmento.' },
    { k: 'Produrre', t: 'Le varianti per ogni canale', b: 'Immagini e testi declinati con Adobe Firefly.' },
  ],
  chiusa: 'Le varianti prodotte al tavolo diventano il primo test dopo la giornata.',
};

export const PRIORITA = {
  eyebrow: 'Le priorità',
  titolo: 'Le sceglie chi poi le porterà a terra',
  sub: 'Una lista di dieci casi d’uso, preparata con il vostro team. Gruppi misti, un budget e un tempo dati.',
  ancore: [
    { k: 'Si entra con', t: 'Dieci casi d’uso', b: 'Preparati prima, con uno spazio per quelli nuovi.' },
    { k: 'Si decide', t: 'I primi tre', b: 'Con i vincoli veri: dati, rilasci, budget.' },
    { k: 'Si esce con', t: 'Un elenco firmato', b: 'L’ordine che apre la rotta.' },
  ],
};

/* ── 05 · Chi c'è ──────────────────────────────────────────────────────── */
export const RUOLI = {
  eyebrow: 'Al tavolo',
  titolo: 'Ognuno porta il pezzo che gli spetta',
  sub: 'Il progetto lo guida la Direzione Sales. Adobe organizza e porta il lavoro sui dati.',
  colonne: [
    { k: 'Trenitalia', t: 'Chi vende', b: 'La Direzione Sales sceglie, e i suoi team digitali lavorano alla prova con noi.' },
    { k: 'FS Technology e partner', t: 'Chi porta a terra', b: 'L’accesso ai dati, l’integrazione, la messa in opera.' },
    { k: 'Adobe', t: 'Chi porta il metodo', b: 'Il lavoro sui dati, il prodotto, il modello organizzativo.' },
  ],
};

export const ESEMPIO = {
  eyebrow: 'Chi l’ha già fatto',
  titolo: 'Un’azienda di viaggio che ha fatto lo stesso passaggio',
  sub: 'Da Analytics a una lettura dei percorsi fra web, email e app, per più prenotazioni e più servizi venduti.',
  punti: [
    { n: 'L’organizzazione', f: 'Un responsabile per ogni piattaforma, sotto la direzione digitale.' },
    { n: 'Il metodo', f: 'Un programma di test continuo, con un elenco di casi d’uso in coda.' },
  ],
  chiusa: 'Il nome si conferma prima della giornata, insieme alla disponibilità a raccontarlo.',
};

/* ── 06 · Che cosa resta ───────────────────────────────────────────────── */
export const ROTTA = {
  eyebrow: 'La rotta',
  titolo: 'Tre tappe, un responsabile per ciascuna',
  sub: 'La giornata chiude con una rotta scritta insieme. Le tappe qui sotto sono il punto di partenza.',
  passi: [
    { l: '3 mesi', d: 'I primi tre casi d’uso in produzione, misurati sul venduto' },
    { l: '6 mesi', d: 'La lettura dei percorsi su tutti i canali digitali' },
    { l: '9 mesi', d: 'Un modo di lavorare stabile: idea, prova, misura, ogni settimana' },
  ],
};

export const PASSO = {
  eyebrow: 'Il prossimo passo',
  titolo: 'Scegliere insieme i casi d’uso della prova',
  sub: 'Un’ora con il vostro team, entro fine novembre. Da lì partono le altre tappe.',
};
