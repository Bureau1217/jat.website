<template>
  <figure
    class="v-block-quote u-flex u-flex--column u-gap-m"
    :class="[`v-block-quote--${alignment}`, { 'v-block-quote--nested': isNested, 'u-block': !isNested }]"
  >
    <blockquote class="v-block-quote__text" v-html="text" />
    <figcaption v-if="block.content.author" class="v-block-quote__author">{{ block.content.author }}</figcaption>
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
</script>

<style lang="scss" scoped>
.v-block-quote {
  margin: 0;
}

.v-block-quote:not(.v-block-quote--nested) {
  padding-block: var(--space-quote);
}

.v-block-quote--center {
  align-items: center;
  text-align: center;
}

.v-block-quote--right {
  align-items: flex-end;
  text-align: right;
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

.v-block-quote--nested .v-block-quote__text {
  @include t-citation;
}

.v-block-quote__author {
  @include t-small-bold;
}
</style>
