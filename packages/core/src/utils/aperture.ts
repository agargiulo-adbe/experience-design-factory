/**
 * Il contatore delle aperture dell'edizione da distribuire (spec 2026-11-19,
 * «Revisione del 19 nov sera»): una riga per apertura con il solo progetto e
 * la pagina. Il giorno lo mette il database; niente ora, niente IP, niente
 * identificativi. Con Global Privacy Control attivo non si conta nulla.
 */
export type PaginaContata = 'copertina' | 'breve';

export function rigaApertura(progetto: string, pagina: PaginaContata, gpc: boolean): { progetto: string; pagina: PaginaContata } | null {
  if (pagina !== 'copertina' && pagina !== 'breve') throw new Error(`pagina non contata: «${pagina}»`);
  if (gpc) return null;
  return { progetto, pagina };
}
