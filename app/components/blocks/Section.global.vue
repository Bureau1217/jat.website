<template>
  <section :id="block.id" class="v-block-section" :style="barStyle">
    <div
      v-if="showHero"
      class="v-block-section__hero u-gutter-x u-flex u-flex--align-center u-flex--justify-center"
      :style="heroStyle"
    >
      <h2 class="v-block-section__hero-title">{{ block.content.heading }}</h2>
    </div>
    <Blocks :blocks="body" :files="files" :pages="pages" />
  </section>
</template>

<script setup lang="ts">
import type { SectionContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/**
 * Groups blocks; its name labels the anchors bar. « Afficher en bandeau »
 * also opens the section with its name on a hero fill (mockup: « Les
 * équipes », « Formations professionnalisantes »), the page theme's hero
 * fill unless the section picks a named one.
 */
const props = defineProps<{
  block: KqlBlock<SectionContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const body = computed(() => parseKqlBlocks(props.block.content.body))
const showHero = computed(() => isKirbyTrue(props.block.content.show_hero) && Boolean(props.block.content.heading?.trim()))
const heroStyle = computed(() => fillStyle(props.block.content.fill, props.block.content.fill_reverse, 'hero'))
// « Fond des barres »: every title bar and accordion bar of the section.
const barStyle = computed(() => fillStyle(props.block.content.bar_fill, props.block.content.bar_fill_reverse, 'bar'))
</script>

<style lang="scss" scoped>
// Target of the Anchors bar: land below the sticky nav + anchors bars.
.v-block-section {
  scroll-margin-top: calc(var(--navigation-menu-height) + var(--anchors-height));
}

// Mockup: 500px hero of a rubrique.
.v-block-section__hero {
  min-height: fluid(240px, 500px);
  @include fill-background(hero);
  text-align: center;
}

.v-block-section__hero-title {
  @include t-h1;
}

// Mockup: 184px between the hero and the first text, and after the last
// text of the section (before the next hero or title bar).
.v-block-section__hero + :deep(.v-blocks > .u-block:first-child) {
  padding-top: var(--space-section);
}

.v-block-section > :deep(.v-blocks > .u-block:last-child) {
  padding-bottom: var(--space-section);
}
</style>
