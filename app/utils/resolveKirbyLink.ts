import type { KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/**
 * Resolves the raw value of a Kirby link field stored in block content
 * ("page://<uuid>", "file://<uuid>", or a plain URL / mailto: / tel:) into
 * an href. Returns null when the target is missing or unpublished.
 */
export function resolveKirbyLink(
  value: string | undefined,
  pages: KqlPageRefs | undefined,
  files: KqlFile[] | undefined
): string | null {
  if (!value) return null
  if (value.startsWith('page://')) {
    const page = pages?.[value]
    return page ? pagePath(page) : null
  }
  if (value.startsWith('file://')) {
    return resolveKqlFile([value], files)?.url ?? null
  }
  return value
}

/** Whether an href leaves the site (opened in a new tab). */
export function isExternalLink(href: string): boolean {
  return /^https?:\/\//.test(href)
}
