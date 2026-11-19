<template>
  <figure
    class="v-block-quote u-block u-flex u-flex--column u-gap-m"
    :class="[`v-block-quote--${alignment}`, { 'v-block-quote--filled': fill }]"
    :style="fill ? { background: fill.background, color: fill.color } : textColor"
  >
    <blockquote class="v-block-quote__text" v-html="text" />
    <figcaption v-if="block.content.author" class="v-block-quote__author">{{ block.content.author }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { QuoteContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<QuoteContent>
}>()

const locale = useLocale()
const text = computed(() => noWidows(locale.value === 'fr' ? frenchSpacing(props.block.content.text) : props.block.content.text))

const alignment = computed(() => {
  const value = props.block.content.alignment
  return value === 'right' || value === 'column' ? value : 'center'
})

const fill = computed(() => resolveFill(props.block.content.fill, props.block.content.fill_reverse, props.block.content.text_color))

// Without a fill, "Couleur du texte" still applies on the page background.
const textColor = computed(() => {
  const color = props.block.content.text_color
  return color ? { color: `var(--color-${color})` } : undefined
})
</script>

<style lang="scss" scoped>
.v-block-quote {
  margin: 0;
}

// A colored band filling the screen under the navigation (home page
// accroche), its text centered.
.v-block-quote--filled {
  justify-content: center;
  min-height: calc(100svh - var(--navigation-menu-height));
  padding-block: var(--spacing-6xl);

  // On a phone a screen-tall band is mostly empty color: the text sets it.
  @media (max-width: $breakpoint-mobile) {
    min-height: 0;
  }
}

.v-block-quote--center {
  align-items: center;
  text-align: center;
}

.v-block-quote--right {
  align-items: flex-end;
  text-align: right;
}

// "Dans la colonne de texte": left-aligned in the ¾ column, as the text of
// the Paragraph block, at the smaller Gaya size (Se former, Cours loisirs).
.v-block-quote--column {
  container-type: inline-size;
  justify-content: center;
}

.v-block-quote--column .v-block-quote__text,
.v-block-quote--column .v-block-quote__author {
  @container (min-width: 900px) {
    margin-left: calc(25% + var(--spacing-xl) * 0.75);
  }
}

.v-block-quote--column .v-block-quote__text {
  font-size: 40px;
  line-height: 1.3;

  @media (max-width: $breakpoint-mobile) {
    font-size: 28px;
  }
}

// Accroche of the mockup (home page, under an event banner): Gaya italic XL.
.v-block-quote__text {
  margin: 0;
  max-width: 1360px;
  font-family: var(--font-accent);
  font-style: italic;
  font-size: 72px;
  line-height: 1.28;

  @media (max-width: $breakpoint-mobile) {
    font-size: 32px;
  }
}

// Inside a column (fiche 3 colonnes): the smaller "exergue" of the mockup.
// (The whole selector goes in :global() — `:global(.a) .b` compiles to `.a`.)
:global(.u-nested .v-block-quote__text) {
  font-size: 40px;
  line-height: 1.3;
}

.v-block-quote__author {
  font-size: 16px;
  font-weight: 700;
}
</style>
