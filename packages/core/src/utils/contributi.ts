/**
 * I contributi della versione B dell'edizione da distribuire (spec
 * 2026-11-19, «Revisione del 19 nov sera»; contatto: spec 2026-11-20). Una riga
 * porta sezione, testo, funzione e livello facoltativi e una sola casella,
 * «potete usarlo nel riepilogo per la banca», spenta di default. L'email è
 * facoltativa: senza, la riga è identica a quella anonima (sei campi) e la
 * chiave `contatto` non c'è nemmeno. Mai il nome.
 * Le chiavi di funzione e livello sono le stesse dei vincoli in
 * `supabase/migrations/0041_contributi.sql`: se ne cambi una, cambiala là.
 */
export const FUNZIONI = [
  { k: 'direzione', l: 'Direzione' },
  { k: 'marketing', l: 'Marketing e comunicazione' },
  { k: 'dati', l: 'Dati e analisi' },
  { k: 'tecnologia', l: 'Tecnologia' },
  { k: 'digitale', l: 'Canali digitali' },
  { k: 'rete', l: 'Rete e filiali' },
  { k: 'compliance', l: 'Compliance e privacy' },
  { k: 'altro', l: 'Altro' },
] as const;

export const LIVELLI = [
  { k: 'operativo', l: 'Operativo' },
  { k: 'responsabile', l: 'Responsabile' },
  { k: 'dirigente', l: 'Dirigente' },
] as const;

export const LIMITI = { sezione: 160, testo: 2000, testoMin: 3, contatto: 200 } as const;

/** La stessa forma del vincolo in `0042_contributi_contatto.sql`. */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export interface RigaContributo {
  progetto: string; sezione: string; testo: string;
  funzione: string | null; livello: string | null; ok_riepilogo: boolean;
  /** solo se chi scrive l'ha lasciata */
  contatto?: string;
}

export interface InputContributo {
  sezione?: string; testo?: string; funzione?: string; livello?: string; okRiepilogo?: boolean; contatto?: string;
}

export type EsitoContributo = { ok: true; riga: RigaContributo } | { ok: false; errore: string };

const inLista = (l: readonly { k: string }[], v?: string) => (v && l.some((x) => x.k === v) ? v : null);

export function rigaContributo(progetto: string, i: InputContributo): EsitoContributo {
  const testo = (i.testo ?? '').trim();
  if (testo.length < LIMITI.testoMin) return { ok: false, errore: 'Scriveteci almeno una frase.' };
  if (testo.length > LIMITI.testo) return { ok: false, errore: `Il testo supera i ${LIMITI.testo} caratteri: accorciatelo o mandatecelo per email.` };
  const contatto = (i.contatto ?? '').trim().toLowerCase();
  if (contatto && (contatto.length > LIMITI.contatto || !EMAIL.test(contatto)))
    return { ok: false, errore: 'L’email non sembra completa: controllatela, oppure lasciate il campo vuoto.' };
  const sezione = (i.sezione ?? '').trim().slice(0, LIMITI.sezione) || 'In generale';
  const riga: RigaContributo = {
    progetto, sezione, testo,
    funzione: inLista(FUNZIONI, i.funzione),
    livello: inLista(LIVELLI, i.livello),
    ok_riepilogo: i.okRiepilogo === true,
  };
  if (contatto) riga.contatto = contatto;
  return { ok: true, riga };
}

/** «Capitolo · titolo della slide», per precompilare il campo sezione. */
export function sezioneDa(capitolo: string, titolo: string): string {
  const c = capitolo.replace(/\s+/g, ' ').trim();
  const t = titolo.replace(/\s+/g, ' ').trim();
  const s = !t || t === c ? c : !c ? t : `${c} · ${t}`;
  return s.length > LIMITI.sezione ? s.slice(0, LIMITI.sezione - 1).trimEnd() + '…' : s;
}
