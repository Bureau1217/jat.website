<template>
  <header
    class="ui-page-hero u-gutter-x u-flex u-flex--column u-flex--align-center u-flex--justify-center u-gap-3xl"
    :style="fill ? { background: fill.background, color: fill.color } : undefined"
  >
    <h1 class="ui-page-hero__title">{{ title }}</h1>
    <p v-if="signature" class="ui-page-hero__signature">{{ signature }}</p>
  </header>
</template>

<script setup lang="ts">
import type { KqlFillValue } from '~~/shared/types/kql'

/** Page banner: large title, optional italic signature, fill (page theme by default). */
const props = defineProps<{
  title: string
  signature?: string | null
  fillValue?: KqlFillValue | null
}>()

const fill = computed(() => props.fillValue ? resolveFill(props.fillValue.fill, props.fillValue.reverse) : null)
</script>

<style lang="scss" scoped>
// "Hero de page" of the mockup: the section's gradient unless the page picks one.
.ui-page-hero {
  // The first screen, under the navigation (and the Repères bar if any).
  min-height: calc(100svh - var(--navigation-menu-height) - var(--opening-offset, 0px));
  padding-block: var(--spacing-6xl);
  background: var(--theme-gradient);
  color: var(--theme-text);
  text-align: center;

  @media (max-width: $breakpoint-mobile) {
    min-height: 360px;
  }
}

.ui-page-hero__title {
  font-size: 200px;
  line-height: 0.8;
  text-transform: uppercase;
  overflow-wrap: anywhere;

  @media (max-width: $breakpoint-mobile) {
    font-size: 64px;
  }
}

.ui-page-hero__signature {
  font-family: var(--font-accent);
  font-style: italic;
  font-size: 112px;
  line-height: 1.28;

  @media (max-width: $breakpoint-mobile) {
    font-size: 40px;
  }
}
</style>
