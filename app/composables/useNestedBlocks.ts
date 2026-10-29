import type { InjectionKey } from 'vue'

const NESTED_KEY: InjectionKey<boolean> = Symbol('nested-blocks')

/**
 * Containers that render blocks inside a narrower frame (accordion
 * sub-section, 3-column content) call this so the blocks below switch to
 * their nested look (Paragraph: title above the text in label style, Titre:
 * label instead of a full-width bar, Citation: smaller).
 */
export function provideNestedBlocks(): void {
  provide(NESTED_KEY, true)
}

/** True when the block is rendered inside an accordion / column. */
export function useIsNested(): boolean {
  return inject(NESTED_KEY, false)
}
