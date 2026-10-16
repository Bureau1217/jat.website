<template>
  <div class="ui-rich-text" v-html="html" />
</template>

<script setup lang="ts">
/**
 * HTML of a Kirby writer field (paragraphs, lists, bold, italic, links),
 * with the list markers the global reset strips (typo.scss) restored.
 */
defineProps<{
  html: string
}>()
</script>

<style lang="scss" scoped>
.ui-rich-text {
  max-width: var(--content-max-width);

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
</style>
