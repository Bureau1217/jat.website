import type { KqlPage } from '~~/shared/types/kql'

/**
 * The page of the current route. Called by app.vue (navigation fill known
 * before the navigation renders) and by pages/[...slug].vue: same key, so a
 * single request is made.
 */
export function useCurrentPage() {
  const route = useRoute()
  const path = computed(() =>
    Array.isArray(route.params.slug) ? route.params.slug.join('/') : ''
  )

  return useFetch<KqlPage>(
    () => (path.value === '' ? '/api/page' : `/api/page/${path.value}`),
    { key: () => `page:${path.value}` }
  )
}
