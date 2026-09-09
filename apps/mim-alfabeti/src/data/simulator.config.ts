/**
 * Journey builder — «Ogni processo è un journey» (competenze.astro, slide-builder).
 *
 * Everything on that slide that looks like a number is an EXAMPLE, not a claim:
 * the slide carries a persistent «SIMULAZIONE · parametri modificabili» watermark
 * and every figure is labelled «esempio». The process copy is derived from the
 * five staff processes the deck already names (immissioni in ruolo, mobilità,
 * supplenze, GPS/GaE, formazione); it describes how a journey WOULD run, not how
 * the Ministry runs them today.
 *
 * Formula (help-desk questions avoided):
 *   avoided = round(baselineTickets[process][audience] × reach × dedupFactor)
 *   - baselineTickets  example volume of repeated questions a process generates
 *                      per year for that audience (help-desk, USR/UST, school
 *                      offices). Placeholder figures, to be replaced with the
 *                      Ministry's own ticket counts.
 *   - reach            share of the audience reached on the institutional
 *                      channel (the slider, 0–1). Default 0.60.
 *   - dedupFactor      share of those repeated questions a clear, tracked notice
 *                      avoids. Hypothesis: 0.35 (roughly one in three).
 */

export type Lang = 'it' | 'en';
export type LText = Record<Lang, string>;

export type ProcessId = 'immissioni' | 'mobilita' | 'supplenze' | 'gps' | 'formazione';
export type AudienceId = 'docenti' | 'dirigenti' | 'ata';
export type StepId = 'innesco' | 'avviso' | 'promemoria' | 'esito';
export type KpiId = 'recapito' | 'comprensione' | 'azione';

export interface ProcessDef {
  id: ProcessId;
  label: LText;
  /** Timeline copy, one short concrete sentence per step. */
  steps: Record<StepId, LText>;
  /** Example KPI values (percentages) shown once the process is chosen. */
  kpi: Record<KpiId, number>;
  /** Example yearly volume of repeated help-desk questions, per audience. */
  baselineTickets: Record<AudienceId, number>;
}

export const STEPS: Array<{ id: StepId; label: LText }> = [
  { id: 'innesco',    label: { it: 'Innesco',    en: 'Trigger' } },
  { id: 'avviso',     label: { it: 'Avviso',     en: 'Notice' } },
  { id: 'promemoria', label: { it: 'Promemoria', en: 'Reminder' } },
  { id: 'esito',      label: { it: 'Esito',      en: 'Outcome' } },
];

export const AUDIENCES: Array<{ id: AudienceId; label: LText }> = [
  { id: 'docenti',   label: { it: 'Docenti',   en: 'Teachers' } },
  { id: 'dirigenti', label: { it: 'Dirigenti', en: 'Principals' } },
  { id: 'ata',       label: { it: 'ATA',       en: 'ATA' } },
];

export const KPIS: Array<{ id: KpiId; label: LText }> = [
  { id: 'recapito',     label: { it: 'Recapito',     en: 'Delivered' } },
  { id: 'comprensione', label: { it: 'Comprensione', en: 'Understood' } },
  { id: 'azione',       label: { it: 'Azione',       en: 'Acted on' } },
];

