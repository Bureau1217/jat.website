/**
 * Plain text of a (possibly HTML) string, cut on a whole word at
 * `maxLength` with an ellipsis — for meta descriptions and teasers.
 */
export function truncateText(html: string | null | undefined, maxLength = 90): string {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  const slice = text.slice(0, maxLength)
  const lastSpace = slice.lastIndexOf(' ')
  const wholeWords = lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  return `${wholeWords.trimEnd()}…`
}
