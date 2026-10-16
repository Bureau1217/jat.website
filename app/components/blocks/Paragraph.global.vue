<template>
  <div
    class="v-block-paragraph u-block u-flex u-gap-2xl"
    :class="{ 'v-block-paragraph--highlighted': isHighlighted, 'v-block-paragraph--with-image': image }"
  >
    <div class="v-block-paragraph__text u-flex u-flex--column u-gap-m">
      <h2 v-if="block.content.heading" class="v-block-paragraph__heading">{{ block.content.heading }}</h2>
      <UiRichText :html="block.content.text" />
    </div>
    <UiImage v-if="image" :file="image" class="v-block-paragraph__image" />
  </div>
</template>

<script setup lang="ts">
import type { ParagraphContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<ParagraphContent>
  files?: KqlFile[]
}>()

const isHighlighted = computed(() => isKirbyTrue(props.block.content.is_highlighted))
const image = computed(() => resolveKqlFile(props.block.content.image, props.files))
</script>

<style lang="scss" scoped>
.v-block-paragraph {
  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
  }
}

.v-block-paragraph__text {
  flex: 1;
  min-width: 0;
}

.v-block-paragraph__image {
  flex: 1;
  min-width: 0;
  border-radius: var(--radius-m);
}

// "Mise en avant": larger text, set apart from running text.
.v-block-paragraph--highlighted .v-block-paragraph__text {
  :deep(p) {
    font-size: 26px;
    font-weight: 600;
  }
}
</style>
