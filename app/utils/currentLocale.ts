import { localeFromPath, type Locale } from '~~/shared/utils/locales'

/**
 * Language of the current route, read from the router rather than
 * useRoute(): also works in plain functions (pagePath, t, teasers) called
 * outside of a component setup.
 */
export function currentLocale(): Locale {
  const path = tryUseNuxtApp()?.$router.currentRoute.value.path ?? '/'
  return localeFromPath(path)
}
