/**
 * La copia del deck che sta in tabelle: una fonte sola, qui e non dentro le
 * pagine. Due ragioni. `copy-audit` misura i campi dei file di dati e il testo
 * del markup, NON gli array scritti nel frontmatter di una pagina: lì la copia
 * sarebbe invisibile al gate. E la linea del tempo sta in due capitoli: scritta
 * due volte, divergerebbe alla prima correzione.
 *
 * Gli a capo si legano qui, con uno spazio unificatore sulla coppia che
 * `audit:wrap` ha trovato appesa: mai su tutta la frase.
 */

/** Capitolo 02 — le sei famiglie di domande su Analytics. `breve` è la parola
    che le nomina sulla mappa del capitolo 01: due o tre parole, non di più. Il prompt è al
    singolare perché è una chat (eccezione dichiarata alla voce istituzionale).
    `oggi` è una NOSTRA ipotesi su come lavora il team, e la slide lo dice. */
export const CATEGORIE = [
  { a: 'Domande al volo', breve: 'Al volo', p: 'Come si dividono le visite tra sito, app e mobile web?',
    oggi: 'Un progetto Workspace, o una richiesta all’analista', con: 'La domanda in chat, la risposta con grafico e tabella' },
  { a: 'Dove si perdono le persone', breve: 'Dove si perde', p: 'Dove perdiamo chi inizia una richiesta online?',
    oggi: 'Un funnel da costruire in Workspace, passo per passo', con: 'Il funnel e i punti di abbandono, chiesti in una frase' },
  { a: 'Perché si è mosso un numero', breve: 'Perché si è mosso', p: 'Perché le richieste completate sono calate la settimana scorsa?',
    oggi: 'Un breakdown dopo l’altro, o Contribution Analysis se l’avete', con: 'Le dimensioni e i segmenti che spiegano la variazione' },
  { a: 'Chi si comporta diversamente', breve: 'Chi è diverso', p: 'Chi inizia da mobile converte diversamente da chi inizia dal sito?',
    oggi: 'Un segmento da costruire e un confronto da impostare', con: 'I due segmenti messi a confronto, fianco a fianco' },
  { a: 'Dove arriveremo', breve: 'Dove arriveremo', p: 'Dove arriva la metrica a fine mese, se l’andamento resta questo?',
    oggi: 'Una trendline in Workspace, o una proiezione a mano', con: 'La previsione della metrica, calcolata sullo storico' },
  { a: 'Il mese in una pagina', breve: 'La sintesi del mese', p: 'Fammi la sintesi del mese per il management.',
    oggi: 'Una slide fatta a mano, o un progetto pianificato', con: 'Una sintesi del periodo in chat, da rivedere prima di girarla' },
];

/** Capitolo 03 (Analytics e Target) e la mappa del capitolo 01 — i quattro momenti di un test su Target. I prompt sono gli
    esempi della pagina Experience League delle skill, resi in italiano. */
export const MOMENTI = [
  { a: 'Capire', r: 'Che cosa è attivo, come va il portafoglio, se un test si può chiudere.', p: 'Il test si può chiudere?' },
  { a: 'Decidere', r: 'Che cosa testare dopo, quanto traffico e quanti giorni servono.', p: 'Quanti giorni servono per vedere un +5%?' },
  { a: 'Costruire', r: 'L’attività, il Visual Experience Composer, il link di QA, l’audience.', p: 'Crea un test A/B sulla homepage.' },
  { a: 'Tenere in ordine', r: 'Collisioni, configurazioni sbagliate, Recommendations che non funzionano.', p: 'Ci sono collisioni fra le attività?' },
];

/** Capitolo 03 — il giro dal numero al test. `lato` dice dove sta l'ancora
    rispetto al nodo. */
export const PASSI = [
  { a: 'Analytics trova dove si perde', p: 'Adobe Analytics', lato: 'su' },
  { a: 'Coworker propone che cosa testare', p: 'Coworker', lato: 'dx' },
  { a: 'Il test si dimensiona: campione, durata, lift rilevabile', p: 'Coworker su Target', lato: 'dx' },
  { a: 'Coworker prepara l’attività e può attivarla; nel programma l’attivazione resta a voi', p: 'Coworker su Target', lato: 'giu' },
  { a: 'Il risultato torna nella stessa conversazione', p: 'Coworker', lato: 'sx' },
];

/** Capitoli 01 e 04 — le cinque tappe. Due date sole, e nessuna è un giorno:
    «circa tre settimane dopo» il kickoff per Target (accordo interno Adobe del
    17 nov 2026) e «fine gennaio, inizio febbraio» per il primo punto con la
    direzione (mail dell'AE del 6 nov 2026). Le date esatte le conferma il team
    Adobe. Il referente non si nomina: il deck parla all'organizzazione e il
    repo è pubblico. */
export const TAPPE = [
  { k: 'Oggi', t: 'Le vostre priorità' },
  { k: 'Dopo la sessione', t: 'Il contesto passa a chi guiderà il programma, appena assegnato' },
  { k: 'Poi', t: 'Il kickoff su Analytics' },
  { k: 'Circa tre settimane dopo', t: 'Entra Target' },
  { k: 'Fine gennaio, inizio febbraio', t: 'Il primo punto con la direzione' },
];

/** Capitolo 04 — le tre risposte che servono dal team per partire. `chi` dice
    chi la porta: per funzione, mai un nome (repo pubblico) e mai «da chiedere» in una slide che va al cliente. */
export const SERVONO = [
  { a: 'Le due o tre categorie che contano', r: 'Quelle da cui volete partire, nell’ordine che decidete voi.', chi: 'Oggi, in sala' },
  { a: 'Come le fate oggi', r: 'Chi, con che strumento, quanto tempo.', chi: 'Oggi, in sala' },
  { a: 'Da quale report suite partire', r: 'Quella su cui il programma lavora per primo.', chi: 'Con chi amministra Analytics' },
];

/** Capitolo 04 — le altre due voci (panel del 17 nov 2026): come si dirà che
    ha funzionato, e chi serve dal team. Si scelgono oggi, in sala. */
export const SERVONO_2 = [
  { a: 'Come si dice che ha funzionato', r: 'Due o tre misure da scegliere oggi: tempo per evadere una richiesta, domande chiuse senza passare dall’analista, ore di report a mano risparmiate.', chi: 'Oggi, in sala' },
  { a: 'Chi serve da voi', r: 'Un’analista Analytics, chi amministra Analytics e, per la seconda fase, chi possiede Target.', chi: 'Oggi, in sala' },
];
