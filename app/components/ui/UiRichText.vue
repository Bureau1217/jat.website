<template>
  <div class="ui-rich-text" :class="{ 'ui-rich-text--wide': wide }" v-html="formatted" />
</template>

<script setup lang="ts">
/**
 * HTML of a Kirby writer field (paragraphs, lists, bold, italic, links),
 * with the list markers the global reset strips (typo.scss) restored and
 * French punctuation spacing in French, and no widow or orphan (noWidows).
 */
const props = defineProps<{
  html: string
  /** Spans its whole column instead of the reading max width. */
  wide?: boolean
}>()

const locale = useLocale()
const formatted = computed(() => noWidows(locale.value === 'fr' ? frenchSpacing(props.html) : props.html))
</script>

<style lang="scss" scoped>
.ui-rich-text {
  max-width: var(--content-max-width);
  // Last resort: words held by no-break spaces (utils/noWidows.ts) or a long
  // URL break inside the column rather than widen the page on a phone.
  overflow-wrap: break-word;

  :deep(p),
  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--spacing-m);
  }

  :deep(ul),
  :deep(ol) {
    padding-left: var(--spacing-xl);
    font-size: 18px;
    line-height: 1.5;
  }

  :deep(ul) {
    list-style: disc;
  }

  :deep(ol) {
    list-style: decimal;
  }

  :deep(li) {
    margin-bottom: var(--spacing-xs);
  }

  :deep(a) {
    text-decoration: underline;
  }

  :deep(> :last-child) {
    margin-bottom: 0;
  }
}

.ui-rich-text--wide {
  max-width: none;
}
</style>
