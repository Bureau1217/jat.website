<template>
  <UiTitleBar v-if="block.content.text" :text="block.content.text" :anchor="block.id" />
</template>

<script setup lang="ts">
import type { HeadingContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

// The Titre block is no longer offered in jat.cms (a section shows its own
// name: Section.global.vue). Kept to render the ones still in the content.
defineProps<{
  block: KqlBlock<HeadingContent>
}>()
</script>
