<template>
  <UiAsideBox title="Témoignage">
    <figure class="v-block-testimonial u-flex u-flex--column u-gap-s">
      <blockquote class="v-block-testimonial__text">
        <UiRichText :html="block.content.text" />
      </blockquote>
      <figcaption v-if="block.content.author" class="v-block-testimonial__author">{{ block.content.author }}</figcaption>
    </figure>
  </UiAsideBox>
</template>

<script setup lang="ts">
import type { TestimonialContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/** "Contenus liés" box of the columns-3 block. */
defineProps<{
  block: KqlBlock<TestimonialContent>
}>()
</script>

<style lang="scss" scoped>
.v-block-testimonial {
  margin: 0;
}

.v-block-testimonial__text {
  margin: 0;
  font-style: italic;
}

.v-block-testimonial__author {
  font-size: 16px;
  font-weight: 700;
}
</style>
