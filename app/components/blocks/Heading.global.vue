<template>
  <div class="v-block-heading u-block">
    <h2 :id="block.id" class="v-block-heading__title">{{ block.content.text }}</h2>
  </div>
</template>

<script setup lang="ts">
import type { HeadingContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

// Always an h2: editors no longer pick the level (the page title is the h1).
// The block id doubles as the anchor targeted by the "3 colonnes" Sommaire.
defineProps<{
  block: KqlBlock<HeadingContent>
}>()
</script>

<style lang="scss" scoped>
// Only the top of a title gets the block rhythm — it belongs to the content
// right below it.
.v-block-heading {
  padding-bottom: 0;
}

.v-block-heading__title {
  max-width: var(--content-max-width);
  scroll-margin-top: var(--spacing-5xl);
}
</style>
