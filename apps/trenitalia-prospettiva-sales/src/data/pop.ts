/**
 * I POP-IN DEI PRODOTTI CHE SI AGGIUNGONO — una scena per prodotto E per caso d'uso.
 *
 * 10 nov 2026, richiesta dell'owner: al clic su una tessera «si aggiunge» parte un
 * mockup semplificato del prodotto nel contesto Trenitalia. La chiave è la coppia
 * prodotto × idea e non il prodotto: Customer Journey Analytics sul percorso
 * d'acquisto e Customer Journey Analytics sulle schede in agenzia sono due storie.
 * Il collegamento sta nel campo `pop` di ogni voce di `SERVE`.
 *
 * I PASSI SI SCOPRONO A MANO: chi presenta decide con → o ↓ (telecomando compreso)
 * quando entra il pezzo dopo. All'ultimo passo → richiude e si torna alla slide.
 *
 * FONTI LETTE il 10 nov 2026 (Experience League e documentazione interna, via Fluffy):
 * · Adottare CJA non chiede di togliere Analytics; il connettore porta dentro i dati
 *   già raccolti e lo storico. Adobe indica il Web SDK come raccolta di lungo periodo
 *   e il connettore per lo storico. La pagina di upgrade dice anche che con il solo
 *   connettore si pagano entrambi: per questo la riga sta nella nota, e non si tace.
 * · Progetti e componenti di Analytics si migrano con Component Migration, e Coworker
 *   sa farlo in chat. ⚠️ Il pannello A4T non si migra: da dire a chi gestisce Target.
 * · Coworker su Target: legge i risultati, diagnostica le varianti perdenti,
 *   dimensiona la durata dei test. Rilascio per modulo e per coorte ancora in corso.
 * · Schede in agenzia: il pannello degli esperimenti NON si usa. Senza assegnazione
 *   casuale «does not have a causal interpretation» e non prende dati di sintesi.
 *   Il confronto si progetta prima di spedire; CJA lo mostra accanto a sito e app.
 *
 * ⚠️ Nessun numero inventato: le barre sono senza cifre e la nota lo dichiara. Le
 * uniche cifre sono quelle della misura Adobe di ottobre, già nel capitolo ricerca.
 */
import { SOURCES } from './sources';

export type ScenaId =
  | 'cja-acquisto' | 'coworker-acquisto' | 'collab-costa'
  | 'bv-ricerca' | 'llm-ricerca'
  | 'workfront-contenuto' | 'genstudio-contenuto' | 'ca-contenuto' | 'coworker-contenuto'
  | 'cja-rete';

interface Link { label: string; url: string; }
export interface Scena {
  prodotto: string;
  caso: string;
  /** Che cosa aggiunge in questo caso d'uso, una riga. */
  cosa: string;
  /** Una frase per passo: è quella che resta a schermo mentre si parla. */
  passi: string[];
  nota: string;
  fonti: Link[];
}

const EL = 'https://experienceleague.adobe.com/en/docs';
const fonte = (s: { url?: string; label: string }): Link => ({ label: s.label, url: s.url ?? '' });

