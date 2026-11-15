import type { Locale } from '~~/shared/utils/locales'
import type { KqlArticleFields, KqlBlock, KqlEventFields, KqlFile, KqlPage, KqlPageChild, KqlProgramFields } from '~~/shared/types/kql'

interface RawChild {
  id: string
  uuid: string
  uri: string
  title: string
  template: string
  description: string | null
  children?: RawChild[] | null
}

interface RawPage {
  id: string
  uuid: string
  parentTitle: string | null
  children: RawChild[] | null
  description: string | null
  outline: string | null
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
  headerFill: string | null
  headerFillReverse: string | null
  subtitle: string | null
  publishedAt: string | null
  heroTitle: string | null
  heroSignature: string | null
  heroFill: string | null
  heroFillReverse: string | null
}

/**
 * Same select for every page template: fields absent from a template just
 * come back empty. `body` holds the blocks of `default` pages, `gallery` the
 * "Galerie photos" of `event` pages.
 */
// Listing pages (programs, teams…) show their published children, and
// programs their groups' programs: two levels.
const CHILD_SELECT = {
  id: true,
  uuid: 'page.uuid',
  uri: 'page.uri',
  title: true,
  template: 'page.intendedTemplate',
  description: 'page.description'
}

const PAGE_SELECT = {
  id: true,
  uuid: 'page.uuid',
  // Null-safe: top-level pages have no parent.
  parentTitle: 'page.parent?.title',
  children: {
    query: 'page.children',
    select: {
      ...CHILD_SELECT,
      children: { query: 'page.children', select: CHILD_SELECT }
    }
  },
  description: 'page.description',
  outline: 'page.outline',
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
  subtitle: 'page.subtitle',
  publishedAt: 'page.published_at.toDate("Y-m-d")',
  headerFill: 'page.header_fill',
  headerFillReverse: 'page.header_fill_reverse',
  heroTitle: 'page.hero_title',
  heroSignature: 'page.hero_signature',
  heroFill: 'page.hero_fill',
  heroFillReverse: 'page.hero_fill_reverse',
  ...EVENT_SELECT
}

/**
 * Fetches a page by its validated id ('' = home page) with every page it
 * references already resolved. Returns null when the page doesn't exist.
 */
export async function fetchPage(id: string, locale: Locale): Promise<KqlPage | null> {
  const raw = await kqlFetch<RawPage | null>({
    query: buildPageQuery(id),
    select: PAGE_SELECT
  }, locale)

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

  const article: KqlArticleFields | null = raw.template === 'article'
    ? {
        subtitle: raw.subtitle || null,
        publishedAt: raw.publishedAt || null,
        categories: raw.categories ?? [],
        cover: raw.cover,
        text: raw.text || null,
        gallery: raw.gallery ?? []
      }
    : null

  const program: KqlProgramFields | null = raw.template === 'program'
    ? { description: raw.description || null, outline: raw.outline || null }
    : null

  return {
    id: raw.id,
    uuid: raw.uuid,
    parentTitle: raw.parentTitle || null,
    children: (raw.children ?? []).map(toChild),
    program,
    uri: raw.uri,
    title: raw.title,
    template: raw.template,
    files: raw.files ?? [],
    pages: await fetchPageRefs(locale, blocks),
    blocks,
    event,
    article,
    headerFill: raw.headerFill
      ? { fill: raw.headerFill, reverse: raw.headerFillReverse === 'true' }
      : null,
    hero: {
      title: raw.heroTitle || null,
      signature: raw.heroSignature || null,
      fill: raw.heroFill
        ? { fill: raw.heroFill, reverse: raw.heroFillReverse === 'true' }
        : null
    }
  }
}

function toChild(raw: RawChild): KqlPageChild {
  return {
    id: raw.id,
    uuid: raw.uuid,
    uri: raw.uri,
    title: raw.title,
    template: raw.template,
    description: raw.description || null,
    children: (raw.children ?? []).map(toChild)
  }
}
