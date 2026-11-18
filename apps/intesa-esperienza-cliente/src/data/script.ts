/**
 * LO SCRIPT DI CHI PRESENTA LA PARTE 02-03 (owner, 18 nov 2026).
 *
 * Stesso testo del PDF «Il mio intervento» (docs/Intesa Sanpaolo/, git-ignorato):
 * frase-àncora, minuto e durata, il testo con i ↓ (un ↓ = un sotto-passo), il «da
 * non dire». Lo leggono `/relatore/` e la finestra presentatore, che prima
 * mostravano note diverse dal PDF (owner: «non cita le frasi dello scheletro e non
 * c'è script sul blocco come funziona»).
 *
 * ⚠️ Una frase si cambia QUI e nel PDF insieme: il controllo di allineamento
 * confronta i due testi parola per parola. Pubblico come il deck: solo ciò che è
 * già in slide o nelle note.
 */
export interface Battuta {
  quando: string;        // minuto in cui si dovrebbe essere · durata
  inSlide?: string;      // il titolo esatto che si vede
  ancora?: string;       // la frase da sapere a memoria
  testo: string[];       // il resto, a parole proprie; «↓» = un sotto-passo
  no?: string;           // da non dire
  ponte?: string;
}

export const SCRIPT: Record<string, Record<string, Battuta>> = {
  "scenario": {
    "slide-cover": {"quando": "6:00 · 15\"", "inSlide": "«Capitolo 02 · Giulia: un mutuo, sette momenti»", "ancora": "Chi cerca un mutuo oggi comincia online, e spesso non è ancora vostro cliente: il primo segnale arriva prima che vi lasci il nome.", "testo": []},
    "slide-segnale": {"quando": "6:15 · 45\"", "inSlide": "«Chi cerca un mutuo si informa online e vuole poter simulare la rata» · 45% e 65%, poi prima dell’email / dopo email e consenso", "ancora": "Il cliente decide online prima di parlare con voi.", "testo": ["Lo dice il mercato, non noi: il 65% delle famiglie usa i canali digitali per informarsi sui mutui, e il 45% vuole poter simulare la rata. Nomisma e MutuiSupermarket.it, maggio di quest’anno.", "↓ Il primo segnale arriva quando la persona è ancora anonima. Prima dell’email la banca non può scriverle, ma può già raggiungerla: assistenti AI, annunci, sito. Dopo email e consenso può contattarla direttamente: email, filiale, app. Adesso lo vediamo su una persona sola, dal primo annuncio alla firma."], "no": "Non «la simula»: il 45% vuole simularla. Non «il segnale più forte»: la fonte non lo dice. Il dato è di mercato, non di Intesa."},
  },
  "persona": {
    "slide-cover": {"quando": "7:00 · 10\"", "inSlide": "«Giulia, 34 anni, non è vostra cliente», col ritratto", "ancora": "Giulia ha trentaquattro anni, cerca il suo primo mutuo e non è vostra cliente.", "testo": []},
    "slide-giro-di-giulia": {"quando": "7:10 · 35\"", "inSlide": "«Giulia diventa cliente in sette momenti» · il giro attorno al ritratto, legenda a destra, tre ↓", "testo": ["A sinistra, in alto, il punto di partenza: non è ancora cliente, la banca non sa niente di lei.", "↓ 01, in blu: cerca un mutuo con un assistente AI. ↓ 02, in rosa: vede l’annuncio. ↓ Dal 03 al 07, in verde, i momenti entrano da soli uno dopo l’altro: simula la rata, si interrompe, riprende la pratica, va in filiale, diventa cliente. Lo scorro veloce: ogni fermata è un momento, e li vediamo uno per uno.", "Alla fine, a sinistra in basso, «Dopo sette momenti»: ha firmato la richiesta, e la banca sa da dove è arrivata, dove si è fermata e quanto è costata la spesa pubblicitaria."]},
  },
  "momenti": {
    "slide-m-01": {"quando": "7:45 · 45\"", "inSlide": "«Farsi trovare» · «Chiede a un assistente AI quale mutuo scegliere e trova Intesa Sanpaolo»", "ancora": "Se il marchio non compare in quella risposta, il confronto comincia senza di voi.", "testo": ["Una sera, a casa.", "↓ Chiede a un assistente AI quale mutuo scegliere per la prima casa. La risposta cita tre banche, e Intesa Sanpaolo è fra queste.", "↓ In banca, con Brand Visibility: si misura su quali domande siete citati, nell’esempio tre su otto, e quelle che mancano diventano contenuti da creare. Per chi non vi conosce è la prima impressione, e spesso l’unica."]},
    "slide-m-02": {"quando": "8:30 · 45\"", "inSlide": "«Content Factory» · «Vede un annuncio sul mutuo per la prima casa a Torino»", "ancora": "È uno di dodici annunci nati da un solo brief, già validati su marchio e canale.", "testo": ["Il mattino dopo, sui social.", "↓ Vede un annuncio: «Prima casa a Torino? Calcola la rata in 2 minuti.»", "↓ In banca, con GenStudio for Performance Marketing: si vede quale annuncio rende di più sui social, e il brief successivo parte da lì. La verifica sta dentro la produzione, non dopo."]},
    "slide-m-03": {"quando": "9:15 · 1'", "inSlide": "«Ingaggio clienti e non clienti» · «Simula 180.000 euro su 25 anni e lascia l’email per salvare il risultato»", "ancora": "In quel momento smette di essere uno pseudonimo e diventa un profilo, con la sua storia.", "testo": ["La sera stessa, sul vostro sito.", "↓ Simula centottantamila euro su venticinque anni: 863 al mese. Per salvare il risultato lascia l’email e il consenso.", "↓ In banca, con Real-Time Activation: le due sere prima, fatte senza nome, si agganciano al suo profilo, perché il consenso alla profilazione c’era già, dato il 12 novembre. Nel CRM non c’è ancora: nessuna posizione, non è cliente."]},
    "slide-m-04": {"quando": "10:15 · 1'", "inSlide": "«Ingaggio clienti e non clienti» · «Si ferma perché le manca un documento»", "ancora": "Il profilo è sottile, due sessioni e una simulazione, ma basta per scegliere la proposta giusta.", "testo": ["La sera dopo torna sul sito.", "↓ Si ferma: le mancano le ultime due buste paga. Chiude e pensa di riprendere nel weekend. Intanto ha fatto la stessa domanda ad altre due banche.", "↓ In banca, con Journey Optimizer e AI Decisioning: quattro proposte. Regole e consensi ne escludono due, il contatto dalla Filiale Digitale (manca il consenso al contatto telefonico) e la polizza casa (è un’offerta per i clienti). Esce il promemoria con appuntamento, prima sul sito e poi per email. In questo esempio non c’è uno score sul non‑cliente: valgono la priorità dell’offerta e le regole della banca; se un vostro punteggio esiste, entra come attributo. La regola di contatto resta vostra. (Qui una pausa di un secondo.)"]},
    "slide-m-05": {"quando": "11:15 · 45\"", "inSlide": "«Ingaggio clienti e non clienti» · «Riceve un’email e completa la richiesta»", "ancora": "Il percorso parte dal gesto, non dal calendario.", "testo": ["Il mattino dopo, alle otto.", "↓ Riceve un’email: «Giulia, la tua simulazione ti aspetta». Importo, durata, rata, le due buste paga che mancano, il link per riprenderla e, in alternativa, la filiale mercoledì alle 11:30. Carica i documenti mentre fa colazione e sceglie l’appuntamento.", "↓ In banca, con Journey Optimizer: la richiesta salvata fa partire il percorso. Dopo dodici ore, se non ha ripreso, la banca gliela ricorda per email, con un banner sul sito e con gli annunci di re-targeting. Solo con il consenso, e i già clienti sono esclusi."]},
    "slide-m-06": {"quando": "12:00 · 45\"", "inSlide": "«Ingaggio clienti e non clienti» · «In filiale il gestore ha già aperta la sua simulazione»", "ancora": "Il gestore ha già aperta la sua simulazione.", "testo": ["Il mercoledì, in filiale, alle 11:30.", "↓ Il gestore non le chiede di raccontare da capo quello che ha fatto sul sito: nella scheda ci sono la simulazione a 863 al mese e i documenti caricati. Resta da firmare in sede.", "↓ In banca, con Journey Optimizer: quando conferma l’appuntamento, il percorso scrive lead, ora, simulazione e consenso nel vostro CRM di filiale, via API o connettori nativi, e ne attende l’esito, l’appuntamento tenuto. Il gestore lavora nel CRM che usa già."]},
    "slide-m-07": {"quando": "12:45 · 1'", "inSlide": "«CX Analytics» · «Firma la richiesta e apre il conto: da oggi la pratica è nell’app»", "ancora": "Adesso si vede dove si perdono i non‑clienti, e quanto costa e quanto rende ogni canale, filiale compresa.", "testo": ["Il giorno della firma apre l’app della banca.", "↓ Ha firmato la richiesta in filiale e aperto il conto: da oggi pratica, istruttoria e documenti sono nell’app. Da qui in avanti il canale è vostro.", "↓ In banca, con Customer Journey Analytics: dalle visite alle simulazioni, ai consensi, alla filiale, alle richieste firmate; le firme attribuite ai canali, e il costo per richiesta firmata, canale per canale. Dati di esempio."], "ponte": "vi abbiamo raccontato la storia. Adesso guardiamo dove si attacca alla vostra architettura."},
  },
  "messa-a-terra": {
    "slide-cover": {"quando": "14:00 · 10\"", "inSlide": "«Capitolo 03 · Dove ci innestiamo»", "ancora": "Usciamo dalla storia: da qui guardiamo la vostra architettura.", "testo": []},
    "slide-innesto": {"quando": "14:10 · 2'20\"", "inSlide": "«Riconoscere, ingaggiare e misurare anche chi non è ancora cliente» · in alto il perimetro di Intesa, sotto Adobe Experience Platform, vuota fino al primo ↓", "ancora": "Quello che avete resta: Adobe aggiunge i non‑clienti e porta la Next Best Experience alle vostre iniziative programmate.", "testo": ["Prima di tutto: questa architettura è una nostra ipotesi, e vi chiediamo di correggerla.", "In alto, «Il perimetro di Intesa Sanpaolo», quello che avete: data lake, motore di targeting, iniziative commerciali sui clienti, programmate e su evento, e i canali, digitali e con un gestore.", "↓ Real-Time Activation riconosce chi non è ancora cliente: dal comportamento sul sito, poi dall’email.", "↓ Journey Optimizer, con AI Decisioning, sceglie la proposta e la porta sui canali, per i non‑clienti, programmate e su evento.", "↓ Customer Journey Analytics è l’unico dei tre che legge clienti e non‑clienti insieme. (Da qui parte il ciclo, ogni sette secondi: lascialo girare una volta.) La Next Best Experience bianca sale nelle vostre iniziative e accende «programmate»; poi Journey Optimizer porta la verde ai canali.", "↓ «Si parte da qui»: percorsi nuovi su Journey Optimizer, e le iniziative sui clienti restano sullo strumento di oggi. Le altre posizioni, sotto «Come possono evolvere le iniziative», le decidete voi, dopo la prima misura."], "no": "Non «SAS»: «il vostro motore di targeting». Non dire che le loro iniziative sono solo a calendario. Le iniziative su evento dei clienti con AI Decisioning non si promettono: il dato dei clienti arriva in ore. Nessun tempo di risposta come impegno."},
  },
};

