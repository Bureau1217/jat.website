import type { KqlEvent } from '~~/shared/types/kql'

/**
 * Every published event of the Agenda, most recent first. Fetched by
 * template rather than by the agenda page's slug so it keeps working
 * whatever editors name that page.
 */
export default defineEventHandler(async () => {
  const events = await kqlFetch<KqlEvent[]>({
    query: 'site.index.filterBy("intendedTemplate", "event").sortBy("start_date", "desc")',
    select: {
      id: true,
      uri: 'page.uri',
      title: true,
      ...EVENT_SELECT
    }
  })

  return events ?? []
})
