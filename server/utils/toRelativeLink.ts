/**
 * `.toUrl` resolves an internal page/file picked in a Kirby link field into
 * an absolute URL on the CMS host (e.g. "https://jat-admin…/agenda/x") —
 * right path, wrong host, since the front serves that page under its own
 * domain. Strips the CMS origin to get a path the Nuxt router resolves; an
 * external URL, mailto: or tel: is returned untouched.
 */
export function toRelativeLink(url: string | null | undefined, apiUrl: string): string | null {
  if (!url) return null
  try {
    const target = new URL(url, apiUrl)
    const base = new URL(apiUrl)
    return target.origin === base.origin ? `${target.pathname}${target.search}${target.hash}` : url
  } catch {
    return url
  }
}