/** «Come funziona», il racconto unico: le quattro righe di «come si legge» e gli undici passi, una frase ciascuno. */
export const COME_FUNZIONA = {
  "leggi": {
    "quando": "16:30 · 40\"",
    "ancora": "Prima di partire, vi dico come si legge.",
    "righe": [
      "In alto, Giulia: chi è per la banca (all’inizio non ha un nome), e a che punto è del suo percorso. Avanti →",
      "Al centro, tre componenti Adobe, da sinistra a destra: riconosce, sceglie e orchestra, misura. Avanti →",
      "A destra, quello che vede Giulia: il sito e l’email della banca. Avanti →",
      "In basso, i vostri sistemi di oggi: restano, e lavorano nello stesso flusso. Le pillole che si muovono sono i dati che passano da un sistema all'altro."
    ]
  },
  "passi": {
    "quando": "17:10 · 5'30\"",
    "come": "Una frase per passo. Prima lascia muovere la pillola, poi parla: il silenzio di due secondi fa leggere la sala.",
    "righe": [
      "Arriva dall'annuncio: i cookie di profilazione li ha accettati alla prima visita. Il sistema sa che cosa fa, non chi è.",
      "Simula la rata ed entra in tempo reale nel segmento «mutuo prima casa».",
      "Lascia email e consenso, e nasce il codice pratica: le visite di prima si uniscono al suo profilo.",
      "Si ferma per un documento. Journey Optimizer lo sa subito; gli score del vostro motore, se esistono sul non cliente, arrivano come attributi.",
      "AI Decisioning mette in fila quattro proposte: regole e consenso ne escludono due, vince il promemoria con appuntamento, che compare subito sul sito.",
      "Il mattino dopo la proposta arriva per email, e Giulia riprende la pratica.",
      "In filiale apre la pratica: è la stessa della simulazione. Il lead arriva nel CRM di filiale, via API o connettori nativi.",
      "Firma: il core emette l'NDG e lo lega al codice pratica. È un'ipotesi di lavoro, e la diciamo così. Customer Journey Analytics legge sito, app, CRM e Filiale Digitale in un percorso solo. A destra, adesso, Giulia vede la sua pratica nell'app.",
      "Le firme si attribuiscono ai canali, filiale compresa. Se la campagna ha funzionato, lo dice il gruppo di controllo.",
      "Da cliente, Giulia esce dalla proposta del mutuo. E da chi ha firmato nasce un'audience look‑alike: serve a trovare il prossimo non cliente.",
      "Ora Giulia è cliente: il dato arriva alle vostre iniziative commerciali, nelle campagne programmate. Sulle proposte, da qui, decide il vostro motore."
    ],
    "no": "L'NDG nasce alla firma, non all'apertura della pratica. Non «CJA raccoglie»: CJA legge i dati che raccogliete già."
  },
  "passaggio": {
    "quando": "22:40 · 20\"",
    "ancora": "Avete visto il flusso. Matteo vi fa vedere che cosa si misura, e a quali domande risponde.",
    "come": "L’ultimo Avanti chiude e porta alle «Quattro domande»."
  }
} as const;
