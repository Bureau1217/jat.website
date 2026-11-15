import type { KirbyPageRef, KqlPageRef, KqlPageRefs } from '~~/shared/types/kql'
import { withLocale, type Locale } from '~~/shared/utils/locales'

/**
 * Block content stores pages as "page://<uuid>" refs — the server already
 * resolved every one of them (see server/utils/fetchPageRefs.ts); this
 * just looks them up, keeping the editor's order. Unpublished or deleted
 * pages are absent from `pages` and silently skipped.
 */
export function resolvePageRefs(refs: KirbyPageRef[] | undefined, pages: KqlPageRefs | undefined): KqlPageRef[] {
  if (!refs?.length || !pages) {
    return []
  }

  return refs
    .map(ref => pages[ref])
    .filter((page): page is KqlPageRef => Boolean(page))
}

/**
 * Front-end path of a page ("home" uri = home), in the language of the
 * current route unless `locale` is given — so every link of an English
 * page stays under /en.
 */
export function pagePath(page: Pick<KqlPageRef, 'uri'>, locale?: Locale): string {
  const path = `/${page.uri === 'home' ? '' : page.uri}`
  return withLocale(path, locale ?? currentLocale())
}
