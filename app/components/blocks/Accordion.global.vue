<template>
  <div class="v-block-accordion u-block" :class="{ 'v-block-accordion--themed': theme }" :style="theme">
    <details v-for="(item, index) in items" :key="index" class="v-block-accordion__item">
      <summary class="v-block-accordion__summary u-flex u-flex--align-center u-flex--justify-between u-gap-xl">
        <h3 class="v-block-accordion__title">{{ item.heading }}</h3>
        <span class="v-block-accordion__icon" aria-hidden="true" />
      </summary>
      <div class="v-block-accordion__content u-nested">
        <Blocks :blocks="item.blocks" :files="files" :pages="pages" />
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { AccordionContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<AccordionContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const items = computed(() => (props.block.content.items ?? []).map(item => ({
  heading: item.heading,
  blocks: parseKqlBlocks(item.body)
})))

// "Thème" toggle on: the editor's background/text colors, applied as CSS
// variables so nested blocks (buttons included) follow them.
const theme = computed(() => {
  const { has_theme: hasTheme, background_color: background, text_color: text } = props.block.content
  if (!isKirbyTrue(hasTheme) || !background || !text) return undefined
  return {
    '--accordion-background': background,
    '--accordion-text': text,
    '--button-color': text,
    '--button-text': background
  }
})
</script>

<style lang="scss" scoped>
.v-block-accordion--themed {
  background: var(--accordion-background);
  color: var(--accordion-text);
}

.v-block-accordion__item {
  border-bottom: 1px solid currentColor;

  &:first-child {
    border-top: 1px solid currentColor;
  }

  &[open] .v-block-accordion__icon::after {
    transform: translate(-50%, -50%) scaleY(0);
  }
}

.v-block-accordion__summary {
  padding-block: var(--spacing-xl);
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
}

.v-block-accordion__title {
  flex: 1;
  // Lets a long title wrap instead of pushing the icon out of the row.
  min-width: 0;
}

// "+" that becomes a "−" when open.
.v-block-accordion__icon {
  position: relative;
  flex-shrink: 0;
  width: 24px;
  height: 24px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background: currentColor;
    transform: translate(-50%, -50%);
  }

  &::before {
    width: 100%;
    height: 2px;
  }

  &::after {
    width: 2px;
    height: 100%;
    transition: transform 0.2s ease;
  }
}

.v-block-accordion__content {
  padding-bottom: var(--spacing-xl);
}
</style>
