/**
 * Edizione «lettura»: chi apre il link da solo non ha un relatore che apra i
 * sotto-passi a clic, e vede l'occhiello su un campo vuoto. Qui i passi si
 * aprono da soli, uno dopo l'altro, con la stessa animazione della sala.
 */
/* IL RITMO DI LETTURA (owner, 19 nov 2026): a 450 ms per passo chi legge non vedeva
   il primo stato delle slide che cambiano (il Sankey che si ridisegna, l'attribuzione
   da ultimo clic ad algoritmico): arrivava già alla fine. Il primo passo parte quando
   la slide è entrata e si è potuta guardare; poi un passo ogni `passoMs`. Una slide
   in cui ogni passo è uno stato da leggere chiede un ritmo suo (`data-lettura-ritmo`). */
export const PASSO_LETTURA_MS = 1600;
export function pianoRivelazione(n: number, ridotto: boolean, passoMs = PASSO_LETTURA_MS, primoMs = passoMs): number[] {
  return Array.from({ length: Math.max(0, n) }, (_, i) => (ridotto ? 0 : primoMs + i * passoMs));
}
export function ritmoDi(slide: HTMLElement): number {
  const v = Number(slide.dataset.letturaRitmo);
  return Number.isFinite(v) && v >= 300 ? v : PASSO_LETTURA_MS;
}

export function edizioneLettura(): boolean {
  try { return document.documentElement.dataset.edizione === 'lettura'; } catch { return false; }
}
