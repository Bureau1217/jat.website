import type { KqlBlock, KqlEventFields, KqlFile, KqlPage } from '~~/shared/types/kql'

interface RawPage {
  id: string
  uri: string
  title: string
  template: string
  files: KqlFile[]
  blocks: KqlBlock[] | null
  gallery: KqlFile[] | null
  text: string | null
  startDate: string | null
  endDate: string | null
  schedule: string | null
  location: string | null
  categories: string[] | null
  cover: KqlFile | null
}

/**
 * Same select for every page template: fields absent from a template just
 * come back empty. `body` holds the blocks of `default` pages, `gallery` the
 * "Galerie photos" of `event` pages.
 */
const PAGE_SELECT = {
  id: true,
  uri: 'page.uri',
  title: true,
  template: 'page.intendedTemplate',
  files: {
    query: 'page.files',
    select: FILE_SELECT
  },
  blocks: {
    query: 'page.body.toBlocks',
    select: BLOCK_SELECT
  },
  gallery: {
    query: 'page.gallery.toFiles',
    select: FILE_SELECT
  },
  text: 'page.text',
  ...EVENT_SELECT
}

/**
 * Fetches a page by its validated id ('' = home page) with every page it
 * references already resolved. Returns null when the page doesn't exist.
 */
export async function fetchPage(id: string): Promise<KqlPage | null> {
  const raw = await kqlFetch<RawPage | null>({
    query: buildPageQuery(id),
    select: PAGE_SELECT
  })

  if (!raw) {
    return null
  }

  const blocks = raw.blocks ?? []

  const event: KqlEventFields | null = raw.template === 'event'
    ? {
        startDate: raw.startDate || null,
        endDate: raw.endDate || null,
        schedule: raw.schedule || null,
        location: raw.location || null,
        categories: raw.categories ?? [],
        cover: raw.cover,
        text: raw.text || null,
        gallery: raw.gallery ?? []
      }
    : null

  return {
    id: raw.id,
    uri: raw.uri,
    title: raw.title,
    template: raw.template,
    files: raw.files ?? [],
    pages: await fetchPageRefs(blocks),
    blocks,
    event
  }
}
