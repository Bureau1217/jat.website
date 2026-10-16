<template>
  <div class="v-block-columns-2 u-block">
    <div class="v-block-columns-2__column u-nested">
      <Blocks :blocks="column1" :files="files" :pages="pages" />
    </div>
    <div class="v-block-columns-2__column u-nested">
      <Blocks :blocks="column2" :files="files" :pages="pages" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Columns2Content } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<Columns2Content>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const column1 = computed(() => parseKqlBlocks(props.block.content.column_1))
const column2 = computed(() => parseKqlBlocks(props.block.content.column_2))
</script>

<style lang="scss" scoped>
.v-block-columns-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.v-block-columns-2__column {
  min-width: 0;
}
</style>
