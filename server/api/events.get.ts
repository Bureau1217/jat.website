import type { KqlEvent } from '~~/shared/types/kql'

type RawEvent = Omit<KqlEvent, 'isFeatured'> & { isFeatured: boolean | null }

/**
 * Every published event of the Agenda, in date order. The News block
 * splits them into « À la une », « À venir » and « Passé » (splitEvents).
 * Fetched by template rather than by the agenda page's slug so it keeps
 * working whatever editors name that page.
 */
export default defineEventHandler(async (): Promise<KqlEvent[]> => {
  const events = await kqlFetch<RawEvent[]>({
    query: 'site.index.filterBy("intendedTemplate", "event").sortBy("start_date", "asc")',
    select: {
      id: true,
      uri: 'page.uri',
      title: true,
      isFeatured: 'page.is_featured.toBool',
      ...EVENT_SELECT
    }
  })

  return (events ?? []).map(event => ({
    ...event,
    excerpt: event.excerpt || null,
    isFeatured: event.isFeatured === true
  }))
})
