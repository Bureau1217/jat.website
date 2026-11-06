<template>
  <!-- Page level: title on the first column, text on the three others. -->
  <div v-if="!isNested" class="v-block-paragraph u-block" :class="variantClass">
    <UiTwoColumns :wide="isHighlighted && !block.content.heading">
      <template v-if="block.content.heading" #aside>
        <h2 :id="block.id" class="v-block-paragraph__heading">{{ block.content.heading }}</h2>
      </template>
      <div class="u-flex u-flex--column u-gap-2xl">
        <UiRichText v-if="block.content.text" :html="block.content.text" class="v-block-paragraph__text" />
        <!-- « 3 colonnes »: one grid column each, aligned on the page grid. -->
        <div v-if="columns.length" class="v-block-paragraph__columns">
          <div v-for="(column, index) in columns" :key="index" class="u-flex u-flex--column u-gap-xs">
            <h3 v-if="column.column_title" class="v-block-paragraph__column-title">{{ column.column_title }}</h3>
            <UiRichText v-if="column.column_text" :html="column.column_text" class="v-block-paragraph__column-text" />
          </div>
        </div>
        <UiImage v-if="image" :file="image" sizes="(max-width: 900px) 100vw, 70vw" class="v-block-paragraph__image" />
      </div>
    </UiTwoColumns>
  </div>

  <!-- Inside an accordion / column: title above the text. -->
  <div v-else class="v-block-paragraph v-block-paragraph--nested u-flex u-flex--column u-gap-xs" :class="variantClass">
    <h3 v-if="block.content.heading" :id="block.id" class="v-block-paragraph__heading">{{ block.content.heading }}</h3>
    <UiRichText v-if="block.content.text" :html="block.content.text" class="v-block-paragraph__text" />
    <div v-for="(column, index) in columns" :key="index" class="u-flex u-flex--column u-gap-xs">
      <h4 v-if="column.column_title" class="v-block-paragraph__column-title">{{ column.column_title }}</h4>
      <UiRichText v-if="column.column_text" :html="column.column_text" class="v-block-paragraph__column-text" />
    </div>
    <UiImage v-if="image" :file="image" sizes="(max-width: 900px) 100vw, 45vw" class="v-block-paragraph__image" />
  </div>
</template>

<script setup lang="ts">
import type { ParagraphColumn, ParagraphContent } from '~~/shared/types/blocks'
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
const isColumns = computed(() => props.block.content.layout === 'columns')
const isHighlighted = computed(() => !isColumns.value && isKirbyTrue(props.block.content.is_highlighted))
const columns = computed<ParagraphColumn[]>(() => isColumns.value ? (props.block.content.columns ?? []) : [])
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

// 3 columns of the page grid inside the ¾, one column when narrow. Same
// type as the paragraph's own text (lead; title in its bold, B1 bold), and
// running text inside an accordion / column.
.v-block-paragraph__columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-stack) var(--grid-gap);

  @include container-wide {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.v-block-paragraph__column-title {
  @include t-lead-bold;
}

.v-block-paragraph__column-text {
  @include t-lead;
}

.v-block-paragraph--nested {
  .v-block-paragraph__column-title {
    @include t-label;
  }

  .v-block-paragraph__column-text {
    @include t-p;
  }
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
