<template>
  <div class="ui-rich-text" v-html="formatted" />
</template>

<script setup lang="ts">
/**
 * HTML of a Kirby writer field (paragraphs, line breaks, lists, bold,
 * italic, links). Spacing follows the mockup and is in em, so it scales
 * with whatever text style the parent sets:
 * - Enter (new paragraph) → a small gap (4px at 20px, as in the mockup);
 * - Shift + Enter (<br>) → plain line break, no gap;
 * - an empty paragraph (Enter twice) → one extra blank line, as the
 *   designers do in Figma (Kirby keeps it as an empty <p>);
 * - a paragraph that is only bold (« Inclusivité », « Charte d’engagement… »)
 *   acts as a sub-title: more space above, tight to the text below.
 */
const props = defineProps<{
  html: string
}>()

const formatted = computed(() => frenchSpacing(props.html))
</script>

<style lang="scss" scoped>
.ui-rich-text {
  overflow-wrap: break-word;
  text-wrap: pretty;

  // Mockup: 4px between paragraphs of 20px text — the designers add an
  // empty paragraph (one blank line, below) where they want more air; a
  // bold-only line (sub-title) gets space above and 8px under it.
  :deep(> * + *) {
    margin-top: 0.2em;
  }

  :deep(> p:has(> strong:only-child):not(:first-child)) {
    margin-top: 1.5em;
  }

  :deep(> p:has(> strong:only-child) + *) {
    margin-top: 0.4em;
  }

  // Empty paragraph = one blank line.
  :deep(> p:empty) {
    min-height: 1lh;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.2em;
  }

  :deep(ul) {
    list-style: disc;
  }

  :deep(ol) {
    list-style: decimal;
  }

  :deep(li + li) {
    margin-top: 0.2em;
  }

  // Kirby wraps each list item in a <p>: no paragraph spacing inside.
  :deep(li > p) {
    margin: 0;
  }
}
</style>
