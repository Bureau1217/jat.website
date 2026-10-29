<template>
  <div v-if="items.length" class="v-block-list" :class="{ 'u-block': !isNested }">
    <component :is="isNested ? 'div' : UiTwoColumns">
      <ul class="v-block-list__items u-flex u-flex--column">
        <li v-for="(item, index) in items" :key="index" class="v-block-list__item u-flex u-flex--column u-gap-xxs">
          <span v-if="item.overline" class="v-block-list__overline">{{ item.overline }}</span>
          <span class="v-block-list__label">{{ item.label }}</span>
        </li>
      </ul>
    </component>
  </div>
</template>

<script setup lang="ts">
import type { ListContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlPageRefs } from '~~/shared/types/kql'
import UiTwoColumns from '~/components/ui/UiTwoColumns.vue'

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

const isNested = useIsNested()
</script>

<style lang="scss" scoped>
.v-block-list__item {
  padding-block: var(--spacing-s);
  border-bottom: 1px solid currentColor;
}

.v-block-list__overline {
  @include t-small;
}

.v-block-list__label {
  @include t-p;
}
</style>