export const PROCESSES: ProcessDef[] = [
  {
    id: 'immissioni',
    label: { it: 'Immissioni in ruolo', en: 'Tenure' },
    steps: {
      innesco:    { it: 'La graduatoria viene pubblicata o aggiornata.',
                    en: 'The ranking is published or updated.' },
      avviso:     { it: 'Avviso personale per ruolo e provincia: posizione, sedi disponibili, finestra per le preferenze.',
                    en: 'A personal notice by role and province: standing, available posts, the preference window.' },
      promemoria: { it: 'Promemoria a 48 ore dalla chiusura, solo a chi non ha ancora inviato le preferenze.',
                    en: 'A reminder 48 hours before closing, only to those who have not sent their preferences yet.' },
      esito:      { it: 'Conferma della sede assegnata, rettifica compresa. Si sa chi l’ha ricevuta e letta.',
                    en: 'Confirmation of the assigned post, corrections included. You know who received and read it.' },
    },
    kpi: { recapito: 96, comprensione: 81, azione: 74 },
    baselineTickets: { docenti: 12000, dirigenti: 600, ata: 2500 },
  },
  {
    id: 'mobilita',
    label: { it: 'Mobilità', en: 'Mobility' },
    steps: {
      innesco:    { it: 'Si apre la finestra per le domande di mobilità.',
                    en: 'The mobility application window opens.' },
      avviso:     { it: 'Avviso a chi può presentare domanda: requisiti, scadenza, dove si compila.',
                    en: 'A notice to those eligible to apply: requirements, deadline, where to fill it in.' },
      promemoria: { it: 'Promemoria alle scadenze intermedie e finale, solo a chi non ha completato.',
                    en: 'Reminders at the interim and final deadlines, only to those who have not completed.' },
      esito:      { it: 'L’esito del trasferimento arriva alla persona, non solo in un bollettino.',
                    en: 'The transfer outcome reaches the person, not just a bulletin.' },
    },
    kpi: { recapito: 95, comprensione: 78, azione: 69 },
    baselineTickets: { docenti: 15000, dirigenti: 900, ata: 4000 },
  },
  {
    id: 'supplenze',
    label: { it: 'Supplenze', en: 'Substitutes' },
    steps: {
      innesco:    { it: 'Si libera una cattedra o un posto e parte la convocazione.',
                    en: 'A post becomes vacant and the call goes out.' },
      avviso:     { it: 'Proposta di incarico con sede, durata e tempo per accettare.',
                    en: 'An assignment offer with school, duration and time to accept.' },
      promemoria: { it: 'Sollecito a chi non ha risposto, prima che scada l’accettazione.',
                    en: 'A nudge to those who have not replied, before acceptance expires.' },
      esito:      { it: 'Accettazione o rinuncia registrate: la scuola sa subito chi prende servizio.',
                    en: 'Acceptance or refusal recorded: the school knows at once who takes up the post.' },
    },
    kpi: { recapito: 97, comprensione: 84, azione: 88 },
    baselineTickets: { docenti: 30000, dirigenti: 2000, ata: 9000 },
  },
  {
    id: 'gps',
    label: { it: 'GPS/GaE', en: 'GPS/GaE' },
    steps: {
      innesco:    { it: 'Aggiornamento, rettifica o scorrimento della graduatoria.',
                    en: 'The ranking is updated, corrected or scrolled.' },
      avviso:     { it: 'Avviso solo a chi cambia posizione, con il nuovo punteggio e cosa comporta.',
                    en: 'A notice only to those whose standing changes, with the new score and what it means.' },
      promemoria: { it: 'Promemoria del termine per i reclami, a chi è interessato.',
                    en: 'A reminder of the complaint deadline, to those concerned.' },
      esito:      { it: 'Posizione confermata. Si misura chi ha capito l’effetto sulla propria posizione.',
                    en: 'Standing confirmed. You measure who understood the effect on their own position.' },
    },
    kpi: { recapito: 94, comprensione: 76, azione: 63 },
    baselineTickets: { docenti: 22000, dirigenti: 400, ata: 3000 },
  },
  {
    id: 'formazione',
    label: { it: 'Formazione', en: 'Training' },
    steps: {
      innesco:    { it: 'Parte un percorso obbligatorio o si avvicina una scadenza.',
                    en: 'A mandatory course starts or a deadline approaches.' },
      avviso:     { it: 'Avviso con cosa fare, entro quando e dove iscriversi.',
                    en: 'A notice with what to do, by when, and where to enrol.' },
      promemoria: { it: 'Promemoria a chi non ha ancora iniziato o completato.',
                    en: 'A reminder to those who have not started or finished yet.' },
      esito:      { it: 'Completamento registrato: si vede chi manca e si interviene.',
                    en: 'Completion recorded: you see who is missing and act.' },
    },
    kpi: { recapito: 93, comprensione: 80, azione: 71 },
    baselineTickets: { docenti: 8000, dirigenti: 1200, ata: 3500 },
  },
];

export const SIMULATOR = {
  /** Default slider value (share of the audience reached), in percent. */
  defaultReachPct: 60,
  /** Share of repeated questions a clear, tracked notice avoids (hypothesis). */
  dedupFactor: 0.35,
  /** Default process shown before any choice (progressive enhancement). */
  defaultProcess: 'immissioni' as ProcessId,
  defaultAudience: 'docenti' as AudienceId,
} as const;

/** avoided = round(baselineTickets × reach × dedupFactor) */
export function avoidedTickets(baselineTickets: number, reachPct: number, dedupFactor: number = SIMULATOR.dedupFactor): number {
  return Math.round(baselineTickets * (reachPct / 100) * dedupFactor);
}

export function processById(id: string | null | undefined): ProcessDef | undefined {
  return PROCESSES.find((p) => p.id === id);
}
