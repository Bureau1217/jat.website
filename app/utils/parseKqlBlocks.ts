import type { KqlBlock } from '~~/shared/types/kql'

/**
 * Blocks nested inside a block (Section body, columns, accordion items) are
 * stored double-encoded: the outer blocks field is JSON, so a blocks field
 * nested inside it stays a raw JSON string instead of being decoded like
 * the top-level one. Hidden blocks are dropped here once for every caller.
 */
export function parseKqlBlocks(raw: unknown): KqlBlock[] {
  let blocks: unknown = raw

  if (typeof raw === 'string') {
    try {
      blocks = raw === '' ? [] : JSON.parse(raw)
    } catch {
      return []
    }
  }

  return Array.isArray(blocks)
    ? (blocks as KqlBlock[]).filter(block => !block.isHidden)
    : []
}