export const SCENE: Record<ScenaId, Scena> = {
  'cja-acquisto': {
    prodotto: 'Customer Journey Analytics',
    caso: 'Personalizzazione su larga scala',
    cosa: 'Uno strato di lettura sopra i canali: prima quello che Analytics misura già, poi le altre fonti.',
    passi: [
      'Oggi trenitalia.com da una parte, Le Frecce e l’app dall’altra: due analisi separate.',
      'Customer Journey Analytics si appoggia sopra, e legge quello che Analytics raccoglie già.',
      'Poi entra il CRM con CartaFreccia, quando sarà pronto.',
      'Domani altre fonti, una alla volta, quando serviranno.',
      'Chi si identifica diventa un percorso solo: da Roma-Caserta alla prossima meta.',
      'Si misura due volte? No. La raccolta resta una sola, quella di Analytics.',
      'Con il nuovo sito la raccolta può andare direttamente a Customer Journey Analytics.',
      'Quando lo deciderete si possono spegnere i due Analytics, portando storico e progetti.',
    ],
    nota: 'Schema illustrativo. Finché convivono, Analytics e Customer Journey Analytics si licenziano entrambi.',
    fonti: [
      { label: 'Il passaggio da Analytics', url: `${EL}/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-recommendations` },
      { label: 'La migrazione dei progetti', url: `${EL}/analytics/admin/admin-tools/component-migration/component-migration` },
    ],
  },
  'coworker-acquisto': {
    prodotto: 'CX Enterprise Coworker',
    caso: 'Personalizzazione su larga scala',
    cosa: 'Un agente accanto al team: dalla domanda al segmento, fino alla prova sul sito.',
    passi: [
      'Il team fa una domanda con le sue parole.',
      'Coworker legge Customer Journey Analytics e propone il segmento.',
      'Prepara la prova in Target su trenitalia.com: la home su Matera, contro quella di oggi.',
      'Decide il team. Senza approvazione non si pubblica niente.',
      'Alla fine legge i risultati e dice se la prova ha dato una risposta.',
    ],
    nota: 'Esempio illustrativo. Disponibilità per prodotto e per gruppo di clienti da confermare in fase di avvio.',
    fonti: [
      { label: 'Coworker sui test di Target', url: `${EL}/coworker/content/chat/use-cases/optimization/target` },
      { label: 'Coworker sui dati', url: `${EL}/coworker/content/chat/use-cases/data-insights/accelerate-data-insights` },
    ],
  },
  'collab-costa': {
    prodotto: 'Real-Time Collaboration',
    caso: 'Trenitalia e Costa Crociere',
    cosa: 'Due aziende trovano i clienti in comune senza consegnarsi le proprie basi clienti.',
    passi: [
      'Trenitalia e Costa hanno ciascuna i propri clienti, e li tengono.',
      'Gli elenchi si incontrano in un ambiente neutro, con controlli di accesso.',
      'Nel confronto nessuna delle due vede i dati dell’altra: si vede quanto si sovrappongono.',
      'Da lì nasce un pubblico per una proposta comune: il treno fino al porto.',
      'Prima di qualunque prova si definiscono titolarità, base giuridica, contratto e valutazione d’impatto.',
    ],
    nota: 'Schema illustrativo. L’attivazione verso il partner ha regole sue, da definire insieme.',
    fonti: [fonte(SOURCES.rtcdpCollab)],
  },
  'bv-ricerca': {
    prodotto: 'Brand Visibility',
    caso: 'Presidiare le risposte degli assistenti AI',
    cosa: 'La misura di ottobre, resa continua e collegata alle pagine.',
    passi: [
      'Si parte dalle domande dei viaggiatori, senza nomi di marca.',
      'Per ogni assistente si vede se trenitalia.com è fra le fonti citate.',
      'Si vede chi viene citato al vostro posto: oggi, su Google, soprattutto i rivenditori.',
      'Con Experience Manager si ottimizzano le pagine, e aumenta la probabilità di essere citati.',
      'La misura continua, e si vede se le ottimizzazioni hanno spostato qualcosa.',
    ],
    nota: 'I due valori sono la misura Adobe dell’11 e 12 ottobre, otto domande. Il resto è illustrativo.',
    fonti: [fonte(SOURCES.brandVisibility)],
  },
  'llm-ricerca': {
    prodotto: 'LLM Apps, dentro Experience Manager',
    caso: 'La marca dentro gli assistenti AI',
    cosa: 'Un’esperienza con la marca Trenitalia dentro la conversazione.',
    passi: [
      'Un viaggiatore chiede come arrivare a Matera senza auto.',
      'Oggi l’assistente risponde con un testo, e sceglie lui le fonti.',
      'Con un’app Trenitalia il viaggiatore la richiama per nome, o l’assistente la propone se pertinente.',
      'L’acquisto resta su trenitalia.com.',
    ],
    nota: 'Esempio illustrativo di una capacità annunciata: disponibilità e superfici da confermare.',
    fonti: [fonte(SOURCES.llmApps)],
  },
  'workfront-contenuto': {
    prodotto: 'Workfront',
    caso: 'Più segmenti, più versioni',
    cosa: 'Chi chiede, chi produce e chi approva stanno nello stesso flusso.',
    passi: [
      'Una richiesta sola: Estate in Puglia, per tre pubblici.',
      'Il lavoro viene assegnato, e tutti vedono a che punto è.',
      'Marketing, legale e marchio approvano nello stesso posto.',
      'La versione approvata passa a Experience Manager Assets, pronta da usare.',
    ],
    nota: 'Esempio illustrativo. Flussi e ruoli si disegnano sui vostri.',
    fonti: [fonte(SOURCES.workfront)],
  },
  'genstudio-contenuto': {
    prodotto: 'GenStudio for Performance Marketing',
    caso: 'Più segmenti, più versioni',
    cosa: 'Dalla campagna approvata alle varianti per le pubblicità online.',
    passi: [
      'Si parte dalla campagna approvata, Estate in Puglia.',
      'Nascono le varianti per famiglie, coppie e chi viaggia da solo.',
      'Ogni variante passa il controllo sulle regole del marchio.',
      'Le approvazioni restano a voi, poi si pubblica sui canali a pagamento.',
    ],
    nota: 'Esempio illustrativo. Immagini generate con Adobe Firefly.',
    fonti: [{ label: 'GenStudio for Performance Marketing', url: `${EL}/genstudio-for-performance-marketing/user-guide/home` }],
  },
  'ca-contenuto': {
    prodotto: 'Content Analytics',
    caso: 'Più segmenti, più versioni',
    cosa: 'Quali caratteristiche del contenuto portano davvero alle vendite.',
    passi: [
      'Le tre versioni di Estate in Puglia sono online.',
      'Ogni immagine viene scomposta nelle sue caratteristiche.',
      'Le caratteristiche si legano a quello che le persone fanno dopo.',
      'La prossima versione parte da quello che ha funzionato.',
    ],
    nota: 'Valori illustrativi. Richiede Customer Journey Analytics e la raccolta con Web SDK. Vale per il digitale, non per lo stampato.',
    fonti: [fonte(SOURCES.contentAnalytics)],
  },
  'coworker-contenuto': {
    prodotto: 'CX Enterprise Coworker',
    caso: 'Più segmenti, più versioni',
    cosa: 'Un agente accanto a chi produce: cerca, propone, controlla.',
    passi: [
      'Il team chiede tre versioni di Estate in Puglia.',
      'Coworker cerca nei contenuti già approvati di Experience Manager Assets.',
      'Propone una versione per pubblico.',
      'Controlla ogni versione sulle regole del marchio.',
      'Decide il team, e le approvazioni restano le vostre.',
    ],
    nota: 'Esempio illustrativo. Disponibilità per prodotto e per gruppo di clienti da confermare in fase di avvio.',
    fonti: [{ label: 'Coworker', url: SOURCES.coworker.url }],
  },
  'cja-rete': {
    prodotto: 'Customer Journey Analytics',
    caso: 'Schede e locandine in agenzia',
    cosa: 'Provare su una campagna se una scheda fa vendere, senza toccare il sistema di vendita.',
    passi: [
      'La scheda Matera parte in due ondate, con le agenzie assegnate a sorte fra gruppi simili.',
      'Serve il venduto del prodotto per agenzia e per settimana, dai vostri sistemi.',
      'Customer Journey Analytics mette il confronto accanto a quello che succede su sito e app.',
      'Si confronta quanto crescono i due gruppi, finché la seconda ondata non parte.',
      'Si controlla il diretto nella stessa zona: una vendita spostata dall’app non è una vendita in più.',
      'Un QR per agenzia dice se la scheda viene guardata. Il metro resta il venduto.',
    ],
    nota: 'Ipotesi da verificare sui vostri dati. Si misura chi riceve la scheda, non chi la espone, e un esito incerto si dichiara tale. Nessun dato di viaggiatori o addetti. Valori illustrativi.',
    fonti: [
      { label: 'Dati di sintesi in Customer Journey Analytics', url: `${EL}/analytics-platform/using/cja-dataviews/summary-data` },
      { label: 'Codici di tracciamento in Analytics', url: `${EL}/analytics/components/dimensions/tracking-code` },
    ],
  },
};
