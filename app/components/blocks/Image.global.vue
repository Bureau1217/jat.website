<template>
  <figure v-if="images.length" class="v-block-image u-flex u-flex--column u-gap-s" :class="`v-block-image--${mode}`">
    <!-- Couverture, 1 photo: full-bleed image. -->
    <UiImage v-if="mode === 'cover'" :file="images[0]!" sizes="100vw" class="v-block-image__cover" />
    <!-- Couverture, several: full-bleed carousel with dots. -->
    <UiCarousel v-else-if="mode === 'carousel'" :images="images" variant="full" />
    <!-- No couverture: photos on the grid (3 per view), or a single one. -->
    <UiTwoColumns v-else>
      <UiCarousel v-if="images.length > 1" :images="images" variant="inline" />
      <div v-else class="v-block-image__single-wrap">
        <div class="v-block-image__single u-flex u-flex--column u-gap-xs">
          <UiImage :file="images[0]!" cover sizes="(max-width: 900px) 100vw, 25vw" class="v-block-image__single-media" />
          <span v-if="images[0]!.caption" class="v-block-image__caption">{{ images[0]!.caption }}</span>
        </div>
      </div>
    </UiTwoColumns>
    <figcaption v-if="block.content.caption" class="v-block-image__caption" :class="{ 'u-gutter-x': mode !== 'grid' }">
      {{ block.content.caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { ImageContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

/**
 * « Couverture » on: full width — one photo, or a carousel with dots.
 * Off: on the grid — several photos side by side (arrows past 3), or a
 * single photo the width of one column. Photo captions come from each
 * file, the block caption sits under the whole block.
 */
const props = defineProps<{
  block: KqlBlock<ImageContent>
  files?: KqlFile[]
}>()

const images = computed(() => resolveKqlFiles(props.block.content.images, props.files))
const isCover = computed(() => isKirbyTrue(props.block.content.is_cover))
const mode = computed((): 'cover' | 'carousel' | 'grid' => {
  if (!isCover.value) return 'grid'
  return images.value.length > 1 ? 'carousel' : 'cover'
})
</script>

<style lang="scss" scoped>
.v-block-image--grid {
  padding-block: var(--block-spacing);
  padding-inline: var(--gutter);

  :deep(.ui-two-columns__main) {
    min-width: 0;
  }
}

.v-block-image__cover {
  width: 100%;
}

// One photo, one column wide (mockup: a locaux photo on its own) — from
// the width of the column it sits in (container query).
.v-block-image__single-wrap {
  container-type: inline-size;
}

.v-block-image__single {
  @include container-wide {
    width: calc((100% - 2 * var(--grid-gap)) / 3);
  }
}

.v-block-image__single-media {
  aspect-ratio: 293 / 195;
}

.v-block-image__caption {
  @include t-small;
}
</style>
