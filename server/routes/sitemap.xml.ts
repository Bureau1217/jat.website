import type { SitemapEntry } from '../utils/sitemap'

interface SitemapPage {
  id: string
  template: string
  modified: string | null
}

// Templates the front renders (see app/pages/[...slug].vue). Data pages
// (informations, teams, agenda, programs) have no page of their own.
const PUBLIC_TEMPLATES = ['default', 'event', 'article']

// Pages that exist but stay out of the sitemap, by Kirby page id.
const EXCLUDED_IDS = ['page-dev', 'mentions-legales']

// Most important pages first for crawlers (keyed by Kirby page id). Any
// other page falls back to a medium default, events to the lowest tier.
const PAGE_PRIORITY: Record<string, { priority: number, changefreq: SitemapEntry['changefreq'] }> = {
  'home': { priority: 1.0, changefreq: 'weekly' },
  'se-former': { priority: 0.9, changefreq: 'monthly' },
  'concerts-projets': { priority: 0.8, changefreq: 'monthly' },
  'actualites': { priority: 0.8, changefreq: 'weekly' },
  'ecole': { priority: 0.7, changefreq: 'monthly' }
}

/**
 * Site origin from NUXT_PUBLIC_SITE_URL when set (pins the canonical domain),
 * else from the request (honoring a reverse proxy's X-Forwarded-* headers).
 */
function siteOrigin(event: Parameters<typeof getRequestURL>[0]): string {
  const configured = useRuntimeConfig(event).public.siteUrl as string
  if (configured) return configured.replace(/\/+$/, '')
  return getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin
}

function entryFor(page: SitemapPage): SitemapEntry {
  const known = PAGE_PRIORITY[page.id]
  return {
    loc: page.id === 'home' ? '/' : `/${page.id}`,
    lastmod: page.modified ?? undefined,
    changefreq: known?.changefreq ?? 'monthly',
    priority: known?.priority ?? (page.template === 'event' ? 0.4 : 0.6)
  }
}

/** /sitemap.xml — every published page the front renders. */
export default defineCachedEventHandler(async (event) => {
  // site.index never includes drafts; unlisted pages (e.g. page-dev) are
  // excluded by id above.
  const pages = await kqlFetch<SitemapPage[] | null>({
    query: 'site.index',
    select: {
      id: true,
      template: 'page.intendedTemplate',
      modified: 'page.modified("Y-m-d")'
    }
  })

  const entries = (pages ?? [])
    .filter(page => PUBLIC_TEMPLATES.includes(page.template) && !EXCLUDED_IDS.includes(page.id))
    .map(entryFor)
    .sort((a, b) => (a.loc === '/' ? -1 : b.loc === '/' ? 1 : a.loc.localeCompare(b.loc)))

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return buildSitemapXML(siteOrigin(event), entries)
}, {
  // Re-read from Kirby at most once an hour; never cached in dev.
  maxAge: 60 * 60,
  swr: false,
  shouldBypassCache: () => import.meta.dev,
  getKey: event => getRequestHost(event, { xForwardedHost: true })
})
