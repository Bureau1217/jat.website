const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

/** Parses a Kirby "Y-m-d" date as a local date (no UTC shift). */
function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1)
}

/**
 * "12 mars 2027", or "12 mars 2027 – 14 mars 2027" for a multi-day event.
 * `end` is ignored when empty or identical to `start`.
 */
export function formatEventDate(start: string | null, end?: string | null): string {
  if (!start) return ''
  const startLabel = DATE_FORMAT.format(parseDate(start))
  if (!end || end === start) return startLabel
  return `${startLabel} – ${DATE_FORMAT.format(parseDate(end))}`
}
