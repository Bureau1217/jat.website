<template>
  <div
    v-if="lines.length"
    class="v-block-title-banner u-gutter-x u-flex u-flex--align-center"
    :style="fill ? { background: fill.background, color: fill.color } : textColor"
  >
    <div class="v-block-title-banner__inner">
      <p v-if="block.content.tag" class="v-block-title-banner__tag">{{ block.content.tag }}</p>
      <p class="v-block-title-banner__title">
        <template v-for="(line, index) in lines" :key="index">
          <br v-if="index > 0">{{ line }}
        </template>
      </p>
      <p v-if="block.content.caps" class="v-block-title-banner__caps">{{ block.content.caps }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TitleBannerContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/**
 * "Bandeau titre": a large typographic title on a named fill (formation
 * banners of Se former) — Gaya title, optional Animo capitals line and tag.
 */
const props = defineProps<{
  block: KqlBlock<TitleBannerContent>
}>()

const lines = computed(() => (props.block.content.title ?? '').split('\n').map(line => line.trim()).filter(Boolean))

const fill = computed(() => resolveFill(props.block.content.fill, props.block.content.fill_reverse, props.block.content.text_color))

// Without a fill, "Couleur du texte" still applies on the page background.
const textColor = computed(() => {
  const color = props.block.content.text_color
  return color ? { color: `var(--color-${color})` } : undefined
})
</script>

<style lang="scss" scoped>
// A full screen band under the sticky bars, as the 580–730 px banners of the
// mockup.
.v-block-title-banner {
  min-height: calc(100svh - var(--navigation-menu-height) - var(--anchors-height));
  padding-block: var(--spacing-6xl);
}

// Title (and capitals line) on the left, the tag in its own column on the
// right, top-aligned: it never overlaps a long title line.
.v-block-title-banner__inner {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: var(--spacing-3xl);
  align-items: start;
  width: min(100%, 1280px);
  margin-inline: auto;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.v-block-title-banner__title,
.v-block-title-banner__caps {
  grid-column: 1;
}

.v-block-title-banner__title {
  font-family: var(--font-accent);
  font-size: 100px;
  line-height: 1.05;

  @media (max-width: $breakpoint-mobile) {
    font-size: 48px;
  }
}

.v-block-title-banner__caps,
.v-block-title-banner__tag {
  font-family: var(--font-heading);
  line-height: 1;
  text-transform: uppercase;
}

.v-block-title-banner__caps {
  grid-row: 2;
  margin-top: var(--spacing-xl);
  font-size: 72px;

  @media (max-width: $breakpoint-mobile) {
    font-size: 32px;
  }
}

// "[AMP]": top right of the title, as in the mockup.
.v-block-title-banner__tag {
  grid-column: 2;
  grid-row: 1;
  font-size: 90px;

  @media (max-width: $breakpoint-mobile) {
    grid-column: 1;
    font-size: 40px;
  }
}
</style>
