<template>
  <div class="ui-gallery" :class="`ui-gallery--${layout}`">
    <figure v-for="image in images" :key="image.uuid" class="ui-gallery__item">
      <UiImage :file="image" cover />
    </figure>
  </div>
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/**
 * Several photos — shared by the Image block (when it holds more than one
 * photo) and the "Galerie photos" related-content box. `grid` lays them out
 * in columns, `stack` one under the other (narrow "Contenus liés" column).
 */
withDefaults(defineProps<{
  images: KqlFile[]
  layout?: 'grid' | 'stack'
}>(), {
  layout: 'grid'
})
</script>

<style lang="scss" scoped>
.ui-gallery {
  display: grid;
  gap: var(--spacing-m);
}

.ui-gallery--grid {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.ui-gallery__item {
  margin: 0;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-m);
  overflow: hidden;
}
</style>
