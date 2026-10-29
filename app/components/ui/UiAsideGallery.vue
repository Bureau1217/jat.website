<template>
  <UiAsideBox v-if="images.length" title="Photos">
    <UiCarousel :images="images" variant="aside" />
  </UiAsideBox>
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/** "Photos" box — Gallery block (Accordion "3 colonnes") and event page. Several photos: mini carousel. */
defineProps<{
  images: KqlFile[]
}>()
</script>
