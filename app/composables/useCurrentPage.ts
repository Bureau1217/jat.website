import type { KqlPage } from '~~/shared/types/kql'

/**
 * The Kirby page of the current route, in the current language. Called by
 * pages/[...slug].vue and by NavigationMenu (its « Fond de la navigation »):
 * same key, so a single request — and the navigation knows its fill when it
 * renders on the server, before the page component runs.
 */
export function useCurrentPage() {
  const route = useRoute()
  const locale = useLocale()

  // Kirby page id: the URL without its /en prefix.
  const path = computed(() => {
    const segments = Array.isArray(route.params.slug) ? route.params.slug : []
    return (locale.value === 'en' ? segments.slice(1) : segments).join('/')
  })

  return useFetch<KqlPage>(
    () => (path.value === '' ? '/api/page' : `/api/page/${path.value}`),
    {
      query: { lang: locale },
      key: () => `page:${locale.value}:${path.value}`
    }
  )
}
