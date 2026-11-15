<template>
  <div class="v-block-accordion">
    <UiDisclosure
      v-for="(item, index) in items"
      :key="index"
      :title="item.heading"
      :style="item.fill"
    >
      <div v-if="item.isThreeColumns && item.top.length" class="v-block-accordion__top">
        <Blocks :blocks="item.top" :files="files" :pages="pages" />
      </div>
      <UiThreeColumns
        v-if="item.isThreeColumns"
        class="v-block-accordion__content"
        :body="item.blocks"
        :aside="item.aside"
        :side="item.side"
        :files="files"
        :pages="pages"
      />
      <div v-else class="v-block-accordion__content u-nested">
        <Blocks :blocks="item.blocks" :files="files" :pages="pages" />
      </div>
    </UiDisclosure>
  </div>
</template>

<script setup lang="ts">
import type { AccordionContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/** Sous-sections, each with its own layout ("Simple" / "3 colonnes") and bar fill. */

const props = defineProps<{
  block: KqlBlock<AccordionContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const items = computed(() => (props.block.content.items ?? []).map(item => ({
  heading: item.heading,
  isThreeColumns: item.layout === 'three_columns',
  blocks: parseKqlBlocks(item.body),
  aside: parseKqlBlocks(item.aside),
  side: parseKqlBlocks(item.side),
  top: parseKqlBlocks(item.top),
  // Overrides the --bar-* fill inherited from the Section for this bar only.
  fill: fillVariables('bar', resolveFill(item.fill, item.fill_reverse))
})))
</script>

<style lang="scss" scoped>
.v-block-accordion {
  // The page gutter, kept for the content: inside it --gutter is reset to 0.
  --accordion-gutter: var(--gutter);

  padding-block: var(--block-spacing);
}

// Full width under the bar: a cover image spans the page, other blocks
// keep the page gutter.
.v-block-accordion__top {
  --block-spacing: var(--spacing-2xl);
}

.v-block-accordion__content {
  padding: var(--spacing-4xl) var(--accordion-gutter);
}
</style>
