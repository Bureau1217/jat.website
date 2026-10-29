<template>
  <div class="v-blocks">
    <component
      :is="blockComponentName(block.type)"
      v-for="block in visibleBlocks"
      :key="block.id"
      :block="block"
      :files="files"
      :pages="pages"
    />
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/**
 * Renders a list of Kirby blocks: each block type maps to
 * components/blocks/<PascalType>.global.vue ("related-events" → BlocksRelatedEvents).
 * Global registration lets the name be resolved from a string at runtime.
 * `files` and `pages` are passed down unchanged so nested blocks can
 * resolve their own file:// and page:// refs.
 */
const props = defineProps<{
  blocks?: KqlBlock[]
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const visibleBlocks = computed(() => (props.blocks ?? []).filter(block => !block.isHidden))

function blockComponentName(type: string): string {
  const pascal = type
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  return `Blocks${pascal}`
}
</script>

<style lang="scss" scoped>
// The wrapper adds no box: the blocks are laid out by the container that
// renders them (flex column + gap in a column, an accordion, the aside…).
.v-blocks {
  display: contents;
}

// Vertical rhythm of the mockup between page-level blocks (each block keeps
// its own --block-spacing padding; these only adjust the special cases).
// Nested blocks (accordion, columns) have no title bar / cover photo, so
// they're not affected.
.v-blocks {
  // Text right under a title bar or a full-width photo: 86px.
  > :deep(:is(.v-block-heading, .v-block-image--cover, .v-block-image--carousel) + .u-block) {
    padding-top: calc(2 * var(--block-spacing));
  }

  // Before the next title bar: a section's worth of space (~184px).
  > :deep(.u-block:has(+ .v-block-heading)) {
    padding-bottom: var(--space-section);
  }
}
</style>
