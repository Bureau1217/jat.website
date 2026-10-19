<template>
  <UiAsideGallery :images="images" />
</template>

<script setup lang="ts">
import type { GalleryContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

/** "Contenus liés" box of an Accordion "3 colonnes" sub-section. */
const props = defineProps<{
  block: KqlBlock<GalleryContent>
  files?: KqlFile[]
}>()

const images = computed(() => resolveKqlFiles(props.block.content.images, props.files))
</script>
