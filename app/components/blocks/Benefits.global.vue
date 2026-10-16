<template>
  <div class="v-block-benefits u-block">
    <ul class="v-block-benefits__list u-flex u-flex--wrap u-flex--justify-center u-gap-3xl">
      <li v-for="(item, index) in items" :key="index" class="v-block-benefits__item u-flex u-flex--column u-flex--align-center u-gap-m">
        <img v-if="item.pictogram" :src="item.pictogram.url" alt="" class="v-block-benefits__pictogram">
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
.v-block-benefits__item {
  width: 200px;
  text-align: center;
}

// Decorative: the title right below carries the meaning.
.v-block-benefits__pictogram {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
</style>
