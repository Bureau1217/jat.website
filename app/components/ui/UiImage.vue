<template>
  <img
    class="ui-image"
    :class="{ 'ui-image--cover': cover }"
    :src="file.url"
    :alt="file.alt ?? ''"
    :width="file.width ?? undefined"
    :height="file.height ?? undefined"
    :style="cover ? { objectPosition: objectPosition(file) } : undefined"
    loading="lazy"
  >
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/**
 * A Kirby image with its alt text and intrinsic size (no layout shift).
 * `cover` fills its container (object-fit: cover) around the Panel's focal point.
 */
withDefaults(defineProps<{
  file: KqlFile
  cover?: boolean
}>(), {
  cover: false
})
</script>

<style lang="scss" scoped>
.ui-image {
  width: 100%;
  height: auto;
}

.ui-image--cover {
  height: 100%;
  object-fit: cover;
}
</style>
