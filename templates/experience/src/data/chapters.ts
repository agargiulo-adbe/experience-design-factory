/**
 * «__NAME__» — i capitoli. Fonte unica per nav, home, SECTION_FLOW e, tramite
 * `admin.astro`, il registro delle slide.
 *
 * Generati dallo scheletro del tipo «__TYPE__» (packages/core/src/data/experienceTypes.ts):
 * è un punto di partenza, non un vincolo. Per aggiungere, togliere o rinominare un
 * capitolo: qui + la pagina in src/pages/<slug>.astro + PAGE_REGISTRY in admin.astro
 * + ROUTE_SETS in scripts/deck-audit.ts.
 */
export interface Chapter {
  slug: string;
  num: string;
  title: { it: string; en: string };
  /**
   * IL PUNTO del capitolo: una frase, e dice che cosa cambia per IL CLIENTE —
   * non che cosa fa il prodotto. Reso in fondo al capitolo dal blocco
   * `ChapterPoint`, e da nessun'altra parte: sette punti su una slide sono
   * esattamente la densità che il punto esiste per togliere.
   *
   * Obbligatorio di proposito: un capitolo nuovo senza il suo punto non compila,
   * che è un vincolo più forte di qualunque gate. Il resto lo verifica
   * `pnpm audit:sintesi` — una frase sola, 25 parole al massimo, presa da qui e
   * non riscritta nel markup. Il test di scrittura è il «So what?»: si chiede
   * finché la risposta è una cosa che il cliente vuole ottenere.
   */
  messaggio: string;
}

export const CHAPTERS: Chapter[] = [
__CHAPTERS__
];

export function chapterIndex(slug: string): number {
  return CHAPTERS.findIndex((c) => c.slug === slug);
}
export function prevSlug(slug: string): string {
  const i = chapterIndex(slug);
  return i <= 0 ? '/' : '/' + CHAPTERS[i - 1].slug;
}
export function nextSlug(slug: string): string {
  const i = chapterIndex(slug);
  return i === -1 || i >= CHAPTERS.length - 1 ? '/' : '/' + CHAPTERS[i + 1].slug;
}
