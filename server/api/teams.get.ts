import type { KqlFile, KqlTeam } from '~~/shared/types/kql'

interface RawTeam {
  uuid: string
  id: string
  title: string
  members: Array<{
    id: string
    title: string
    firstName: string
    lastName: string
    role: string
    email: string
    phone: string
    instrument: string
    websiteUrl: string
    photo: KqlFile | null
  }>
}

/**
 * Every published team (jat.cms `team` template) with its published
 * members, in Panel order — the Team block filters them by the teams it picks.
 */
export default defineEventHandler(async (): Promise<KqlTeam[]> => {
  const teams = await kqlFetch<RawTeam[]>({
    query: 'site.index.filterBy("intendedTemplate", "team")',
    select: {
      uuid: 'page.uuid',
      id: true,
      title: true,
      members: {
        query: 'page.children.filterBy("intendedTemplate", "team_member")',
        select: {
          id: true,
          title: true,
          firstName: 'page.first_name',
          lastName: 'page.last_name',
          role: 'page.role',
          email: 'page.email',
          phone: 'page.phone',
          instrument: 'page.instrument',
          websiteUrl: 'page.website_url',
          photo: {
            query: 'page.photo.toFile',
            select: FILE_SELECT
          }
        }
      }
    }
  })

  return (teams ?? []).map(team => ({
    ...team,
    members: team.members.map(member => ({
      ...member,
      role: member.role || null,
      email: member.email || null,
      phone: member.phone || null,
      instrument: member.instrument || null,
      websiteUrl: member.websiteUrl || null
    }))
  }))
})
