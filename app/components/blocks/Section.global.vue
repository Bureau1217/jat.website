<template>
  <section :id="block.id" class="v-block-section" :class="{ 'v-block-section--school': isSchool }" :style="barVariables">
    <div v-if="titleDisplay === 'banner'" class="v-block-section__hero u-gutter-x u-flex u-flex--align-center u-flex--justify-center" :style="heroVariables">
      <h2 class="v-block-section__hero-title">{{ block.content.heading }}</h2>
    </div>
    <UiTitleBar v-else-if="titleDisplay === 'bar'" :text="heading" />
    <Blocks :blocks="body" :files="files" :pages="pages" />
  </section>
</template>

<script setup lang="ts">
import type { SectionContent, SectionTitleDisplay } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<SectionContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const heading = computed(() => props.block.content.heading?.trim() ?? '')

const blocks = computed(() => parseKqlBlocks(props.block.content.body))

// The old way of titling a section: a Titre block repeating its name.
const leadsWithName = computed(() => {
  const first = blocks.value[0]
  return first?.type === 'heading' && String(first.content.text ?? '').trim() === heading.value
})

// « Affichage du nom ». Sections saved before the field keep their look:
// the banner toggle, else a bar if a Titre block repeated the name.
const titleDisplay = computed<SectionTitleDisplay>(() => {
  if (heading.value === '') return 'none'
  const chosen = props.block.content.title_display
  if (chosen) return chosen
  if (isKirbyTrue(props.block.content.show_hero)) return 'banner'
  return leadsWithName.value ? 'bar' : 'none'
})

// A leftover Titre block repeating the name would show it twice.
const body = computed(() => titleDisplay.value !== 'none' && leadsWithName.value ? blocks.value.slice(1) : blocks.value)

const heroVariables = computed(() => fillVariables('hero', resolveFill(props.block.content.fill, props.block.content.fill_reverse)))

// A section in L'École's colors on another page (home: « L'École »,
// « Infos pratiques ») takes its red running text too, as on the École page.
// Jat.cms sections have no theme field: the bar fill tells.
const isSchool = computed(() => /^(degrade|aplat)-ecole/.test(props.block.content.bar_fill ?? ''))

// Inherited by the Titre and Accordion bars of the section.
const barVariables = computed(() => fillVariables('bar', resolveFill(props.block.content.bar_fill, props.block.content.bar_fill_reverse)))
</script>

<style lang="scss" scoped>
// Target of the Anchors bar: land below the sticky nav + anchors bars.
.v-block-section {
  scroll-margin-top: calc(var(--navigation-menu-height) + var(--anchors-height));
}

// The school theme's ink only (main.scss, .u-theme--school): the bars and
// banner keep their own fills.
.v-block-section--school {
  --color-text: var(--theme-school-ink);
  --color-accent: var(--theme-school-ink);
  --button-color: var(--theme-school-ink);

  color: var(--color-text);
}

// "Bandeau H1" of the mockup: chapter break between the large parts of a page.
// Fills the screen under the sticky bars, as the 730 px banners of the
// mockup do on a 1440 × 900 screen.
.v-block-section__hero {
  min-height: calc(100svh - var(--navigation-menu-height) - var(--anchors-height));
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
