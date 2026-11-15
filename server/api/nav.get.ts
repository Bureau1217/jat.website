import type { KqlNavItem, KqlNavSection } from '~~/shared/types/kql'

/**
 * The header nav is generated from the real page tree: every listed
 * top-level `default` page, in the order editors drag them into in the
 * Panel. Data pages (informations, teams, agenda, programs) use other
 * templates and are left out automatically.
 */
export default defineEventHandler(async (event): Promise<KqlNavSection[]> => {
  const pages = await kqlFetch<Array<KqlNavItem & { children: KqlNavItem[] | null }>>({
    query: 'site.children.listed.filterBy("intendedTemplate", "default")',
    select: {
      id: true,
      title: true,
      uri: 'page.uri',
      // "Repères" bar of the section's pages without sections of their own.
      children: {
        query: 'page.children.listed.filterBy("intendedTemplate", "default")',
        select: { id: true, title: true, uri: 'page.uri' }
      }
    }
  }, requestLocale(event))

  return (pages ?? []).map(page => ({ ...page, children: page.children ?? [] }))
})
