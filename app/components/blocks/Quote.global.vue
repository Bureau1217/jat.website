<template>
  <figure class="v-block-quote u-block u-flex u-flex--column u-gap-m" :class="`v-block-quote--${alignment}`">
    <blockquote class="v-block-quote__text" v-html="block.content.text" />
    <figcaption v-if="block.content.author" class="v-block-quote__author">{{ block.content.author }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { QuoteContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<QuoteContent>
}>()

const alignment = computed(() => (props.block.content.alignment === 'right' ? 'right' : 'center'))
</script>

<style lang="scss" scoped>
.v-block-quote {
  margin: 0;
}

.v-block-quote--center {
  align-items: center;
  text-align: center;
}

.v-block-quote--right {
  align-items: flex-end;
  text-align: right;
}

.v-block-quote__text {
  margin: 0;
  max-width: var(--content-max-width);
  font-family: var(--font-heading);
  font-size: 32px;
  line-height: 1.3;

  @media (max-width: $breakpoint-mobile) {
    font-size: 24px;
  }
}

.v-block-quote__author {
  font-size: 16px;
  font-weight: 700;
}
</style>
