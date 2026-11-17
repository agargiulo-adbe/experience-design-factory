/**
 * I DUE MOCKUP A PASSI: come funzionano Customer Journey Analytics e AI Decisioning
 * nel contesto di Intesa Sanpaolo, con il motore di targeting a monte. Ogni freccia giù scopre un pezzo.
 *
 * FONTI LETTE il 10 nov 2026 (Experience League e Field Readiness, via Fluffy):
 * · CJA collega online e offline se l'identificativo della persona è lo stesso (FAQ).
 * · Ranking formula di AI Decisioning: combina punteggi di modelli AI, attributi del
 *   profilo, attributi dell'offerta e contesto.
 * · Finché convivono, Analytics e CJA si licenziano entrambi (pagina di upgrade).
 * · Il nome del motore di targeting NON è confermato dal cliente (decisione dell'11
 *   nov 2026): qui si chiama per funzione. La catena completa dei sistemi è
 *   un'ipotesi nostra, da confermare: la nota lo dichiara.
 * · L'arbitro non interroga il core in sincrono: l'eleggibilità creditizia arriva
 *   come attributo precalcolato nel profilo, o nella richiesta di decisione.
 * · Le frasi su prospect, precedenza e contatto telefonico sono CANONICHE: le
 *   stesse parole stanno in m-04 (`momenti.ts`). Non si parafrasano.
 */
export type ScenaId = 'cja' | 'decisioning' | 'cdp' | 'e2e';
/** `v2d`: testi della SOLA variante 2D (`?pop3d=1`), dopo il panel del 16 nov 2026. Il deck
 *  principale legge `cosa` e `passi` e non cambia; dove `v2d` manca, la variante usa quelli. */
export interface Scena { prodotto: string; cosa: string; passi: string[]; nota: string; fonti: { label: string; url: string }[];
  v2d?: { cosa?: string; passi?: (string | null)[] };
  /** La riga sopra il titolo del pop-in; manca = «Componente Adobe». */
  occhiello?: string;
  /** Il racconto unico: i capitoli si cliccano nel piede e aprono al loro primo passo. */
  capitoli?: { t: string; da: number; a: number }[]; }
