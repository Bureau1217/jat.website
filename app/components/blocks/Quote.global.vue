<template>
  <figure
    class="v-block-quote u-block u-flex u-flex--column u-gap-m"
    :class="[`v-block-quote--${alignment}`, { 'v-block-quote--filled': fill }]"
    :style="fill ? { background: fill.background, color: fill.color } : textColor"
  >
    <blockquote class="v-block-quote__text" v-html="block.content.text" />
    <figcaption v-if="block.content.author" class="v-block-quote__author">{{ block.content.author }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { QuoteContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<QuoteContent>
}>()

const alignment = computed(() => (props.block.content.alignment === 'right' ? 'right' : 'center'))

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
}

.v-block-quote--center {
  align-items: center;
  text-align: center;
}

.v-block-quote--right {
  align-items: flex-end;
  text-align: right;
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
    font-size: 36px;
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
