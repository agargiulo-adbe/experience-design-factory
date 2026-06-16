/**
 * Build a base-aware internal URL with guaranteed trailing slash.
 * Normalises double slashes and always appends a trailing slash.
 *
 * @param base  - import.meta.env.BASE_URL (may or may not have trailing slash)
 * @param path  - relative path segment, e.g. '/' or '/acquisizione'
 * @returns       normalised absolute path, e.g. '/experience-design-factory/acquisizione/'
 */
export function href(base: string, path: string = '/'): string {
  const joined = `${base}/${path}/`.replace(/\/+/g, '/');
  return joined;
}
