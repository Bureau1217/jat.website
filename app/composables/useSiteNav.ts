import type { KqlNavSection } from '~~/shared/types/kql'

/** Shared data source for the header nav (deduped by key). */
export function useSiteNav() {
  const locale = useLocale()
  return useFetch<KqlNavSection[]>('/api/nav', {
    query: { lang: locale },
    key: () => `site-nav:${locale.value}`
  })
}
