<template>
  <Anchors :blocks="page.blocks" />
  <article class="v-page-default">
    <header v-if="!isHome" class="v-page-default__hero u-gutter-x u-flex u-flex--align-center u-flex--justify-center">
      <h1 class="v-page-default__title">{{ page.title }}</h1>
    </header>
    <Blocks :blocks="page.blocks" :files="page.files" :pages="page.pages" />
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/** Site page (jat.cms `default` template): hero with the title (except on the home page) + blocks of the `body` field. */
const props = defineProps<{
  page: KqlPage
}>()

// The home page opens straight on its photo carousel (mockup: no title hero).
const isHome = computed(() => props.page.id === 'home')
</script>

<style lang="scss" scoped>
// Space before the footer after the last text block.
.v-page-default > :deep(.v-blocks > .u-block:last-child) {
  padding-bottom: var(--space-section);
}

// Mockup: 711px hero, page title in Animo display on the page hero fill.
.v-page-default__hero {
  min-height: fluid(280px, 711px);
  @include fill-background(hero);
  text-align: center;
}

.v-page-default__title {
  @include t-display;
}
</style>
