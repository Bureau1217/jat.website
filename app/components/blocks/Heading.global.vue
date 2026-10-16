<template>
  <div class="v-block-heading u-block">
    <component :is="level" :id="block.id" class="v-block-heading__title">{{ block.content.text }}</component>
  </div>
</template>

<script setup lang="ts">
import type { HeadingContent, HeadingLevel } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

const LEVELS: HeadingLevel[] = ['h1', 'h2', 'h3', 'h4']

const props = defineProps<{
  block: KqlBlock<HeadingContent>
}>()

// The block id doubles as the anchor targeted by the columns-3 "Sommaire".
const level = computed(() => LEVELS.find(tag => tag === props.block.content.level) ?? 'h2')
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
