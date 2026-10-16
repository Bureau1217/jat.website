// Every image is requested resized by Kirby's thumb generator (2000px wide
// max, aspect ratio kept) instead of its original upload size. `.resize()`
// is a no-op on non-resizable files (SVG pictograms, PDF documents), so
// FILE_SELECT is safe for every file.
export const FILE_SELECT = {
  filename: true,
  url: 'file.resize(2000).url',
  alt: 'file.alt',
  width: 'file.resize(2000).width',
  height: 'file.resize(2000).height',
  extension: true,
  uuid: 'file.uuid',
  focus: 'file.focus'
}

/** Fields of the `event` template (jat.cms: site/blueprints/pages/event.yml). */
export const EVENT_SELECT = {
  startDate: 'page.start_date.toDate("Y-m-d")',
  endDate: 'page.end_date.toDate("Y-m-d")',
  schedule: 'page.schedule',
  location: 'page.location',
  categories: 'page.categories.split',
  cover: {
    query: 'page.cover.toFile',
    select: FILE_SELECT
  }
}

/**
 * Select shape of any page referenced from block content — see
 * fetchPageRefs.ts. Template-specific fields are harmless no-ops (null /
 * []) on the other templates.
 */
export const PAGE_REF_SELECT = {
  uuid: 'page.uuid',
  id: true,
  uri: 'page.uri',
  title: true,
  template: 'page.intendedTemplate',
  status: 'page.status',
  parentTitle: 'page.parent.title',
  description: 'page.description',
  ...EVENT_SELECT
}

export const BLOCK_SELECT = {
  id: true,
  type: true,
  isHidden: true,
  content: true
}

/**
 * `id` is expected to already be validated by sanitizePageId.
 * An empty id targets the site's home page.
 */
export function buildPageQuery(id: string): string {
  return id === '' ? 'site.homePage' : `page("${id}")`
}
