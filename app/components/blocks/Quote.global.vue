<template>
  <figure
    class="v-block-quote u-flex u-flex--column u-gap-m"
    :class="[`v-block-quote--${alignment}`, { 'v-block-quote--nested': isNested, 'v-block-quote--filled': hasFill, 'u-block': !isNested }]"
    :style="style"
  >
    <!-- « Alignée à droite »: on the ¾ column, like the running text (mockup: Se former). -->
    <UiTwoColumns v-if="isAside">
      <div class="u-flex u-flex--column u-gap-m">
        <blockquote class="v-block-quote__text" v-html="text" />
        <figcaption v-if="block.content.author" class="v-block-quote__author">{{ block.content.author }}</figcaption>
      </div>
    </UiTwoColumns>
    <template v-else>
      <blockquote class="v-block-quote__text" v-html="text" />
      <figcaption v-if="block.content.author" class="v-block-quote__author">{{ block.content.author }}</figcaption>
    </template>
  </figure>
</template>

<script setup lang="ts">
import type { QuoteContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<QuoteContent>
}>()

// Inline writer: Enter / Shift + Enter both give a <br>, kept as is.
const text = computed(() => frenchSpacing(props.block.content.text))
const alignment = computed(() => (props.block.content.alignment === 'right' ? 'right' : 'center'))

const isNested = useIsNested()
const isAside = computed(() => alignment.value === 'right' && !isNested)

// Colors picked in the Panel: an optional fill turns the quote into a band
// (mockup: the home quote on the Accueil blue), and an optional text color
// wins over the fill's own text color.
const hasFill = computed(() => isFill(props.block.content.fill))
const style = computed(() => {
  const fill = fillStyle(props.block.content.fill, props.block.content.fill_reverse, 'quote')
  const color = colorValue(props.block.content.text_color)
  return color ? { ...fill, color } : fill
})
</script>

<style lang="scss" scoped>
.v-block-quote {
  margin: 0;
}

.v-block-quote:not(.v-block-quote--nested) {
  padding-block: var(--space-quote);
}

// Inline color (text color picked in the Panel) still wins: it's on the element.
.v-block-quote--filled {
  @include fill-background(quote);
}

.v-block-quote--nested.v-block-quote--filled {
  padding: var(--block-spacing);
}

.v-block-quote--center {
  align-items: center;
  text-align: center;
}

// Mockup: left-aligned on the ¾ column, in the pull-quote style (Gaya 40).
.v-block-quote--right {
  align-items: stretch;
  text-align: left;
}

// Page level: Gaya catch line (accueil); in a column: Gaya pull quote.
.v-block-quote__text {
  @include t-accroche;
  margin: 0;
  // Mockup: 804px (accueil) to 1172px wide at 1440px.
  max-width: scaled(1004px);

  :deep(em) {
    font-style: normal;
  }
}

.v-block-quote--nested .v-block-quote__text,
.v-block-quote--right .v-block-quote__text {
  @include t-citation;
  max-width: none;
}

.v-block-quote__author {
  @include t-small-bold;
}
</style>
