import type { KqlSiteInfo } from '~~/shared/types/kql'

/**
 * Shared data source for "Informations générales" — same key everywhere so
 * the header and the footer don't each fire their own request.
 */
export function useSiteInfo() {
  return useFetch<KqlSiteInfo>('/api/site-infos', { key: 'site-infos' })
}
