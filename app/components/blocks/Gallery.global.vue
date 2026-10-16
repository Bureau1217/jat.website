<template>
  <UiAsideBox v-if="images.length" title="Galerie photos">
    <UiGallery :images="images" layout="stack" />
  </UiAsideBox>
</template>

<script setup lang="ts">
import type { GalleryContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

/** "Contenus liés" box (columns-3 block, event page). */
const props = defineProps<{
  block: KqlBlock<GalleryContent>
  files?: KqlFile[]
}>()

const images = computed(() => resolveKqlFiles(props.block.content.images, props.files))
</script>
