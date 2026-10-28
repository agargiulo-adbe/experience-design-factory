/**
 * I casi d'uso, in un posto solo.
 *
 * PERCHÉ ESISTE QUESTA SEZIONE
 * Chiesta dal Direttore dei canali digitali il 27 ottobre 2026, con parole sue:
 * «quello che è importante è avere in mente dei casi vittoriosi, dei veri e
 * propri casi […] riusciamo ad avere un quadro di 4-5 casi d'uso importanti?
 * L'obiettivo finale è vendere di più». E con un vincolo ripetuto due volte,
 * che è il motivo per cui ogni caso qui porta anche il lato marketer: «se tu
 * mi dai il pezzo di ferro e poi mi devo costruire tutto da solo… noi vogliamo
 * vendere il sistema, io me lo compro e poi non so che fare».
 *
 * L'ORDINE NON È CASUALE: è il suo schema, non il nostro. Sempre dalla stessa
 * riunione: «a vendere di più ci arrivi facendo entrare più persone nel
 * negozio; oppure sei così bravo dentro che quei clienti, pur essendo meno,
 * convertono di più». Quindi i casi si raggruppano in `leva`: `conversione`
 * (chi è già entrato) e `traffico` (chi deve ancora entrare).
 *
 * I DUE PERIMETRI
 * Il responsabile della piattaforma dati ha ristretto il perimetro il 9 ottobre
 * a **trenitalia.com + CRM**; il Direttore il 27 lo ha allargato a **T-com,
 * Le Frecce, app e CRM**, con una ragione: «non dimenticherei l'altra metà del
 * mio pianeta, i clienti non iscritti al CRM, che sono la metà precisa».
 * Il deck non sceglie: ogni caso dichiara le fonti che richiede, e la figura
 * accende o spegne quelle fuori perimetro. Così la stessa pagina dice a uno
 * che cosa guadagnerebbe allargando e all'altro che cosa perde restringendo.
 */

/** Le fonti che un caso d'uso può richiedere. L'ordine è quello della figura. */
export type Fonte = 'tcom' | 'frecce' | 'app' | 'crm' | 'terzi';

export const FONTI: { id: Fonte; nome: string; nota: string; ristretto: boolean }[] = [
  { id: 'tcom', nome: 'trenitalia.com', nota: 'Adobe Analytics', ristretto: true },
  { id: 'frecce', nome: 'Le Frecce', nota: 'Adobe Analytics', ristretto: false },
  { id: 'app', nome: 'App', nota: 'la parte più grande del traffico', ristretto: false },
  { id: 'crm', nome: 'CRM', nota: 'in costruzione, fornitore di dati', ristretto: true },
  { id: 'terzi', nome: 'Società del gruppo e partner', nota: 'in clean room', ristretto: false },
];

/** Il perimetro ristretto: le fonti della prima fase concordata il 9 ottobre. */
export const RISTRETTO: Fonte[] = FONTI.filter((f) => f.ristretto).map((f) => f.id);

export interface Caso {
  id: string;
  /** La leva di vendita, con le sue parole: più gente dentro, o conversione migliore. */
  leva: 'conversione' | 'traffico';
  /** Il nome del caso. Sei parole al massimo: è un'ancora. */
  titolo: string;
  /** Una riga: che cosa cambia. */
  punto: string;
  /** Com'è oggi — e dove possibile sono parole loro, non nostre. */
  oggi: string;
  /** Che cosa vede il viaggiatore. È il lato visibile. */
  viaggiatore: string;
  /** Che cosa fa chi lavora in marketing. È il lato che decide se la cosa esiste. */
  marketer: string;
  /** Le fonti che servono: decidono se il caso sta dentro il perimetro ristretto. */
  fonti: Fonte[];
  /**
   * I tre gesti di chi lo prepara: scegliere il gruppo, scegliere che cosa
   * mostrargli, misurare. Sono tre e non quattro perché il quarto nessuno se
   * lo ricorda, e perché il terzo — la misura — è quello che rende la cosa
   * una prova e non una scommessa.
   */
  passi: [string, string, string];
  /** Chi l'ha messo sul tavolo: `cliente` pesa molto più di `adobe`. */
  origine: 'cliente' | 'adobe';
}

