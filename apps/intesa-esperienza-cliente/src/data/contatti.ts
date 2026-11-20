/**
 * Le persone del capitolo «Parliamone» (edizione da distribuire).
 * Numeri ed email autorizzati dall'owner il 19 nov 2026, consapevole che il
 * repo e il sito sono pubblici. WhatsApp solo per chi l'ha dato.
 * Il 20 nov l'owner ha aggiunto Selmi, Grieco e Mecca: email e telefono
 * dalle firme delle loro mail (la rubrica del connettore non è leggibile),
 * ruoli come in `adobe.astro`. `modulo`: chi riceve la domanda che dal modulo
 * parte per email (il team dell'account, non tutti).
 * Ruoli come in `adobe.astro`, tranne l'owner: «Product Sales Specialist».
 */
import { conContributi } from '@edf/core/utils/edizione';
import gordiani from '../assets/team/gordiani.png';
import ellena from '../assets/team/ellena.png';
import gargiulo from '../assets/team/gargiulo.png';
import selmi from '../assets/team/selmi.png';
import grieco from '../assets/team/grieco.png';
import mecca from '../assets/team/mecca.png';

export interface Contatto { nome: string; ruolo: string; email: string; whatsapp?: string; telefono?: string; modulo?: boolean; foto: ImageMetadata }

export const CONTATTI: Contatto[] = [
  { nome: 'Alex Gordiani', ruolo: 'Head of FSI', email: 'agordiani@adobe.com', modulo: true, foto: gordiani },
  { nome: 'Francesca Ellena', ruolo: 'Account Executive FSI', email: 'fellena@adobe.com', whatsapp: '+39 349 9385457', modulo: true, foto: ellena },
  { nome: 'Antonio Gargiulo', ruolo: 'Product Sales Specialist', email: 'agargiulo@adobe.com', whatsapp: '+39 348 9696067', modulo: true, foto: gargiulo },
  { nome: 'Giacomo Selmi', ruolo: 'Senior Solutions Consultant', email: 'gselmi@adobe.com', telefono: '+39 347 429 3328', foto: selmi },
  { nome: 'Matteo Grieco', ruolo: 'Solutions Consultant', email: 'mgrieco@adobe.com', telefono: '+39 342 751 7796', foto: grieco },
  { nome: 'Luca Mecca', ruolo: 'Product Sales Specialist · Content', email: 'lmecca@adobe.com', telefono: '+39 345 976 1193', foto: mecca },
];

export const OGGETTO_EMAIL = 'Adobe × Intesa Sanpaolo · una domanda';
export const TESTO_WHATSAPP = 'Buongiorno, ho letto la storia Adobe × Intesa Sanpaolo e ho una domanda.';

/** Il nome con cui l'edizione si conta (`aperture`) e raccoglie (`contributi`):
 *  A e B si contano a parte, così si vede quale delle due circola. */
export const PROGETTO_EDIZIONE = conContributi() ? 'intesa-storia-insieme' : 'intesa-storia';

/** La riga in fondo al modulo: dove finiscono le domande, chi le legge, per quanto
 *  (panel del 20 nov, P0; decisione dell'owner). I 90 giorni li garantisce il
 *  database (0046, pg_cron ogni notte); ⚠️ la cancellazione alla chiusura della
 *  raccolta è un impegno: si fa a mano dalla console. */
export const INFORMATIVA_MODULO =
  'Le domande restano in un database in Europa (Supabase, Francoforte) e le legge il team Adobe dell’account; nel riepilogo entrano solo quelle che permettete. Si cancellano quando la raccolta si chiude, e comunque entro 90 giorni dall’invio.';
