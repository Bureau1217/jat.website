import type { H3Event } from 'h3'
import { toLocale, type Locale } from '~~/shared/utils/locales'

/** Content language asked by the front (`?lang=en`), French by default. */
export function requestLocale(event: H3Event): Locale {
  return toLocale(getQuery(event).lang)
}
