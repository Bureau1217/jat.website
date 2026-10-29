<template>
  <img
    class="ui-image"
    :class="{ 'ui-image--cover': cover }"
    v-bind="imageAttrs(file, sizes, { eager })"
    :alt="file.alt ?? ''"
    :style="cover ? { objectPosition: objectPosition(file) } : undefined"
  >
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/**
 * A Kirby image with its alt text, intrinsic size (no layout shift) and a
 * srcset of the sizes Kirby generated (see app/utils/imageAttrs.ts).
 * `sizes`: rendered width of the image (e.g. "100vw", "(max-width: 900px)
 * 100vw, 25vw") so the browser downloads the right version.
 * `eager`: the image is at the top of the page (hero, cover) — no lazy load.
 * `cover` fills its container (object-fit: cover) around the Panel's focal point.
 */
withDefaults(defineProps<{
  file: KqlFile
  cover?: boolean
  sizes?: string
  eager?: boolean
}>(), {
  cover: false,
  sizes: '100vw',
  eager: false
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
