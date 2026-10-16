<template>
  <div v-if="block.content.address" class="v-block-map u-block">
    <UiMap :address="block.content.address" />
  </div>
</template>

<script setup lang="ts">
import type { MapContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock<MapContent>
}>()
</script>
