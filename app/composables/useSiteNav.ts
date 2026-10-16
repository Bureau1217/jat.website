import type { KqlNavItem } from '~~/shared/types/kql'

/** Shared data source for the header nav (deduped by key). */
export function useSiteNav() {
  return useFetch<KqlNavItem[]>('/api/nav', { key: 'site-nav' })
}
