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
export type ScenaId = 'cja' | 'decisioning' | 'cdp';
export interface Scena { prodotto: string; cosa: string; passi: string[]; nota: string; fonti: { label: string; url: string }[]; }
const EL = 'https://experienceleague.adobe.com/en/docs';
export const SCENE: Record<ScenaId, Scena> = {
  cja: {
    prodotto: 'Customer Journey Analytics',
    cosa: 'Analisi omnicanale: legge insieme il comportamento digitale e le fonti offline, sulla stessa persona.',
    passi: [
      'Oggi il digitale si legge in un posto, filiale e Filiale Digitale in un altro.',
      'Customer Journey Analytics raccoglie il comportamento su sito e app.',
      'Entrano il CRM di filiale e la Filiale Digitale, una fonte alla volta.',
      'I segmenti e gli score del motore di targeting entrano come attributi del profilo.',
      'Per chi si identifica, simulazione online, contatti e firma in filiale si leggono in un unico percorso.',
      'Le richieste firmate si attribuiscono ai canali, filiale compresa.',
    ],
    nota: '',
    fonti: [],
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
  },
  cdp: {
    prodotto: 'Real-Time Activation',
    cosa: 'Costruisce il profilo di clienti e non‑clienti. Nel caso di Giulia: prima dal comportamento sul sito, poi dall’email che lascia.',
    passi: [
      'Giulia visita il sito senza identificarsi: il sistema registra quello che fa, ma non sa ancora chi è.',
      'Simula la rata ed entra in tempo reale nel segmento «mutuo prima casa».',
      'Quando torna, il sito le propone di riprendere la simulazione.',
      'Lascia email e consenso. Le visite fatte prima di lasciare il nome si uniscono al suo profilo.',
      'Ora il profilo ha un nome: oltre a personalizzare il sito, Journey Optimizer può scriverle. Quando prende appuntamento, il lead arriva nel CRM di filiale.',
    ],
    nota: '',
    fonti: [],
  },
};
