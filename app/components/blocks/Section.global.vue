<template>
  <section class="v-block-section">
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
</script>

<style lang="scss" scoped>
// Consecutive sections are separated by a rule; the blocks inside keep
// their own page-level spacing and gutter.
.v-block-section + .v-block-section {
  border-top: 1px solid currentColor;
}
</style>
