<template>
  <div class="ui-gallery">
    <figure v-for="image in images" :key="image.uuid" class="ui-gallery__item">
      <UiImage :file="image" cover />
    </figure>
  </div>
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/**
 * Photos one under the other — the narrow "Galerie photos" box (Accordion
 * "3 colonnes", event and article pages). Wide rows use UiCarousel.
 */
defineProps<{
  images: KqlFile[]
}>()
</script>

<style lang="scss" scoped>
.ui-gallery {
  display: grid;
  gap: var(--spacing-m);
}

.ui-gallery__item {
  margin: 0;
  // Square corners, as every photo of the mockup.
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
</style>
