import type { KqlNavItem } from '~~/shared/types/kql'

/**
 * The header nav is generated from the real page tree: every listed
 * top-level `default` page, in the order editors drag them into in the
 * Panel. Data pages (informations, teams, agenda, programs) use other
 * templates and are left out automatically.
 */
export default defineEventHandler(async () => {
  const pages = await kqlFetch<KqlNavItem[]>({
    query: 'site.children.listed.filterBy("intendedTemplate", "default")',
    select: {
      id: true,
      title: true,
      uri: 'page.uri'
    }
  })

  return pages ?? []
})
