/**
 * Edizione «lettura»: chi apre il link da solo non ha un relatore che apra i
 * sotto-passi a clic, e vede l'occhiello su un campo vuoto. Qui i passi si
 * aprono da soli, uno dopo l'altro, con la stessa animazione della sala.
 */
export function pianoRivelazione(n: number, ridotto: boolean, passoMs = 450): number[] {
  return Array.from({ length: Math.max(0, n) }, (_, i) => (ridotto ? 0 : (i + 1) * passoMs));
}

export function edizioneLettura(): boolean {
  try { return document.documentElement.dataset.edizione === 'lettura'; } catch { return false; }
}
