import type { KqlEvent } from '~~/shared/types/kql'

export interface SplitEvents {
  /** « À la une »: the event ticked in the Panel, whatever its date. */
  featured: KqlEvent | null
  /** Not over yet (ends today or later), soonest first. */
  upcoming: KqlEvent[]
  /** Over, most recent first. */
  past: KqlEvent[]
}

/**
 * Splits the Agenda for the News block. `today` is a "Y-m-d" date; an event
 * is past once its last day (end date, or start date for a single day) is
 * before it. Dates in Y-m-d compare as strings.
 */
export function splitEvents(events: KqlEvent[], today: string): SplitEvents {
  const featured = events.find(event => event.isFeatured) ?? null
  const others = events.filter(event => event !== featured && event.startDate)
  const lastDay = (event: KqlEvent): string => event.endDate || event.startDate || ''
  const byStart = (a: KqlEvent, b: KqlEvent): number => (a.startDate ?? '').localeCompare(b.startDate ?? '')

  return {
    featured,
    upcoming: others.filter(event => lastDay(event) >= today).sort(byStart),
    past: others.filter(event => lastDay(event) < today).sort((a, b) => byStart(b, a))
  }
}
