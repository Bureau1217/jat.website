import type { KqlFile, KqlTeam, KqlTeamMemberProfile } from '~~/shared/types/kql'

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
    courses: Array<{ id: string, title: string, uri: string }> | null
    bio: string
    cursus: string
    bands: string
    collaborations: string
    links: Array<{ label: string, url: string }> | null
    videos: Array<{ url: string }> | null
  }>
}

/**
 * Every published team (jat.cms `team` template) with its published
 * members, in Panel order — the Team block filters them by the teams it picks.
 */
export default defineEventHandler(async (event): Promise<KqlTeam[]> => {
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
          },
          // Drafted courses are left out: they have no page to link to.
          courses: {
            query: 'page.courses.toPages.published',
            select: { id: true, title: true, uri: 'page.uri' }
          },
          bio: 'page.bio',
          cursus: 'page.cursus',
          bands: 'page.bands',
          collaborations: 'page.collaborations',
          links: {
            query: 'page.links.toStructure',
            select: { label: 'structureItem.link_label', url: 'structureItem.link_url' }
          },
          videos: {
            query: 'page.video_links.toStructure',
            select: { url: 'structureItem.video_url' }
          }
        }
      }
    }
  }, requestLocale(event))

  return (teams ?? []).map(team => ({
    ...team,
    // Profile fields are regrouped under `profile`, not sent twice.
    members: team.members.map(({ bio: _bio, cursus: _cursus, bands: _bands, collaborations: _collaborations, links: _links, videos: _videos, ...member }, index) => ({
      ...member,
      role: member.role || null,
      email: member.email || null,
      phone: member.phone || null,
      instrument: member.instrument || null,
      websiteUrl: member.websiteUrl || null,
      courses: member.courses ?? [],
      profile: memberProfile(team.members[index]!)
    }))
  }))
})

/** Fiche dépliable: null when none of its fields is filled. */
function memberProfile(member: RawTeam['members'][number]): KqlTeamMemberProfile | null {
  const profile: KqlTeamMemberProfile = {
    bio: member.bio || null,
    cursus: member.cursus || null,
    bands: member.bands || null,
    collaborations: member.collaborations || null,
    links: (member.links ?? []).filter(link => link.label && link.url),
    videos: (member.videos ?? []).map(video => video.url).filter(Boolean)
  }
  const isEmpty = !profile.bio && !profile.cursus && !profile.bands && !profile.collaborations
    && profile.links.length === 0 && profile.videos.length === 0
  return isEmpty ? null : profile
}
