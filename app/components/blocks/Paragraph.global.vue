<template>
  <!-- Page level: title on the first column, text on the three others. -->
  <div v-if="!isNested" class="v-block-paragraph u-block" :class="variantClass">
    <UiTwoColumns :wide="isHighlighted && !block.content.heading">
      <template v-if="block.content.heading" #aside>
        <h2 :id="block.id" class="v-block-paragraph__heading">{{ block.content.heading }}</h2>
      </template>
      <div class="u-flex u-flex--column u-gap-2xl">
        <UiRichText :html="block.content.text" class="v-block-paragraph__text" />
        <UiImage v-if="image" :file="image" sizes="(max-width: 900px) 100vw, 70vw" class="v-block-paragraph__image" />
      </div>
    </UiTwoColumns>
  </div>

  <!-- Inside an accordion / column: title above the text. -->
  <div v-else class="v-block-paragraph v-block-paragraph--nested u-flex u-flex--column u-gap-xs" :class="variantClass">
    <h3 v-if="block.content.heading" :id="block.id" class="v-block-paragraph__heading">{{ block.content.heading }}</h3>
    <UiRichText :html="block.content.text" class="v-block-paragraph__text" />
    <UiImage v-if="image" :file="image" sizes="(max-width: 900px) 100vw, 45vw" class="v-block-paragraph__image" />
  </div>
</template>

<script setup lang="ts">
import type { ParagraphContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

/**
 * Text sizes (mockup): page level → chapô (lead), « Mise en avant » →
 * exergue; inside an accordion / column → running text, « Mise en avant »
 * → chapô. The title is an anchor of the "3 colonnes" Sommaire.
 */
const props = defineProps<{
  block: KqlBlock<ParagraphContent>
  files?: KqlFile[]
}>()

const isNested = useIsNested()
const isHighlighted = computed(() => isKirbyTrue(props.block.content.is_highlighted))
const image = computed(() => resolveKqlFile(props.block.content.image, props.files))
const variantClass = computed(() => ({ 'v-block-paragraph--highlighted': isHighlighted.value }))
</script>

<style lang="scss" scoped>
.v-block-paragraph__heading {
  @include t-h3;
  scroll-margin-top: calc(var(--navigation-menu-height) + var(--anchors-height) + var(--spacing-xl));
}

.v-block-paragraph__text {
  @include t-lead;
}

.v-block-paragraph--highlighted .v-block-paragraph__text {
  @include t-exergue;
}

.v-block-paragraph--nested {
  .v-block-paragraph__heading {
    @include t-label;
  }

  .v-block-paragraph__text {
    @include t-p;
  }

  &.v-block-paragraph--highlighted .v-block-paragraph__text {
    @include t-lead;
  }
}
</style>
