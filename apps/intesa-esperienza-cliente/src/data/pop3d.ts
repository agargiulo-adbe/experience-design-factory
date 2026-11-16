/**
 * LA VERSIONE 3D DEI TRE POP-IN, dietro un interruttore (`?pop3d=1`, spento di default).
 * Le clip le rende `pnpm render:3d --app intesa-esperienza-cliente --scena rta|decisioning|cja`
 * e stanno in `public/media/3d/<clip>/` con `capitoli.json` (passo → fotogrammi) ed
 * `etichette.json` (dove cade ogni oggetto sullo schermo a fine passo, calcolato da Blender).
 *
 * Qui stanno solo le PAROLE delle etichette: il render non porta testo, così si
 * correggono senza rendere di nuovo. Le didascalie restano quelle di `pop.ts`.
 * Grammatica (report «Spiegare concetti complessi in video»): grigio = anonimo,
 * escluso, della banca · bianco = un dato · verde = ciò che Adobe aggiunge o sceglie.
 */
import type { ScenaId } from './pop';

export interface Pop3d {
  clip: 'rta' | 'decisioning' | 'cja';
  /** `\n` manda a capo: due righe strette al posto di una larga, dove gli oggetti sono vicini. */
  nomi: Record<string, string>;
  /** Da quale passo un'etichetta passa a «esclusa», col motivo accanto (le parole di m-04). */
  escluse?: Record<string, number>;
  motivi?: Record<string, string>;
  /** Spostamento in % del palco, per staccare un'etichetta da un oggetto vicino. */
  sposta?: Record<string, [number, number]>;
  /** Una nota sul palco a un passo dato. */
  note?: Record<number, string>;
}

/* Il racconto unico (`e2e`) non ha una clip: vive solo nella variante 2D. */
export const POP3D: Partial<Record<ScenaId, Pop3d>> = {
  cdp: {
    clip: 'rta',
    nomi: { giulia: 'Giulia', sito: 'Sito', profilo: 'Profilo', segmento: 'Segmento «mutuo prima casa»', tirante: 'Email e consenso', ajo: 'Journey Optimizer', crm: 'CRM di filiale' },
    sposta: { segmento: [0, 3] },
  },
  decisioning: {
    clip: 'decisioning',
    nomi: { motore: 'Motore di targeting', core: 'Core banking', profilo: 'Profilo', attributi: 'Score ed eleggibilità', arbitro: 'AI Decisioning',
            proposta0: 'Promemoria\ncon appuntamento', proposta1: 'Promemoria', proposta2: 'Contatto\nFiliale Digitale', proposta3: 'Polizza casa',
            regole: 'Regole e consenso', canale: 'Sito', cja: 'Customer Journey Analytics' },
    escluse: { proposta2: 4, proposta3: 4, proposta1: 6 },
    motivi: { proposta2: 'manca il consenso al contatto telefonico', proposta3: 'solo dopo la firma', proposta1: 'seconda per priorità' },
    // Dal passo 6 la proposta scelta si posa sul canale: il nome del canale va sotto.
    // Le due proposte ammesse stanno a un decimo di palco: le etichette si allargano.
    sposta: { canale: [0, 24], proposta0: [-3, 0], proposta1: [2, 0] },
  },
  cja: {
    clip: 'cja',
    nomi: { digitale: 'Digitale', fisico: 'Filiale e telefono', sito: 'Sito', app: 'App', filiale: 'CRM di filiale', filiale_digitale: 'Filiale Digitale',
            cja: 'Customer Journey Analytics', motore: 'Motore di targeting', t_sito: 'Simula la rata', t_email: 'Riprende dall’email', t_filiale: 'Appuntamento', t_firma: 'Firma',
            b_sito: 'Sito', b_email: 'Email', b_filiale: 'Filiale' },
    note: { 6: 'Altezze illustrative, non dati.' },
  },
};
