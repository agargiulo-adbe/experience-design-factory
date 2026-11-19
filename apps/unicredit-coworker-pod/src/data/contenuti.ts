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

/** Capitolo 02 — le sei famiglie di domande su Analytics. `chiedi` è la stessa
    domanda accorciata per la mappa del capitolo 01: una domanda vera, col punto
    interrogativo, perché si capisca che è una cosa che si chiede a Coworker (con
    le sole etichette «Al volo», «Dove si perde» non si capiva, 18 nov 2026). Il prompt è al
    singolare perché è una chat (eccezione dichiarata alla voce istituzionale).
    `oggi` è una NOSTRA ipotesi su come lavora il team, e la slide lo dice. */
export const CATEGORIE = [
  { a: 'Domande al volo', breve: 'Al volo', chiedi: 'Come si dividono le visite?', p: 'Come si dividono le visite tra sito, app e mobile web?',
    oggi: 'Un progetto Workspace, o una richiesta all’analista', con: 'La domanda in chat, la risposta con grafico e tabella' },
  { a: 'Dove le persone abbandonano', breve: 'Dove si perde', chiedi: 'Dove perdiamo le richieste?', p: 'Dove perdiamo chi inizia una richiesta online?',
    oggi: 'Un funnel da costruire in Workspace, step dopo step', con: 'Il funnel e i punti di abbandono, chiesti in una frase' },
  { a: 'Perché si è mosso un numero', breve: 'Perché si è mosso', chiedi: 'Perché sono calate le richieste?', p: 'Perché le richieste completate sono calate la settimana scorsa?',
    oggi: 'Un breakdown dopo l’altro, o Contribution Analysis se l’avete', con: 'Le dimensioni e i segmenti che spiegano la variazione' },
  { a: 'Chi si comporta diversamente', breve: 'Chi è diverso', chiedi: 'Chi converte diversamente?', p: 'Chi inizia da mobile converte diversamente da chi inizia dal sito?',
    oggi: 'Un segmento da costruire e un confronto da impostare', con: 'I due segmenti messi a confronto, fianco a fianco' },
  { a: 'Dove arriveremo', breve: 'Dove arriveremo', chiedi: 'Dove arriviamo a fine mese?', p: 'Se continua così, quante richieste chiudiamo a fine mese?',
    oggi: 'Una trendline in Workspace, o una proiezione a mano', con: 'La previsione della metrica, calcolata sullo storico' },
  { a: 'Il mese in una pagina', breve: 'La sintesi del mese', chiedi: 'Mi fai la sintesi del mese?', p: 'Fammi la sintesi del mese per il management.',
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
  { a: 'Trova dove si perde', p: 'Adobe Analytics', lato: 'su' },
  { a: 'Propone che cosa testare', p: 'Coworker', lato: 'dx' },
  { a: 'Dimensiona il test: campione e durata', p: 'Coworker su Target', lato: 'giu-dx' },
  { a: 'Prepara l’attività, l’attivate voi', p: 'Coworker su Target', lato: 'giu-sx' },
  { a: 'Il risultato torna in chat', p: 'Coworker', lato: 'sx' },
];

/** Capitoli 01 e 04 — le cinque tappe. Due date sole, e nessuna è un giorno:
    «circa tre settimane dopo» il kickoff per Target (accordo interno Adobe del
    17 nov 2026) e «fine gennaio, inizio febbraio» per il primo punto della
    situazione (mail dell'AE del 6 nov 2026; dal 19 nov senza nominare chi
    partecipa, su richiesta dell'owner). Le date esatte le conferma il team
    Adobe. Il referente non si nomina: il deck parla all'organizzazione e il
    repo è pubblico. */
export const TAPPE = [
  { k: 'Oggi', t: 'Le vostre priorità' },
  { k: 'Dopo la sessione', t: 'Il contesto passa a chi guiderà il programma per Adobe' },
  { k: 'Poi', t: 'Il kickoff su Analytics' },
  { k: 'Circa tre settimane dopo', t: 'Entra Target' },
  { k: 'Fine gennaio, inizio febbraio', t: 'Il primo punto della situazione, insieme' },
];

/** Capitolo 04 — le tre risposte che servono dal team per partire. `chi` dice
    chi la porta: per funzione, mai un nome (repo pubblico) e mai «da chiedere»
    in una slide che va al cliente. Riscritte il 19 nov 2026 sull'esperienza di
    un altro cliente Coworker × Analytics (call e mail ott-nov 2026): per
    l'attivazione Adobe ha chiesto soltanto l'IMS Org e gli utenti nominali, il
    rollout è partito da poche persone; la report suite NON è un prerequisito
    (Coworker la chiede in chat, fra quelle che l'utente vede), ma serve
    sceglierne una di traffico vero per la prima prova. Le priorità ora stanno
    nella slide che le mette in ordine. */
export const SERVONO = [
  { a: 'L’IMS Org di Analytics e Target', r: 'Con quella Adobe attiva Coworker per la vostra organizzazione, entro il kickoff.', chi: 'Con chi amministra Analytics' },
  { a: 'Le prime persone', r: 'Poche, con nome e utenza Adobe. Coworker vede quello che ciascuna vede già in Analytics.', chi: 'Oggi in sala, poi con chi amministra Analytics' },
  { a: 'La report suite per la prima prova', r: 'Una con traffico vero, da salvare come preferenza: senza, Coworker la chiede a ogni conversazione.', chi: 'Con chi amministra Analytics' },
];

/** Capitolo 04 — le altre due voci (panel del 17 nov 2026): come si dirà che
    ha funzionato, e chi serve dal team. Si cominciano a definire oggi, in sala,
    e si confermano con chi guida i canali (18 nov 2026). */
export const SERVONO_2 = [
  { a: 'Come si dice che ha funzionato', r: 'Due o tre misure da proporre oggi, per esempio il tempo per evadere una richiesta, le domande chiuse senza analista, le ore di report a mano risparmiate. Si confermano con chi guida i canali.', chi: 'Oggi in sala, poi con chi guida i canali' },
  { a: 'Chi serve da voi', r: 'Un’analista Analytics, chi amministra Analytics e, per la seconda fase, chi possiede Target.', chi: 'Oggi in sala, poi con chi guida i canali' },
];

/** Capitolo 04 — la tavola delle priorità («Da dove vi piacerebbe partire?»),
    sul meccanismo della slide di Intesa del 16 nov 2026: un tocco mette in
    ordine, un secondo toglie il numero. Le domande di Analytics sono quelle del
    capitolo 02 (`CATEGORIE`, in forma breve); queste sono quelle di Target,
    dal capitolo 03: il giro dal calo al test e i momenti di un test. */
export const TEMI_TARGET = [
  { a: 'Dal calo al test A/B', q: 'Dove perdiamo le richieste, e che cosa testiamo?' },
  { a: 'Come vanno i test', q: 'Il test si può chiudere?' },
  { a: 'Che cosa testare dopo', q: 'Quanti giorni servono per vedere un +5%?' },
  { a: 'Preparare un test', q: 'Crea un test A/B sulla homepage.' },
  { a: 'Le attività in ordine', q: 'Ci sono collisioni fra le attività?' },
];
