import type { KqlEvent } from '~~/shared/types/kql'

/** Every event of the Agenda, most recent first — shared by every News block of a page. */
export function useEvents() {
  return useFetch<KqlEvent[]>('/api/events', { key: 'events' })
}
