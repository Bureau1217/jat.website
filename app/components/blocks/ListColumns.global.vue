<template>
  <div v-if="groups.length" class="v-block-list-columns u-block">
    <div class="v-block-list-columns__groups">
      <div v-for="(group, index) in groups" :key="index" class="v-block-list-columns__group u-flex u-flex--column u-gap-l">
        <h3 class="v-block-list-columns__heading">{{ group.heading }}</h3>
        <UiRichText :html="group.text" class="v-block-list-columns__items" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListColumnsContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/** Titled groups flowing over 3 columns (Partenaires). */
const props = defineProps<{
  block: KqlBlock<ListColumnsContent>
}>()

const groups = computed(() => (props.block.content.groups ?? []).filter(group => group.heading && group.text))
</script>

<style lang="scss" scoped>
// Same ¼ / ¾ grid as the Paragraph block: the columns line up with the text.
.v-block-list-columns {
  container-type: inline-size;
}

.v-block-list-columns__groups {
  columns: 1;
  column-gap: var(--spacing-5xl);

  @container (min-width: 600px) {
    columns: 2;
  }

  @container (min-width: 900px) {
    columns: 3;
    margin-left: calc(25% + var(--spacing-xl) * 0.75);
  }
}

// A group never splits over two columns; groups stack with air between.
.v-block-list-columns__group {
  break-inside: avoid;
  padding-bottom: var(--spacing-3xl);
}

.v-block-list-columns__heading {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 20px;
  line-height: 1.24;
}

// Writer HTML: v-html content, hence :deep().
.v-block-list-columns__items {
  :deep(p) {
    margin-bottom: var(--spacing-xxs);
    font-size: 20px;
    line-height: 1.24;
  }

  :deep(strong) {
    font-family: var(--font-accent);
    font-weight: 400;
  }
}
</style>
