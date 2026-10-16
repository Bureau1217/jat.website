<template>
  <div v-if="items.length" class="v-block-list u-block">
    <ul class="v-block-list__items u-flex u-flex--column">
      <li v-for="(item, index) in items" :key="index" class="v-block-list__item u-flex u-flex--column u-gap-xxs">
        <span v-if="item.overline" class="v-block-list__overline">{{ item.overline }}</span>
        <span class="v-block-list__label">{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ListContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlPageRefs } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<ListContent>
  pages?: KqlPageRefs
}>()

/** Manual items, or the titles of the picked courses (with their group) / teams. */
const items = computed((): Array<{ label: string, overline: string | null }> => {
  const { source, items: manualItems, programs, teams } = props.block.content
  if (source === 'programs') {
    return resolvePageRefs(programs, props.pages).map(page => ({ label: page.title, overline: page.parentTitle }))
  }
  if (source === 'team') {
    return resolvePageRefs(teams, props.pages).map(page => ({ label: page.title, overline: null }))
  }
  return (manualItems ?? []).map(item => ({ label: item.item_text, overline: null }))
})
</script>

<style lang="scss" scoped>
.v-block-list__items {
  max-width: var(--content-max-width);
}

.v-block-list__item {
  padding-block: var(--spacing-s);
  border-bottom: 1px solid currentColor;
}

.v-block-list__overline {
  font-size: 14px;
  text-transform: uppercase;
}

.v-block-list__label {
  font-size: 20px;
  font-weight: 600;
}
</style>
