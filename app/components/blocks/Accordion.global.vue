<template>
  <div class="v-block-accordion">
    <details
      v-for="(item, index) in items"
      :key="index"
      class="v-block-accordion__item"
      :style="item.style"
      @toggle="onToggle(index, $event)"
    >
      <UiBar as="summary" level="h3" :title="item.heading" toggle :open="openItems.has(index)" />

      <div class="v-block-accordion__content">
        <!-- 3 colonnes: the sub-section title, set large, opens the content. -->
        <p v-if="item.isThreeColumns" class="v-block-accordion__hero u-gutter-x" aria-hidden="true">
          {{ item.heading }}
        </p>
        <div class="v-block-accordion__body u-gutter-x">
          <UiThreeColumns
            v-if="item.isThreeColumns"
            :body="item.blocks"
            :aside="item.aside"
            :files="files"
            :pages="pages"
          />
          <UiTwoColumns v-else>
            <div class="u-nested u-flex u-flex--column u-gap-stack">
              <Blocks :blocks="item.blocks" :files="files" :pages="pages" />
            </div>
          </UiTwoColumns>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { AccordionContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/**
 * Sous-sections, each opened by a UiBar (h3 + « ± »). « Simple »: its
 * blocks on the ¾ column; « 3 colonnes »: the title set large, then
 * Sommaire · content · Contenus liés. A sub-section can pick a named fill
 * (« dégradé » / « aplat »), otherwise the page theme's bar fill applies.
 */
const props = defineProps<{
  block: KqlBlock<AccordionContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

provideNestedBlocks()

const items = computed(() => (props.block.content.items ?? []).map(item => ({
  heading: item.heading,
  isThreeColumns: item.layout === 'three_columns',
  blocks: parseKqlBlocks(item.body),
  aside: parseKqlBlocks(item.aside),
  style: fillStyle(item.fill, item.fill_reverse, 'bar')
})))

// Native <details> keeps its own open state; mirror it for the « ± » icon.
const openItems = ref(new Set<number>())
function onToggle(index: number, event: Event): void {
  const next = new Set(openItems.value)
  if ((event.target as HTMLDetailsElement).open) next.add(index)
  else next.delete(index)
  openItems.value = next
}
</script>

<style lang="scss" scoped>
.v-block-accordion__content {
  padding-bottom: var(--space-section);
}

// Mockup: the formation name in Gaya, large, on the page hero fill.
.v-block-accordion__hero {
  @include t-signature;
  padding-block: var(--spacing-5xl);
  @include fill-background(hero);
  text-transform: none;
}

.v-block-accordion__body {
  padding-top: var(--space-bar);
}
</style>
