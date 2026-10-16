<template>
  <section class="ui-aside-box u-flex u-flex--column u-gap-m">
    <h3 v-if="title" class="ui-aside-box__title">{{ title }}</h3>
    <slot />
  </section>
</template>

<script setup lang="ts">
/**
 * Shell of a "Contenus liés" box (columns-3 block, event page): a small
 * title over its own content, separated from the next box by a rule.
 */
withDefaults(defineProps<{
  title?: string
}>(), {
  title: undefined
})
</script>

<style lang="scss" scoped>
.ui-aside-box {
  padding-block: var(--spacing-xl);
  border-top: 2px solid currentColor;
}

// Small label, set in the body font rather than the heading one.
.ui-aside-box__title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
