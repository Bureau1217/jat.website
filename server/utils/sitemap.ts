/**
 * Sitemap XML builder — reusable in any Nuxt + Kirby project of the studio
 * (same as jav.website).
 */
export type SitemapChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export interface SitemapEntry {
  /** URL path, e.g. '/se-former' */
  loc: string
  /** ISO date, e.g. '2026-10-28' */
  lastmod?: string
  changefreq?: SitemapChangeFreq
  /** 0.0 to 1.0 */
  priority?: number
  /** Same page in other languages: hreflang → URL path. */
  alternates?: Record<string, string>
}

/** Builds a complete sitemap XML document from a list of entries. */
export function buildSitemapXML(siteURL: string, entries: SitemapEntry[]): string {
  const urls = entries.map((entry) => {
    const parts = [
      `<loc>${escapeXML(siteURL + entry.loc)}</loc>`,
      entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : '',
      entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : '',
      entry.priority !== undefined ? `<priority>${entry.priority.toFixed(1)}</priority>` : '',
      ...Object.entries(entry.alternates ?? {}).map(([lang, path]) =>
        `<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXML(siteURL + path)}"/>`)
    ].filter(Boolean)
    return `  <url>\n    ${parts.join('\n    ')}\n  </url>`
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>'
  ].join('\n')
}

function escapeXML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
