import type { KqlPageRef, KqlPageRefs } from '~~/shared/types/kql'

const PAGE_REF_PATTERN = /page:\/\/[a-z0-9]+/gi

type RawPageRef = KqlPageRef & { status: 'draft' | 'unlisted' | 'listed' }

/**
 * Block content only stores "page://<uuid>" references (pages fields, link
 * fields), at any nesting depth — nested blocks fields are JSON strings
 * inside the outer JSON, but a uuid stays a plain substring either way. This
 * collects every reference in `values` and resolves them all in a single KQL
 * request, so no block has to fetch its own pages. Drafts are dropped: an
 * API user can read them, visitors must not see them.
 */
export async function fetchPageRefs(...values: unknown[]): Promise<KqlPageRefs> {
  const uuids = [...new Set(JSON.stringify(values).match(PAGE_REF_PATTERN) ?? [])]

  if (uuids.length === 0) {
    return {}
  }

  // One aliased sub-query per uuid ("p0", "p1"…): KQL has no "find many by
  // uuid" query, but every select key runs its own query.
  const select = Object.fromEntries(uuids.map((uuid, index) => [
    `p${index}`,
    { query: `page("${uuid}")`, select: PAGE_REF_SELECT }
  ]))

  const result = await kqlFetch<Record<string, RawPageRef | null>>({ query: 'site', select })

  const refs: KqlPageRefs = {}
  for (const ref of Object.values(result ?? {})) {
    if (ref && ref.status !== 'draft') {
      const { status: _status, ...pageRef } = ref
      refs[pageRef.uuid] = pageRef
    }
  }

  return refs
}
