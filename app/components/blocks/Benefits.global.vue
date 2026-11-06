<template>
  <div class="v-block-benefits u-block">
    <ul class="v-block-benefits__list u-flex u-flex--wrap u-flex--justify-center">
      <li v-for="(item, index) in items" :key="index" class="v-block-benefits__item u-flex u-flex--column u-flex--align-center u-gap-l">
        <div v-if="item.pictogram" class="v-block-benefits__pictogram u-flex u-flex--align-center u-flex--justify-center">
          <img :src="item.pictogram.url" alt="">
        </div>
        <h4>{{ item.heading }}</h4>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { BenefitsContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

/** "Partenaires / Bénéfices": SVG pictogram + title, always centered in the viewport. */
const props = defineProps<{
  block: KqlBlock<BenefitsContent>
  files?: KqlFile[]
}>()

const items = computed(() => (props.block.content.items ?? []).map(item => ({
  heading: item.heading,
  pictogram: resolveKqlFile(item.pictogram, props.files)
})))
</script>

<style lang="scss" scoped>
// Mockup (École, « Jazz à Tours en quelques points »): up to 6 columns of
// 187px, ~31px apart, on one line at 1440px.
.v-block-benefits__list {
  gap: var(--spacing-4xl) fluid(16px, 31px);
}

.v-block-benefits__item {
  width: fluid(120px, 187px);
  text-align: center;
}

.v-block-benefits__item h4 {
  @include t-p-medium;
  text-transform: none;
}

// Pictograms keep their own size, as drawn in the mockup (star 171px,
// triangle 141px, circle 117px — the SVG width / height), centered in a
// row as tall as the biggest one; they shrink with the column on small
// screens. Decorative: the title right below carries the meaning.
.v-block-benefits__pictogram {
  width: 100%;
  height: fluid(110px, 179px);

  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
