<template>
  <figure
    v-if="images.length"
    class="v-block-image u-flex u-flex--column u-gap-s"
    :class="isCover ? 'v-block-image--cover' : 'u-block'"
  >
    <div class="v-block-image__media">
      <UiCarousel v-if="images.length > 1" :images="images" :variant="isCover ? 'cover' : 'row'" :label="block.content.caption || t('Photos')" />
      <UiImage v-else :file="images[0]!" :cover="isCover" class="v-block-image__single" />
    </div>
    <figcaption v-if="block.content.caption" class="v-block-image__caption" :class="{ 'u-gutter-x': isCover }">
      {{ block.content.caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { ImageContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

/**
 * "Couverture" on: full width — one photo, or a carousel with dots.
 * Off: in the ¾ column — one photo, or a row carousel with arrows (Locaux).
 */
const props = defineProps<{
  block: KqlBlock<ImageContent>
  files?: KqlFile[]
}>()

const images = computed(() => resolveKqlFiles(props.block.content.images, props.files))
const isCover = computed(() => isKirbyTrue(props.block.content.is_cover))
</script>

<style lang="scss" scoped>
.v-block-image {
  margin: 0;
  container-type: inline-size;
}

.v-block-image--cover {
  padding-block: var(--block-spacing);
}

// Right under a title bar, the visual sticks to it (home: « L’École »,
// « Formations »…). Whole selector in :global(): `:global(.a) .b` compiles to `.a`.
:global(.v-block-heading + .v-block-image--cover) {
  padding-top: 0;
}

// Followed by a colored band (home accroche), the two touch.
:global(.v-block-image--cover:has(+ .v-block-quote--filled)) {
  padding-bottom: 0;
}

// Opening a page (home carousel), it sits right under the navigation and
// fills the rest of the first screen: its bottom edge falls on the fold.
:global(.v-page-default > .v-blocks > .v-block-image--cover:first-child) {
  --opening-height: calc(100svh - var(--navigation-menu-height));

  padding-top: 0;
}

:global(.v-page-default > .v-blocks > .v-block-image--cover:first-child .ui-carousel__slide),
:global(.v-page-default > .v-blocks > .v-block-image--cover:first-child .v-block-image__single) {
  aspect-ratio: auto;
  height: var(--opening-height);
}

// Same ¼ / ¾ grid as the Paragraph block.
.v-block-image:not(.v-block-image--cover) .v-block-image__media,
.v-block-image:not(.v-block-image--cover) .v-block-image__caption {
  @container (min-width: 900px) {
    margin-left: calc(25% + var(--spacing-xl) * 0.75);
  }
}

.v-block-image__caption {
  font-size: 14px;
}
</style>
