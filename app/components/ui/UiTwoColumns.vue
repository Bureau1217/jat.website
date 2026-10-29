<template>
  <div class="ui-two-columns">
    <div class="ui-two-columns__grid">
      <div v-if="$slots.aside" class="ui-two-columns__aside">
        <slot name="aside" />
      </div>
      <div class="ui-two-columns__main" :class="{ 'ui-two-columns__main--wide': wide }">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ¼ + ¾ layout of the mockup: a title on the first column, the content on
 * the three others (texts, lists, team…). `wide` lets the content take the
 * whole width (exergue). Lays out from its own width (container query):
 * one column when narrow.
 */
withDefaults(defineProps<{
  wide?: boolean
}>(), {
  wide: false
})
</script>

<style lang="scss" scoped>
.ui-two-columns {
  container-type: inline-size;
}

.ui-two-columns__grid {
  @include grid-columns;
}

.ui-two-columns__main {
  min-width: 0;

  @include container-wide {
    grid-column: 2 / span 3;
  }
}

.ui-two-columns__main--wide {
  @include container-wide {
    grid-column: 1 / -1;
  }
}
</style>
