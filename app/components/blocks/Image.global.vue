<template>
  <figure
    v-if="images.length"
    class="v-block-image u-flex u-flex--column u-gap-s"
    :class="isCover ? 'v-block-image--cover' : 'u-block'"
  >
    <UiGallery v-if="images.length > 1" :images="images" />
    <UiImage v-else :file="images[0]!" class="v-block-image__single" />
    <figcaption v-if="block.content.caption" class="v-block-image__caption" :class="{ 'u-gutter-x': isCover }">
      {{ block.content.caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { ImageContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

/** One photo → single image (full-bleed with "Couverture"), several → gallery. */
const props = defineProps<{
  block: KqlBlock<ImageContent>
  files?: KqlFile[]
}>()

const images = computed(() => resolveKqlFiles(props.block.content.images, props.files))
const isCover = computed(() => images.value.length === 1 && isKirbyTrue(props.block.content.is_cover))
</script>

<style lang="scss" scoped>
.v-block-image {
  margin: 0;
}

.v-block-image--cover {
  padding-block: var(--block-spacing);
}

.v-block-image:not(.v-block-image--cover) .v-block-image__single {
  border-radius: var(--radius-m);
}

.v-block-image__caption {
  font-size: 14px;
}
</style>
