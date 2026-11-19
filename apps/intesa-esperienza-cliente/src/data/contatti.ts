/**
 * Le tre persone del capitolo «Parliamone» (edizione da distribuire).
 * Numeri ed email autorizzati dall'owner il 19 nov 2026, consapevole che il
 * repo e il sito sono pubblici. WhatsApp solo per chi l'ha dato.
 * Ruoli come in `adobe.astro`, tranne l'owner: «Product Sales Specialist».
 */
import gordiani from '../assets/team/gordiani.png';
import ellena from '../assets/team/ellena.png';
import gargiulo from '../assets/team/gargiulo.png';

export interface Contatto { nome: string; ruolo: string; email: string; whatsapp?: string; foto: ImageMetadata }

export const CONTATTI: Contatto[] = [
  { nome: 'Alex Gordiani', ruolo: 'Head of FSI', email: 'agordiani@adobe.com', foto: gordiani },
  { nome: 'Francesca Ellena', ruolo: 'Account Executive FSI', email: 'fellena@adobe.com', whatsapp: '+39 349 9385457', foto: ellena },
  { nome: 'Antonio Gargiulo', ruolo: 'Product Sales Specialist', email: 'agargiulo@adobe.com', whatsapp: '+39 348 9696067', foto: gargiulo },
];

export const OGGETTO_EMAIL = 'Adobe × Intesa Sanpaolo · una domanda';
export const TESTO_WHATSAPP = 'Buongiorno, ho letto la storia Adobe × Intesa Sanpaolo e ho una domanda.';
