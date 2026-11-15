<template>
  <div
    class="v-block-paragraph u-block"
    :class="[`v-block-paragraph--${textStyle}`, { 'v-block-paragraph--with-image': image }]"
  >
    <div class="v-block-paragraph__layout">
      <h2 v-if="block.content.heading" class="v-block-paragraph__heading">{{ block.content.heading }}</h2>
      <div class="v-block-paragraph__content u-flex u-gap-2xl">
        <UiRichText :html="block.content.text" wide class="v-block-paragraph__text" />
        <UiImage v-if="image" :file="image" class="v-block-paragraph__image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParagraphContent, ParagraphTextStyle } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<ParagraphContent>
  files?: KqlFile[]
}>()

// Blocks saved before `text_style` existed only carry the old
// "Mise en avant" toggle, which was the exergue.
const textStyle = computed<ParagraphTextStyle>(() => {
  const { text_style: style, is_highlighted: highlighted } = props.block.content
  if (style) return style
  return isKirbyTrue(highlighted) ? 'highlight' : 'normal'
})

const image = computed(() => resolveKqlFile(props.block.content.image, props.files))
</script>

<style lang="scss" scoped>
// The ¼ title / ¾ text split only makes sense on a wide column: inside the
// middle column of an Accordion "3 colonnes", the block stays stacked.
.v-block-paragraph {
  container-type: inline-size;
}

.v-block-paragraph__layout {
  display: grid;
  gap: var(--spacing-m);

  @container (min-width: 900px) {
    grid-template-columns: 1fr 3fr;
    column-gap: var(--spacing-xl);
  }
}

.v-block-paragraph__heading {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 40px;
  line-height: 1.12;
  letter-spacing: -0.02em;

  @media (max-width: $breakpoint-mobile) {
    font-size: 28px;
  }

  // Narrow column (middle of a fiche 3 colonnes): a bold subtitle.
  @container (max-width: 899px) {
    font-size: 22px;
    line-height: 1.24;
    letter-spacing: 0;
  }
}

// Without a heading the text still sits in the ¾ column — except an
// exergue, which spans the full width (home page, under « L'École »).
.v-block-paragraph__content {
  min-width: 0;

  @container (min-width: 900px) {
    grid-column: 2;

    // First child = no heading before it.
    .v-block-paragraph--highlight &:first-child {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
  }
}

.v-block-paragraph__text,
.v-block-paragraph__image {
  flex: 1;
  min-width: 0;
}

.v-block-paragraph__image {
  border-radius: var(--radius-m);
}

// Writer HTML: v-html content, hence :deep().
.v-block-paragraph--normal .v-block-paragraph__text {
  :deep(p),
  :deep(ul),
  :deep(ol) {
    font-size: 20px;
    line-height: 1.24;

    @media (max-width: $breakpoint-mobile) {
      font-size: 18px;
    }
  }

  // A paragraph holding only bold text acts as a subtitle (Valeurs, Charte):
  // tight to its own text, well apart from the previous group.
  :deep(p:has(> strong:only-child)) {
    margin-bottom: var(--spacing-xs);
  }

  :deep(* + p:has(> strong:only-child)) {
    margin-top: var(--spacing-xl);
  }
}

.v-block-paragraph--lead .v-block-paragraph__text :deep(p) {
  font-size: 26px;
  line-height: 1.24;

  @media (max-width: $breakpoint-mobile) {
    font-size: 22px;
  }
}

.v-block-paragraph--highlight .v-block-paragraph__text :deep(p) {
  font-size: 40px;
  line-height: 1.2;

  @media (max-width: $breakpoint-mobile) {
    font-size: 28px;
  }
}

.v-block-paragraph--lead,
.v-block-paragraph--highlight {
  .v-block-paragraph__text :deep(em) {
    font-family: var(--font-accent);
    color: var(--color-emphasis);
  }
}
</style>
