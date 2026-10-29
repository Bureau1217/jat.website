<template>
  <section class="ui-aside-box u-flex u-flex--column u-gap-2xl">
    <h3 v-if="title" class="ui-aside-box__title">{{ title }}</h3>
    <slot />
  </section>
</template>

<script setup lang="ts">
/**
 * Shell of a "Contenus liés" box (Accordion "3 colonnes", event page): a small
 * title underlined by a rule, then its own content.
 */
withDefaults(defineProps<{
  title?: string
}>(), {
  title: undefined
})
</script>

<style lang="scss" scoped>
.ui-aside-box__title {
  @include t-small-bold;
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid currentColor;
}
</style>
