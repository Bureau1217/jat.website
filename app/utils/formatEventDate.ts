import type { Locale } from '~~/shared/utils/locales'

const INTL_LOCALE: Record<Locale, string> = { fr: 'fr-FR', en: 'en-GB' }
const RANGE_WORD: Record<Locale, string> = { fr: 'au', en: 'to' }

function formatter(locale: Locale, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], options)
}

/** Parses a Kirby "Y-m-d" date as a local date (no UTC shift). */
function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1)
}

/**
 * "12 mars 2027", or for a multi-day event the compact range of the mockup:
 * "28 au 30 juin 2026", "28 juin au 2 juillet 2026",
 * "28 décembre 2026 au 2 janvier 2027" ("28 to 30 June 2026" in English).
 * `end` is ignored when empty or identical to `start`.
 */
export function formatEventDate(start: string | null, end?: string | null, locale: Locale = currentLocale()): string {
  if (!start) return ''
  const full = formatter(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  const startDate = parseDate(start)
  if (!end || end === start) return full.format(startDate)

  const endDate = parseDate(end)
  const range = ` ${RANGE_WORD[locale]} ${full.format(endDate)}`
  if (startDate.getFullYear() !== endDate.getFullYear()) return full.format(startDate) + range
  if (startDate.getMonth() !== endDate.getMonth()) return formatter(locale, { day: 'numeric', month: 'long' }).format(startDate) + range
  return formatter(locale, { day: 'numeric' }).format(startDate) + range
}
