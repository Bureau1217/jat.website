<template>
  <UiAgenda :show-past="showPast" />
</template>

<script setup lang="ts">
import type { NewsContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/** Agenda section — its only field: "Afficher les événements passés". */
const props = defineProps<{
  block: KqlBlock<NewsContent>
}>()

// Blocks saved before the toggle existed have no value: shown, as its default.
const showPast = computed(() => {
  const value = props.block.content.show_past
  return value === undefined || value === '' || isKirbyTrue(value)
})
</script>
