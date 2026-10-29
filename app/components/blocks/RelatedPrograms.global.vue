<template>
  <UiAsideBox v-if="programs.length" title="Formations en lien">
    <ul class="v-block-related-programs u-flex u-flex--column u-gap-s">
      <li v-for="program in programs" :key="program.id" class="u-flex u-flex--column u-gap-xxs">
        <span v-if="program.parentTitle" class="v-block-related-programs__group">{{ program.parentTitle }}</span>
        <span class="v-block-related-programs__title">{{ program.title }}</span>
      </li>
    </ul>
  </UiAsideBox>
</template>

<script setup lang="ts">
import type { RelatedProgramsContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlPageRefs } from '~~/shared/types/kql'

/** "Contenus liés" box of an Accordion "3 colonnes" sub-section. */
const props = defineProps<{
  block: KqlBlock<RelatedProgramsContent>
  pages?: KqlPageRefs
}>()

const programs = computed(() => resolvePageRefs(props.block.content.programs, props.pages))
</script>

<style lang="scss" scoped>
.v-block-related-programs__group {
  @include t-small;
}

.v-block-related-programs__title {
  @include t-small-bold;
}
</style>
