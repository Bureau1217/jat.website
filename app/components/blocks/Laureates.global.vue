<template>
  <UiAsideBox v-if="laureates.length" title="Lauréats">
    <ul class="u-flex u-flex--column u-gap-m">
      <li v-for="(laureate, index) in laureates" :key="index" class="v-block-laureates__item u-flex u-flex--align-center u-gap-m">
        <div class="v-block-laureates__photo">
          <UiImage v-if="laureate.photo" :file="laureate.photo" cover />
        </div>
        <span class="v-block-laureates__name">{{ laureate.heading }}</span>
      </li>
    </ul>
    <UiButton v-if="ctaHref && block.content.cta?.cta_label" :to="ctaHref">{{ block.content.cta.cta_label }}</UiButton>
  </UiAsideBox>
</template>

<script setup lang="ts">
import type { LaureatesContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/** "Contenus liés" box of the columns-3 block. */
const props = defineProps<{
  block: KqlBlock<LaureatesContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const laureates = computed(() => (props.block.content.laureates ?? []).map(laureate => ({
  heading: laureate.heading,
  photo: resolveKqlFile(laureate.photo, props.files)
})))

const ctaHref = computed(() => resolveKirbyLink(props.block.content.cta?.cta_link, props.pages, props.files))
</script>

<style lang="scss" scoped>
.v-block-laureates__photo {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  background: var(--color-surface);
  border-radius: 50%;
  overflow: hidden;
}

.v-block-laureates__name {
  font-size: 18px;
  font-weight: 600;
}
</style>
