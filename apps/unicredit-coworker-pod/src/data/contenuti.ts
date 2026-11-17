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

/** Capitolo 02 — le sei famiglie di domande su Analytics. Il prompt è al
    singolare perché è una chat (eccezione dichiarata alla voce istituzionale).
    `oggi` è una NOSTRA ipotesi su come lavora il team, e la slide lo dice. */
export const CATEGORIE = [
  { a: 'Domande al volo', p: 'Come si dividono le visite tra sito, app e mobile web?',
    oggi: 'Un progetto Workspace, o una richiesta all’analista', con: 'La domanda in chat, la risposta con grafico e tabella' },
  { a: 'Dove si perdono le persone', p: 'Dove perdiamo chi inizia una richiesta online?',
    oggi: 'Un funnel da costruire in Workspace, passo per passo', con: 'Il funnel e i punti di abbandono, chiesti in una frase' },
  { a: 'Perché si è mosso un numero', p: 'Perché le richieste completate sono calate la settimana scorsa?',
    oggi: 'Un breakdown dopo l’altro, finché la causa si trova', con: 'Le dimensioni e i segmenti che spiegano la variazione' },
  { a: 'Chi si comporta diversamente', p: 'Chi inizia da mobile converte diversamente da chi inizia dal sito?',
    oggi: 'Un segmento da costruire e un confronto da impostare', con: 'I due segmenti messi a confronto, fianco a fianco' },
  { a: 'Dove arriveremo', p: 'A fine mese siamo in linea con l’obiettivo?',
    oggi: 'Una proiezione fatta a mano, fuori da Workspace', con: 'La previsione della metrica, calcolata sullo storico' },
  { a: 'Il mese in una pagina', p: 'Fammi la sintesi del mese per il management.',
    oggi: 'Una slide fatta a mano, un numero alla volta', con: 'Una sintesi del periodo in chat, da rivedere prima di girarla' },
];

/** Capitolo 03 — i quattro momenti di un test su Target. I prompt sono gli
    esempi della pagina Experience League delle skill, resi in italiano. */
export const MOMENTI = [
  { a: 'Capire', r: 'Che cosa è attivo, come va il portafoglio, se un test si può chiudere.', p: 'Questo test si può chiudere?' },
  { a: 'Decidere', r: 'Che cosa testare dopo, quanto traffico e quanti giorni servono.', p: 'Quanti giorni servono per vedere un +5%?' },
  { a: 'Costruire', r: 'L’attività, il Visual Experience Composer, il link di QA, l’audience.', p: 'Crea un test A/B sulla homepage.' },
  { a: 'Tenere in ordine', r: 'Collisioni, configurazioni sbagliate, Recommendations che non funzionano.', p: 'Ci sono collisioni fra le attività?' },
];

/** Capitolo 04 — il giro dal numero al test. `lato` dice dove sta l'ancora
    rispetto al nodo. */
export const PASSI = [
  { a: 'Analytics trova dove si perde', p: 'Adobe Analytics', lato: 'su' },
  { a: 'Coworker propone che cosa testare', p: 'Coworker', lato: 'dx' },
  { a: 'Il test si dimensiona sul traffico vero', p: 'Coworker su Target', lato: 'dx' },
  { a: 'Target lo mette in linea', p: 'Adobe Target', lato: 'sx' },
  { a: 'Il risultato torna nella stessa conversazione', p: 'Coworker', lato: 'sx' },
];

/** Capitoli 01 e 05 — le quattro tappe. Data solo sulla quarta: è l'unica
    detta al cliente (mail dell'AE del 6 nov 2026). Il referente non si nomina:
    il deck parla all'organizzazione e il repo è pubblico. */
export const TAPPE = [
  { k: 'Oggi', t: 'Le categorie e le vostre priorità' },
  { k: 'Dopo la sessione', t: 'Il PM del programma riceve il contesto' },
  { k: 'Poi', t: 'Il kickoff' },
  { k: 'Fine gennaio, inizio febbraio', t: 'Il primo punto con la direzione' },
];

/** Capitolo 05 — le tre cose che servono dal team. */
export const SERVONO = [
  { a: 'Le due o tre categorie che contano', r: 'Quelle da cui volete partire, nell’ordine che decidete voi.' },
  { a: 'Come le fate oggi', r: 'Chi, con che strumento, quanto tempo.' },
  { a: 'Da quale report suite partire', r: 'Quella su cui il programma lavora per primo.' },
];

