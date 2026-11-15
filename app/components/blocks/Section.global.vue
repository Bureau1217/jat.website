<template>
  <section :id="block.id" class="v-block-section" :style="barVariables">
    <div v-if="hasHero" class="v-block-section__hero u-gutter-x u-flex u-flex--align-center u-flex--justify-center" :style="heroVariables">
      <h2 class="v-block-section__hero-title">{{ block.content.heading }}</h2>
    </div>
    <Blocks :blocks="body" :files="files" :pages="pages" />
  </section>
</template>

<script setup lang="ts">
import type { SectionContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<SectionContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const body = computed(() => parseKqlBlocks(props.block.content.body))

// A banner needs a name to show.
const hasHero = computed(() => isKirbyTrue(props.block.content.show_hero) && !!props.block.content.heading)

const heroVariables = computed(() => fillVariables('hero', resolveFill(props.block.content.fill, props.block.content.fill_reverse)))

// Inherited by the Titre and Accordion bars of the section.
const barVariables = computed(() => fillVariables('bar', resolveFill(props.block.content.bar_fill, props.block.content.bar_fill_reverse)))
</script>

<style lang="scss" scoped>
// Target of the Anchors bar: land below the sticky nav + anchors bars.
.v-block-section {
  scroll-margin-top: calc(var(--navigation-menu-height) + var(--anchors-height));
}

// "Bandeau H1" of the mockup: chapter break between the large parts of a page.
.v-block-section__hero {
  min-height: 500px;
  padding-block: var(--spacing-5xl);
  background: var(--hero-fill, var(--theme-gradient));
  color: var(--hero-text, var(--theme-text));
  text-align: center;

  @media (max-width: $breakpoint-mobile) {
    min-height: 280px;
  }
}

.v-block-section__hero-title {
  font-size: 90px;
  line-height: 1.2;
  text-transform: uppercase;

  @media (max-width: $breakpoint-mobile) {
    font-size: 44px;
  }
}
</style>
