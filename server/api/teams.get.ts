import type { KqlFile, KqlTeam, KqlTeamType } from '~~/shared/types/kql'

interface RawTeam {
  id: string
  title: string
  teamType: string
  members: Array<{
    id: string
    title: string
    firstName: string
    lastName: string
    role: string
    contact: string
    photo: KqlFile | null
  }>
}

const TEAM_TYPES: KqlTeamType[] = ['admin', 'teaching']

/**
 * Every published team (jat.cms `team` template) with its published
 * members, in Panel order — the Team block filters them by `teamType`.
 */
export default defineEventHandler(async (): Promise<KqlTeam[]> => {
  const teams = await kqlFetch<RawTeam[]>({
    query: 'site.index.filterBy("intendedTemplate", "team")',
    select: {
      id: true,
      title: true,
      teamType: 'page.team_type',
      members: {
        query: 'page.children.filterBy("intendedTemplate", "team_member")',
        select: {
          id: true,
          title: true,
          firstName: 'page.first_name',
          lastName: 'page.last_name',
          role: 'page.role',
          contact: 'page.contact',
          photo: {
            query: 'page.photo.toFile',
            select: FILE_SELECT
          }
        }
      }
    }
  })

  return (teams ?? []).map(team => ({
    id: team.id,
    title: team.title,
    teamType: TEAM_TYPES.find(type => type === team.teamType) ?? null,
    members: team.members.map(member => ({
      ...member,
      role: member.role || null,
      contact: member.contact || null
    }))
  }))
})
