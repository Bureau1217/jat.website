import type { KqlTeam } from '~~/shared/types/kql'

/** Every published team with its members — shared by every Team block of a page. */
export function useTeams() {
  return useFetch<KqlTeam[]>('/api/teams', { key: 'teams' })
}
