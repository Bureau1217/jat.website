<template>
  <UiKeyInfo v-if="items.length" :items="items" class="u-block" />
</template>

<script setup lang="ts">
import type { KeyInfoContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/** Left column of an Accordion "3 colonnes" sub-section (fiches formation / concert). */
const props = defineProps<{
  block: KqlBlock<KeyInfoContent>
}>()

const items = computed(() => (props.block.content.items ?? [])
  .filter(item => item.label && item.text)
  .map(item => ({ label: item.label, html: item.text })))
</script>
