const MONTH = new Intl.DateTimeFormat('fr-FR', { month: 'long' })

/** Parses a Kirby "Y-m-d" date as a local date (no UTC shift). */
function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1)
}

/** « 1er », « 2 »… — French ordinal for the first day of the month. */
function day(date: Date): string {
  return date.getDate() === 1 ? '1er' : String(date.getDate())
}

function dayMonth(date: Date): string {
  return `${day(date)} ${MONTH.format(date)}`
}

function full(date: Date): string {
  return `${dayMonth(date)} ${date.getFullYear()}`
}

/**
 * Dates as in the mockup: « 27 mars 2026 », « 28 au 30 juin 2026 »,
 * « 28 mai au 2 juin 2026 », « 28 décembre 2026 au 2 janvier 2027 ».
 * `end` is ignored when empty or identical to `start`.
 */
export function formatEventDate(start: string | null, end?: string | null): string {
  if (!start) return ''
  const from = parseDate(start)
  if (!end || end === start) return full(from)

  const to = parseDate(end)
  if (from.getFullYear() !== to.getFullYear()) return `${full(from)} au ${full(to)}`
  if (from.getMonth() !== to.getMonth()) return `${dayMonth(from)} au ${full(to)}`
  return `${day(from)} au ${full(to)}`
}
