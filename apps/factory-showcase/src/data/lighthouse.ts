/**
 * I numeri di Lighthouse che la vetrina mostra, derivati dal file di misura.
 *
 * In pagina c'era una serie scritta a mano. Rigirata il 3 ottobre 2026 lo
 * stesso URL oscillava fino a 35 punti, e la frase che ci poggiava sopra
 * («solo UniCredit è sopra 90») si ribaltava da sé. Adesso i numeri si
 * **leggono** da `lighthouse.json`, che è la mediana di più giri misurata con
 * `node scripts/lighthouse-median.mjs` sul sito pubblicato, con data,
 * strumento, condizioni e oscillazione di ciascuno. Chi legge può rifare la
 * stessa misura; chi scrive non può sbagliare a ricopiarla.
 */
import raw from './lighthouse.json';
import { DEFAULT_PUBLISHED } from './experiences';

type Page = {
  label: string;
  url: string;
  runs: number;
  performance: number;
  accessibility: number;
  'best-practices': number;
  seo: number;
  spread: Record<string, number>;
};

export const LH = raw as { misurato: string; come: string; strumento: string; condizioni: string; base: string; pagine: Page[] };

/** Le pagine che sono experience: la vetrina e l'hub non lo sono. */
const EXPERIENCES = LH.pagine.filter((p) => p.label !== 'vetrina' && p.label !== 'hub');
const byLabel = (l: string) => LH.pagine.find((p) => p.label === l);

const perf = LH.pagine.map((p) => p.performance);
export const PERF_MIN = Math.min(...perf);
export const PERF_MAX = Math.max(...perf);
export const PERF_OVER_90 = LH.pagine.filter((p) => p.performance > 90);
export const SPREAD_MAX = Math.max(...LH.pagine.map((p) => p.spread.performance));
export const SPREAD_MIN = Math.min(...LH.pagine.map((p) => p.spread.performance));
export const A11Y_PERFECT = EXPERIENCES.filter((p) => p.accessibility === 100).length;
export const A11Y_SHOWCASE = byLabel('vetrina')?.accessibility ?? 0;
export const A11Y_HUB = byLabel('hub')?.accessibility ?? 0;
export const BP_ALL_100 = LH.pagine.every((p) => p['best-practices'] === 100);
export const RUNS = LH.pagine[0]?.runs ?? 0;

/**
 * «Max Mara 82 · Ferrari 82 · …», dalla più veloce alla più lenta — ma SOLO
 * per le pagine che sono già in vetrina.
 *
 * Il 9 ottobre questa riga ha ricostruito, da sola, l'indice dei conti che la
 * pagina dichiara di non nominare: un elenco con nome e punteggio accanto, in
 * chiaro nel markup pubblico, di cinque experience fuori vetrina. Un giro
 * precedente aveva già tolto quei nomi da altre due sezioni; sono rientrati da
 * qui. Le righe non pubblicate restano nella serie — il conteggio e la
 * forchetta devono restare veri — ma senza nome.
 */
const SLUG = (url: string) => url.replace(/\/$/, '').split('/').pop() || '';
const IN_VETRINA = new Set(
  DEFAULT_PUBLISHED.map((e) => e.slug).concat(['showcase', 'experience-design-factory']),
);
const nameable = (p: Page) => p.label === 'vetrina' || p.label === 'hub' || IN_VETRINA.has(SLUG(p.url));

export const PERF_LIST = [...LH.pagine]
  .sort((a, b) => b.performance - a.performance)
  .map((p) => `${nameable(p) ? p.label : 'una fuori vetrina'} ${p.performance}`)
  .join(' · ');
/** Quante righe della serie restano senza nome, per poterlo dire in pagina. */
export const PERF_ANONYME = LH.pagine.filter((p) => !nameable(p)).length;

/** La data in italiano piano: «9 ottobre 2026». */
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const [Y, M, D] = LH.misurato.split('-').map(Number);
export const MISURATO_IT = `${D} ${MESI[M - 1]} ${Y}`;
export const MISURATO_EN = `${D} ${MONTHS[M - 1]} ${Y}`;
