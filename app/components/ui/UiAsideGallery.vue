<template>
  <UiAsideBox v-if="images.length" title="Galerie photos">
    <UiGallery :images="images" layout="stack" />
  </UiAsideBox>
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/** "Galerie photos" box — Gallery block (Accordion "3 colonnes") and event page. */
defineProps<{
  images: KqlFile[]
}>()
</script>
