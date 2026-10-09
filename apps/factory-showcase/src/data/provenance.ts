/**
 * I numeri della provenance che la vetrina mostra, derivati dal conteggio.
 *
 * Tre numeri scritti a mano, tre sbagliati: «11 su 11» erano i record
 * presentati come file; «35 asset su 113» non corrispondeva né ai record né
 * ai file; «sette clip» ne ignorava la metà. Adesso si **contano** con
 * `node scripts/provenance-count.mjs`, che scrive `provenance.json` con data
 * e metodo, e la pagina legge quello. Chi scrive non può più sbagliare a
 * ricopiare; chi legge può rifare il conto.
 */
import raw from './provenance.json';

type Row = { app: string; files: number; records: number; stock: number; generated: number };
export const PROV = raw as {
  contato: string;
  come: string;
  totali: {
    file: number; record: number; stock: number; generati: number;
    fileSenzaRecord: number; clip: number; clipConRecord: number;
  };
  senzaRegistro: Array<{ app: string; file: number; record: number }>;
  perApp: Row[];
};

/** I nomi leggibili delle app, per scrivere «Max Mara 11 su 13». */
const NOMI: Record<string, string> = {
  'generazioni-maxmara': 'Max Mara',
  'ferrari-racing': 'Ferrari',
  'agos-trait-dunion': 'Agos',
  'trenitalia-connessioni': 'FS Group',
  'unicredit-engagement': 'UniCredit',
  'poste-sei-domande': 'Poste',
  'isybank-momento': 'Isybank',
  'mim-alfabeti': 'MIM',
  'eni-orbita': 'Eni',
  'intesa-scala-umana': 'Intesa',
  atelier: 'Atelier',
  'aperture-email': 'Aperture',
};

export const FILE_TOT = PROV.totali.file;
export const RECORD_TOT = PROV.totali.record;
export const STOCK_TOT = PROV.totali.stock;
export const GENERATI_TOT = PROV.totali.generati;
export const SENZA_RECORD = PROV.totali.fileSenzaRecord;
export const CLIP_CON_RECORD = PROV.totali.clipConRecord;

/** Le experience che generano la propria imagery, per nome. */
export const GENERANO = PROV.perApp
  .filter((r) => r.generated > 0)
  .map((r) => NOMI[r.app] ?? r.app);

/** Quelle ancora su stock, con il buco del registro: «Max Mara 11 su 13 · …». */
export const SU_STOCK = PROV.perApp.filter((r) => r.generated === 0);
export const SU_STOCK_NOMI = SU_STOCK.map((r) => NOMI[r.app] ?? r.app);
export const SU_STOCK_FILE = SU_STOCK.reduce((s, r) => s + r.files, 0);
export const SU_STOCK_RECORD = SU_STOCK.reduce((s, r) => s + r.records, 0);
export const SU_STOCK_DETTAGLIO = SU_STOCK
  .map((r) => `${NOMI[r.app] ?? r.app} ${r.records} su ${r.files}`)
  .join(', ');

const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const [Y, M, D] = PROV.contato.split('-').map(Number);
export const CONTATO_IT = `${D} ${MESI[M - 1]} ${Y}`;
export const CONTATO_EN = `${D} ${MONTHS[M - 1]} ${Y}`;
