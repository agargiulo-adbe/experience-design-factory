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
    cosa: 'Uno strato di lettura sopra i canali: si parte da quello che Adobe Analytics raccoglie già.',
    passi: [
      'Oggi sito e app si leggono in Adobe Analytics. Filiale e Filiale Digitale stanno altrove.',
      'Customer Journey Analytics si appoggia sopra e legge quello che Analytics raccoglie già.',
      'Entrano il CRM di filiale e la Filiale Digitale, una fonte alla volta.',
      'I segmenti e gli score del motore di targeting entrano come attributi. Il motore resta a monte.',
      'Chi si identifica diventa un percorso solo, dalla simulazione alla firma in filiale.',
      'Le richieste firmate si attribuiscono ai canali, filiale compresa.',
    ],
    nota: 'Schema illustrativo. Serve un identificativo comune fra le fonti. Finché convivono, Analytics e Customer Journey Analytics si licenziano entrambi. Quanto durano insieme si decide in fase 0.',
    fonti: [
      { label: 'Online e offline', url: `${EL}/analytics-platform/using/cja-overview/cja-b2c-overview/cja-faq` },
      { label: 'Il passaggio da Analytics', url: `${EL}/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-recommendations` },
    ],
  },
  decisioning: {
    prodotto: 'AI Decisioning',
    cosa: 'L’arbitro fra le proposte: usa quello che il motore di targeting calcola e sceglie quale esce.',
    passi: [
      'Il motore di targeting resta a monte: target e propensione, come oggi. L’eleggibilità creditizia viene dal core banking.',
      'Arrivano ad AI Decisioning come attributi del profilo. Eleggibilità: attributo precalcolato nel profilo, oppure passata dal vostro sistema nella richiesta di decisione.',
      'Per la stessa persona ci sono quattro proposte candidate.',
      'Regole, consenso e politica di contatto tolgono quelle non ammesse.',
      'Su chi non è ancora cliente il motore di targeting non ha punteggi: valgono la priorità dell’offerta e le regole scritte insieme.',
      'Ne esce una sola, sul canale giusto. L’orchestrazione può restare dov’è.',
      'Customer Journey Analytics misura l’esito sul gruppo di controllo; priorità e regole si rivedono con voi a fine trimestre.',
    ],
    nota: 'Schema illustrativo, sistemi attuali da confermare con voi. Sul non cliente classifica l’arbitro, con le regole scritte insieme. Sul cliente la classifica resta del vostro motore, e l’arbitro applica canale, consenso e politica di contatto.',
    fonti: [
      { label: 'Formule di classifica', url: `${EL}/journey-optimizer/using/decisioning/experience-decisioning/experience-decisioning-rankings/ranking-formulas` },
      { label: 'Decisioning', url: `${EL}/journey-optimizer/using/decisioning/experience-decisioning/gs-experience-decisioning` },
    ],
  },
  cdp: {
    prodotto: 'Real-Time CDP',
    cosa: 'Tiene il profilo di clienti e non clienti. Con Giulia: prima da come usa il sito, poi dall’email che lascia.',
    passi: [
      'Giulia arriva sul sito senza lasciare l’email. Si riconosce solo il suo browser.',
      'Simula la rata, e in quell’istante entra nel gruppo «mutuo prima casa».',
      'Quando torna, il sito le propone di riprendere la simulazione.',
      'Lascia email e consenso. Le visite fatte da anonima si uniscono al suo profilo.',
      'Da qui Journey Optimizer e AI Decisioning sanno chi è. Il CRM di filiale non cambia.',
    ],
    nota: 'Schema illustrativo. Per personalizzare il sito serve il consenso alla profilazione; per scriverle, il consenso marketing. I profili anonimi si cancellano dopo un periodo che scegliete voi, da 1 a 365 giorni.',
    fonti: [
      { label: 'Segmentazione edge', url: `${EL}/experience-platform/segmentation/methods/edge-segmentation` },
      { label: 'Profili anonimi', url: `${EL}/experience-platform/profile/pseudonymous-profiles` },
    ],
  },
};
