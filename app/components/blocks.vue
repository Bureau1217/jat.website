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
 * components/blocks/<PascalType>.global.vue ("columns-2" → BlocksColumns2).
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
