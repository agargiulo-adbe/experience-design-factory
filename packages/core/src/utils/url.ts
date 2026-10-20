/**
 * Build a base-aware internal URL with guaranteed trailing slash.
 * Normalises double slashes and always appends a trailing slash.
 *
 * FRAGMENTS. La barra finale va messa prima del `#`, non dopo: un path come
 * `idee/#slide-decisioning` normalizzato alla cieca diventa
 * `/idee/#slide-decisioning/` — e quel frammento, con la barra incollata in
 * coda, non corrisponde più a nessun id in pagina. L'ancora smette di
 * funzionare e non lo si vede finché non si prova il clic: la pagina giusta
 * si apre comunque, semplicemente dalla prima slide invece che da quella
 * citata. Scoperto il 20 ott 2026 sul ritorno da un affondo.
 * Nessun chiamante passava un frammento prima di allora, quindi per tutti gli
 * altri questo cambio non sposta un carattere.
 *
 * @param base  - import.meta.env.BASE_URL (may or may not have trailing slash)
 * @param path  - relative path segment, e.g. '/', '/acquisizione', 'idee/#slide-x'
 * @returns       normalised absolute path, e.g. '/experience-design-factory/acquisizione/'
 */
export function href(base: string, path: string = '/'): string {
  const hash = path.indexOf('#');
  if (hash === -1) return `${base}/${path}/`.replace(/\/+/g, '/');
  const rotta = path.slice(0, hash);
  const frammento = path.slice(hash);              // '#...' compreso il cancelletto
  return `${base}/${rotta}/`.replace(/\/+/g, '/') + frammento;
}
