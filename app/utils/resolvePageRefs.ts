import type { KirbyPageRef, KqlPageRef, KqlPageRefs } from '~~/shared/types/kql'

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

/** Front-end path of a page ("" uri = home). */
export function pagePath(page: Pick<KqlPageRef, 'uri'>): string {
  return `/${page.uri === 'home' ? '' : page.uri}`
}
