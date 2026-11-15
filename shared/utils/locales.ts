/**
 * Languages of jat.cms (site/languages): French by default, English under
 * the /en URL prefix. Keep aligned with the Kirby language files.
 */
export const LOCALES = ['fr', 'en'] as const

export type Locale = typeof LOCALES[number]

export const DEFAULT_LOCALE: Locale = 'fr'

/** Any value (query param, header) → a supported locale, French otherwise. */
export function toLocale(value: unknown): Locale {
  return (LOCALES as readonly unknown[]).includes(value) ? value as Locale : DEFAULT_LOCALE
}

/** Locale of a front path: "/en" and "/en/…" are English. */
export function localeFromPath(path: string): Locale {
  return path === '/en' || path.startsWith('/en/') ? 'en' : DEFAULT_LOCALE
}

/** The same path without its locale prefix ("/en/ecole" → "/ecole"). */
export function stripLocale(path: string): string {
  return localeFromPath(path) === 'en' ? path.slice(3) || '/' : path
}

/** Prefixes a locale-less path ("/ecole") for `locale`. */
export function withLocale(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path
  return path === '/' ? '/en' : `/en${path}`
}
