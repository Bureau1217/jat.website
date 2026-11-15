import { localeFromPath, type Locale } from '~~/shared/utils/locales'

/** Language of the current route ("/en/…" = English). */
export function useLocale(): ComputedRef<Locale> {
  const route = useRoute()
  return computed(() => localeFromPath(route.path))
}
