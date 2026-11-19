const NBSP = ' '

/** Closing tags that end a line of text: the last words before them are kept together. */
const BLOCK_END = /^<\/(?:p|li|h[1-6]|blockquote|figcaption|dd|dt|td|th)\s*>$|^<br\s*\/?>$/i

const BLOCK_START = /^<(?:p|li|h[1-6]|div|ul|ol|blockquote|figcaption|dd|dt|td|th)\b/i

/** Longest last word glued to the one before: beyond that, two words held together could overflow a phone's line. */
const MAX_TAIL = 14

/**
 * No widow or orphan in text coming from the CMS (« veuves et orphelines »):
 * - a short word (1 or 2 letters: à, de, la, un, et, of, to…) never ends a
 *   line, it is held with the word after it;
 * - the last word of a paragraph, list item or title never sits alone on
 *   its line, it is held with the word before it.
 * Done with no-break spaces in the text between tags, never in attributes
 * or URLs. Works on plain text too (no tag).
 */
export function noWidows(html: string): string {
  const parts = html.split(/(<[^>]*>)/)

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index]!
    if (part.startsWith('<')) continue
    parts[index] = part.replace(/(?<=^|[\s(«“"'’])([\p{L}\p{N}]{1,2}['’]?)[ \t\r\n]+(?=[^ \t\r\n])/gu, `$1${NBSP}`)
  }

  // Walks back from the end of a block to its last breakable space (a
  // regular one: no-break spaces already hold), across inline tags
  // (<em>, <strong>, <a>…), and makes it a no-break space.
  const holdLastWord = (end: number): void => {
    let tail = 0
    for (let index = end - 1; index >= 0; index--) {
      const part = parts[index]!
      if (part.startsWith('<')) {
        if (BLOCK_END.test(part) || BLOCK_START.test(part)) return
        continue
      }
      // Spaces right before the end of the block are not a line break.
      const head = tail === 0 ? part.replace(/[ \t\r\n]+$/, '') : part
      const space = /[ \t\r\n]+(?=[^ \t\r\n]*$)/.exec(head)
      if (!space) {
        tail += head.length
        if (tail > MAX_TAIL) return
        continue
      }
      const lastWord = head.slice(space.index + space[0].length)
      if (tail + lastWord.length > MAX_TAIL) return
      parts[index] = head.slice(0, space.index) + NBSP + lastWord + part.slice(head.length)
      return
    }
  }

  for (let index = 0; index < parts.length; index++) {
    if (BLOCK_END.test(parts[index]!)) holdLastWord(index)
  }
  holdLastWord(parts.length)

  return parts.join('')
}
