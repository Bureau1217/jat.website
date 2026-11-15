<template>
  <div class="v-block-benefits u-block u-flex u-flex--column u-gap-4xl">
    <h3 v-if="block.content.heading" class="v-block-benefits__heading">{{ block.content.heading }}</h3>
    <ul class="v-block-benefits__list u-flex u-flex--wrap u-flex--justify-center u-gap-3xl">
      <li v-for="(item, index) in items" :key="index" class="v-block-benefits__item u-flex u-flex--column u-flex--align-center u-gap-m">
        <img v-if="item.pictogram" :src="item.pictogram.url" alt="" class="v-block-benefits__pictogram">
        <h4 class="v-block-benefits__label">{{ item.heading }}</h4>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { BenefitsContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

/** "Partenaires / Bénéfices": optional title, then SVG pictogram + label, always centered in the viewport. */
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
// Plain title of the mockup ("Jazz à Tours en quelques points"), not a bar.
.v-block-benefits__heading {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 40px;
  line-height: 1.12;
  letter-spacing: -0.02em;

  @media (max-width: $breakpoint-mobile) {
    font-size: 28px;
  }
}

.v-block-benefits__item {
  width: 200px;
  text-align: center;
}

.v-block-benefits__label {
  font-family: var(--font-body);
  font-size: 20px;
  line-height: 1.24;
}

// Decorative: the label right below carries the meaning.
.v-block-benefits__pictogram {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
</style>