export const CASI: Caso[] = [
  {
    id: 'geo',
    leva: 'conversione',
    titolo: 'La home sa da dove parti',
    punto: 'Chi arriva da Verona vede le tratte da Verona, non la pagina di tutti.',
    // Verbatim del 27 ott: «ti colleghi da Verona, io sull'homepage faccio
    // vedere i quattro principali collegamenti da Verona, da 19, 29, 39 euro».
    oggi: 'Si fa con un pop-up sopra la pagina. Le sue parole: «mi piacerebbe che i componenti si adattassero in automatico, non un pop-up in testa».',
    viaggiatore: 'La prima schermata porta le tratte che partono da dove si trova, con le fasce di prezzo.',
    marketer: 'Una regola per area di partenza, e un elenco di tratte pronte da abbinare. Si prepara una volta e vale per tutte le città.',
    fonti: ['tcom', 'frecce'],
    passi: ['Gruppo: chi arriva da una certa area', 'Mostra: le tratte da quella stazione, con le fasce', 'Misura: quanti proseguono fino all’acquisto'],
    origine: 'cliente',
  },
  {
    id: 'upgrade',
    leva: 'conversione',
    titolo: 'L’upgrade che oggi si offre a tutti',
    punto: 'La stessa proposta, fatta a chi ha davvero motivo di accettarla.',
    // Dalla sintesi d'account del 27 ott: «la proposta di passaggio a classe
    // superiore a costo zero o a costo marginale oggi si fa a tutti i
    // viaggiatori e non su base propensione».
    oggi: 'Il passaggio di classe a costo zero o quasi si propone a tutti i viaggiatori, non a chi ha propensione a prenderlo.',
    viaggiatore: 'Chi viaggia sempre in Standard trova, per ventiquattr’ore, la Business al prezzo della Standard su un treno con posti liberi.',
    marketer: 'Il segmento esce dalla vista unica, «sempre Standard, alta frequenza», e diventa un’offerta a tempo su treni scelti. Si misura su due settimane.',
    fonti: ['tcom', 'crm'],
    passi: ['Gruppo: viaggia sempre in Standard, spesso', 'Mostra: Business al prezzo Standard, 24 ore', 'Misura: quante salite di classe in più'],
    origine: 'cliente',
  },
  {
    id: 'ritorno',
    leva: 'conversione',
    titolo: 'Chi torna senza dire chi è',
    punto: 'Metà del traffico non è registrato, e oggi riparte da zero ogni volta.',
    oggi: 'Le vendite sono per metà di clienti iscritti e per metà no. Chi torna senza login riparte dalla pagina di chiunque.',
    viaggiatore: 'Chi era già passato ritrova in evidenza la tratta che aveva cercato, senza aver fatto login.',
    marketer: 'Un gruppo costruito sul comportamento invece che sull’anagrafica: ultima ricerca, frequenza, giorno della settimana.',
    fonti: ['tcom', 'app'],
    passi: ['Gruppo: già passato, senza login', 'Mostra: la tratta che aveva cercato', 'Misura: quanti tornano e comprano'],
    origine: 'cliente',
  },
  {
    id: 'oro',
    leva: 'conversione',
    titolo: 'Il cliente Oro trattato da Oro',
    punto: 'Il livello della carta sta nel CRM e non arriva alla pagina.',
    oggi: 'Chi è abbonato da anni vede la stessa pagina di un visitatore di passaggio.',
    viaggiatore: 'Al riconoscimento arriva il servizio compreso nel suo livello. Non uno sconto: una cosa che gli altri non hanno.',
    marketer: 'Il livello arriva dal CRM come attributo e diventa una condizione di esposizione, non una campagna a parte.',
    fonti: ['tcom', 'crm'],
    passi: ['Gruppo: livello carta dal CRM', 'Mostra: il servizio che quel livello comprende', 'Misura: uso del servizio e ritorno nel tempo'],
    origine: 'adobe',
  },
  {
    id: 'insieme',
    leva: 'traffico',
    titolo: 'I clienti che avete in due',
    punto: 'Sapere chi è già cliente anche dall’altra parte, senza scambiarsi gli elenchi.',
    oggi: 'Le due società non possono unire le liste, quindi non sanno quanto si sovrappongono.',
    viaggiatore: 'Chi ha già prenotato dall’altra parte trova l’offerta che tiene insieme le due cose, invece di due offerte scollegate.',
    marketer: 'In uno spazio neutro si misura la sovrapposizione: ciascuno tiene i propri dati, e si attiva solo il gruppo comune.',
    fonti: ['terzi'],
    passi: ['Gruppo: la sovrapposizione fra le due basi', 'Mostra: l’offerta che tiene insieme le due cose', 'Misura: quanti comprano entrambe'],
    origine: 'adobe',
  },
];

/** Un caso è nel perimetro ristretto se tutte le sue fonti lo sono. */
export const dentroRistretto = (c: Caso) => c.fonti.every((f) => RISTRETTO.includes(f));

/**
 * La referenza pubblica che regge il capitolo. Brightline è l'unico operatore
 * ferroviario con una storia Adobe PUBBLICA e numeri citabili: alta velocità,
 * posizionamento premium, la stessa combinazione di strumenti. Gli altri casi
 * che abbiamo (una compagnia aerea americana, un operatore ferroviario
 * nordamericano, un portale di viaggi) stanno in materiale riservato: si
 * raccontano senza nome, e senza cifre che non siano pubbliche.
 */
export const RIFERIMENTO = {
  nome: 'Brightline',
  cosa: 'Operatore ferroviario ad alta velocità, posizionamento premium, stessa combinazione di strumenti.',
  numeri: [
    { v: '70%', l: 'più rapida la prenotazione in app' },
    { v: '95%', l: 'della crescita dei ricavi arriva dai canali digitali' },
    { v: '618%', l: 'in più il traffico organico non di marca' },
  ],
  url: 'https://business.adobe.com/customer-success-stories/brightline.html',
  // Verificato il 28 ott 2026 sulla pagina stessa: «70% reduction in time to
  // book in-app», «95% of revenue growth now comes from digital channels»,
  // «618% increase in traffic from unbranded organic search». I prodotti che la
  // pagina dichiara sono RTCDP, CJA, AJO, AEM Sites e Assets — la stessa
  // combinazione di cui parla Convergenza, ed è il motivo per cui regge qui.
};
