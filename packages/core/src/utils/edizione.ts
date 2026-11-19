/**
 * L'edizione di un'experience: `sala` è il deck proiettato da chi presenta,
 * `lettura` è la stessa storia mandata come link, letta da sola. Si sceglie
 * alla build con `PUBLIC_EDF_EDIZIONE=lettura`; un valore sconosciuto torna
 * alla sala, così un refuso non cambia mai che cosa esce.
 * Spec: docs/superpowers/specs/2026-11-19-edizione-lettura-design.md
 */
export type Edizione = 'sala' | 'lettura';

export function parseEdizione(raw: string | undefined): Edizione {
  return (raw ?? '').trim().toLowerCase() === 'lettura' ? 'lettura' : 'sala';
}

export const EDIZIONE: Edizione = parseEdizione(
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.PUBLIC_EDF_EDIZIONE,
);

export function inLettura(): boolean {
  return EDIZIONE === 'lettura';
}