const EL = 'https://experienceleague.adobe.com/en/docs';
export const SCENE: Record<ScenaId, Scena> = {
  /* IL RACCONTO UNICO (owner, 16 nov 2026), solo dietro `?pop3d=1`: i tre «Come funziona»
     diventano un flusso solo, da Real-Time Activation a CJA, su Giulia (sopra) e sul
     sistema (sotto), con i sistemi della banca in scena come attori. Ogni carta apre al
     suo capitolo. Le frasi vengono dalle `v2d` delle tre scene (panel del 16 nov): niente
     affermazioni nuove. Dalla call interna del 16 nov: il codice pratica nasce alla
     simulazione e si riconcilia con l'NDG che il core emette alla firma (ipotesi di lavoro
     dichiarata); il look-alike passa da Real-Time Activation; il dato di CJA va anche alle
     iniziative commerciali sui clienti.
     17 nov 2026 (owner, dopo la call delle 10): (1) la frase in testa ripeteva i tre
     capitoli del piede, che ora portano verbo e prodotto e lampeggiano al cambio: tolta;
     (2) prima del passo 1 una guida «Come si legge» (call: «spiega la slide come si
     legge… un'audience ibrida»); (3) le iniziative commerciali lavorano sui clienti
     (slide dell'innesto): non si accendono più al passo 6, che è sul non cliente; al
     passo 11 Giulia è cliente, e il dato entra nelle programmate; (4) la «fase 0» non è
     mai presentata nel percorso: tolta; (5) il look-alike nasce in Real-Time Activation
     da chi ha firmato, non da un'audience di CJA: Experience League vuole la base
     «created within Experience Platform». */
  e2e: {
    occhiello: 'Come funziona',
    prodotto: 'Dall’annuncio alla firma',
    cosa: '',
    capitoli: [
      { t: 'Riconosce · Real-Time Activation', da: 1, a: 3 },
      { t: 'Sceglie e orchestra · Journey Optimizer', da: 4, a: 6 },
      { t: 'Misura · Customer Journey Analytics', da: 7, a: 11 },
    ],
    passi: [
      'Giulia arriva dall’annuncio e accetta i cookie di profilazione. Il sistema registra quello che fa, ma non sa ancora chi è.',
      'Simula la rata ed entra in tempo reale nel segmento «mutuo prima casa».',
      'Lascia l’email e il consenso marketing, e nasce il codice pratica. Le visite fatte prima di lasciare il nome si uniscono al suo profilo.',
      'Si ferma perché le manca un documento. Journey Optimizer lo sa subito; gli score del vostro motore, se esistono sul non cliente, arrivano come attributi.',
      'AI Decisioning mette in fila quattro proposte. Regole e consenso ne escludono due, e vince il promemoria con appuntamento.',
      'La proposta compare sul sito e poi arriva per email, e Giulia riprende la pratica.',
      'In filiale apre la pratica: è la stessa della simulazione, e il grafo la lega all’email, al telefono e alle visite di prima.',
      'Firma: il core emette l’NDG e lo lega al codice pratica (ipotesi di lavoro). Customer Journey Analytics legge sito, app, CRM e Filiale Digitale in un percorso solo.',
      'Le firme si attribuiscono ai canali, filiale compresa. Se la campagna ha funzionato lo dice il gruppo di controllo, che si definisce insieme prima di partire.',
      'Chi ha firmato torna alla decisione, e la proposta del mutuo per lui si chiude. In Real-Time Activation, da chi ha firmato nasce un’audience look‑alike: serve a trovare il prossimo non cliente.',
      'Ora Giulia è cliente. Il dato di Customer Journey Analytics arriva alle vostre iniziative commerciali, che lavorano sui clienti: audience per up-sell e cross-sell, nelle campagne programmate. Sulle proposte decide il vostro motore.',
    ],
    nota: '',
    fonti: [],
  },
  cja: {
    prodotto: 'Customer Journey Analytics',
    cosa: 'Analisi omnicanale: legge insieme il comportamento digitale e le fonti offline, sulla stessa persona.',
    passi: [
      'Oggi il digitale si legge in un posto, filiale e Filiale Digitale in un altro.',
      'Customer Journey Analytics legge i dati di sito e app che già raccogliete con Adobe Analytics.',
      'Entrano il CRM di filiale e la Filiale Digitale, una fonte alla volta.',
      'I segmenti e gli score del motore di targeting entrano come attributi del profilo.',
      'Il codice pratica, poi l’NDG alla firma, legano simulazione online, contatti e firma in un unico percorso.',
      'Le richieste firmate si attribuiscono ai canali, filiale compresa.',
    ],
    nota: '',
    fonti: [],
    // Panel 16 nov: CJA non «raccoglie», legge dataset (cja-faq, cja-upgrade-recommendations).
    v2d: {
      cosa: 'Mette nello stesso percorso quello che una persona fa sul sito e in app, in filiale e al telefono.',
      passi: [null, 'Customer Journey Analytics legge i dati di sito e app che raccogliete già: non li raccoglie da sé.'],
    },
  },
  decisioning: {
    prodotto: 'AI Decisioning',
    cosa: 'Sceglie quale proposta mostrare, usando gli score del motore di targeting e le regole della banca.',
    passi: [
      'Il motore di targeting continua a calcolare target e propensione; l’eleggibilità creditizia arriva dal core banking.',
      'Arrivano ad AI Decisioning come attributi del profilo. Eleggibilità: attributo precalcolato nel profilo, oppure passata dal vostro sistema nella richiesta di decisione.',
      'Per la stessa persona ci sono quattro proposte candidate.',
      'Regole, consenso e politica di contatto escludono quelle non ammesse.',
      'Se avete già un punteggio sui non‑clienti, entra come attributo; altrimenti valgono la priorità dell’offerta e le regole che fissate voi.',
      'Resta una sola proposta, sul canale ammesso da consenso e regole. L’invio può continuare a passare dagli strumenti attuali.',
      'Customer Journey Analytics misura l’esito sul gruppo di controllo. Con quel risultato si rivedono insieme priorità e regole delle proposte.',
    ],
    nota: '',
    fonti: [],
    // Panel 16 nov: Giulia non è cliente, quindi score ed eleggibilità «solo se esistono»; la
    // fonte dell'eleggibilità è in conflitto fra due nostre fonti e resta una domanda.
    v2d: {
      cosa: 'Sceglie quale proposta mostrare con le regole della banca e, se ci sono, gli score del vostro motore.',
      passi: [
        'Il motore di targeting continua a calcolare target e propensione sui clienti. Da quale sistema arrivi l’eleggibilità è da confermare con voi.',
        'Sul non cliente, solo se esistono: arrivano ad AI Decisioning come attributi del profilo. L’eleggibilità può stare nel profilo o arrivare dal vostro sistema nella richiesta di decisione.',
        'Per Giulia ci sono quattro proposte possibili. Se risulta già cliente, decide il vostro motore; chi decide su chi non ha fatto login si stabilisce insieme.',
        null,
        null,
        'Dopo le regole ne restano due: vince la prima per priorità, sul canale ammesso dal consenso.',
        'Customer Journey Analytics confronta chi ha visto la proposta con un gruppo di controllo: appuntamenti, poi firme. Chi lo estrae, quanto è grande e quanto dura, e il tetto di contatti, si stabiliscono insieme prima di partire.',
      ],
    },
  },
  cdp: {
    prodotto: 'Real-Time Activation',
    cosa: 'Costruisce il profilo di clienti e non‑clienti. Nel caso di Giulia: prima dal comportamento sul sito, poi dall’email che lascia.',
    passi: [
      'Giulia visita il sito senza identificarsi: il sistema registra quello che fa, ma non sa ancora chi è.',
      'Simula la rata ed entra in tempo reale nel segmento «mutuo prima casa».',
      'Quando torna, il sito le propone di riprendere la simulazione.',
      'Lascia email e consenso. Le visite fatte prima di lasciare il nome si uniscono al suo profilo.',
      'Ora il profilo ha un nome: oltre a personalizzare il sito, Journey Optimizer può scriverle. Quando prende appuntamento, il lead arriva nel CRM di filiale, via API o connettori nativi.',
    ],
    // Panel 16 nov: «Real-Time Activation» resta (scelta dell'owner del 13 nov) ma si dice di
    // quale prodotto è; il passaggio al CRM è da definire, non un fatto.
    v2d: {
      cosa: 'Capacità di Adobe Real-Time CDP. Costruisce il profilo di chi non è ancora cliente: prima dal comportamento sul sito, poi dall’email che lascia.',
      passi: [
        'Giulia visita il sito senza identificarsi e accetta i cookie di profilazione: il sistema registra quello che fa, ma non sa ancora chi è.',
        null,
        'Se torna entro un giorno, il sito le propone di riprendere la simulazione.',
        'Lascia l’email e il consenso marketing. Le visite fatte prima di lasciare il nome si uniscono al suo profilo.',
        'Con l’email e il consenso marketing, Journey Optimizer può scriverle. Se prenota, l’appuntamento arriva al CRM di filiale, via API o connettori nativi.',
      ],
    },
    nota: '',
    fonti: [],
  },
};
