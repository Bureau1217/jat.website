<template>
  <UiBar v-if="!isNested" class="v-block-heading" :title="block.content.text" :title-id="block.id" level="h2" />
  <h3 v-else :id="block.id" class="v-block-heading__label">{{ block.content.text }}</h3>
</template>

<script setup lang="ts">
import type { HeadingContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/**
 * Page level: full-width title bar on the page theme fill (« Agenda »,
 * « Nos formations »). Inside an accordion / column: a label-size title.
 * The block id doubles as the anchor targeted by the "3 colonnes" Sommaire.
 */
defineProps<{
  block: KqlBlock<HeadingContent>
}>()

const isNested = useIsNested()
</script>

<style lang="scss" scoped>
.v-block-heading__label {
  @include t-label;
  scroll-margin-top: calc(var(--navigation-menu-height) + var(--anchors-height) + var(--spacing-xl));
}
</style>
