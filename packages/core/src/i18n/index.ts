export type Locale = 'it' | 'en';
export type Localized<T> = Record<Locale, T>;

export const DEFAULT_LOCALE: Locale = 'it';
export const SUPPORTED_LOCALES: Locale[] = ['it', 'en'];

export function t<T>(localized: Localized<T>, locale: Locale = DEFAULT_LOCALE): T {
  return localized[locale];
}
