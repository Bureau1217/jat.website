import type { KqlTeam } from '~~/shared/types/kql'

/** Every published team with its members — shared by every Team block of a page. */
export function useTeams() {
  const locale = useLocale()
  return useFetch<KqlTeam[]>('/api/teams', {
    query: { lang: locale },
    key: () => `teams:${locale.value}`
  })
}
