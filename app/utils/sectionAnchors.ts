import type { SectionContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

export interface SectionAnchor {
  /** Section block id, also the id of its <section> element. */
  id: string
  label: string
}

/**
 * Anchors of the top-level Section blocks of a page, in page order, labelled
 * with the section name editors give in the Panel. An unnamed section is
 * left out.
 */
export function sectionAnchors(blocks: KqlBlock[] | undefined): SectionAnchor[] {
  return (blocks ?? [])
    .filter(block => block.type === 'section' && !block.isHidden)
    .map((block) => {
      const section = block as unknown as KqlBlock<SectionContent>
      return { id: section.id, label: section.content.heading?.trim() ?? '' }
    })
    .filter(anchor => anchor.label !== '')
}
