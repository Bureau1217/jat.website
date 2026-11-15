<template>
  <div v-if="tabs.length" class="v-block-tabs u-block">
    <div class="v-block-tabs__list">
      <h4 v-if="block.content.heading" :id="`${block.id}-heading`" class="v-block-tabs__heading">{{ block.content.heading }}</h4>
      <div role="tablist" :aria-labelledby="block.content.heading ? `${block.id}-heading` : undefined" class="u-flex u-flex--column">
        <button
          v-for="(tab, index) in tabs"
          :id="`${block.id}-tab-${index}`"
          :key="index"
          type="button"
          role="tab"
          class="v-block-tabs__tab u-flex u-flex--align-center u-gap-s"
          :class="{ 'is-active': index === active }"
          :aria-selected="index === active"
          :aria-controls="`${block.id}-panel`"
          :tabindex="index === active ? 0 : -1"
          @click="active = index"
          @keydown="onKeydown"
        >
          <span class="v-block-tabs__marker" aria-hidden="true" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div :id="`${block.id}-panel`" role="tabpanel" :aria-labelledby="`${block.id}-tab-${active}`" class="v-block-tabs__panel">
      <UiRichText :html="current!.text" wide />
    </div>

    <aside v-if="current!.programs.length" class="v-block-tabs__programs">
      <h4 class="v-block-tabs__heading">{{ block.content.programs_heading || t('Formations concernées') }}</h4>
      <ul class="u-flex u-flex--column u-gap-xl">
        <li v-for="program in current!.programs" :key="program.uuid">
          <NuxtLink :to="pagePath(program)" class="v-block-tabs__program">{{ program.title }}</NuxtLink>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup lang="ts">
import type { TabsContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlPageRefs } from '~~/shared/types/kql'

/** Tabs (Tarifs & financements): tab list · open tab · its related programs. */
const props = defineProps<{
  block: KqlBlock<TabsContent>
  pages?: KqlPageRefs
}>()

const tabs = computed(() => (props.block.content.tabs ?? [])
  .filter(tab => tab.label && tab.text)
  .map(tab => ({ ...tab, programs: resolvePageRefs(tab.programs, props.pages) })))

const active = ref(0)
const current = computed(() => tabs.value[active.value] ?? tabs.value[0])

// WAI-ARIA tabs pattern: arrows move between tabs, focus follows.
function onKeydown(event: KeyboardEvent) {
  const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
  if (!step) return
  event.preventDefault()
  active.value = (active.value + step + tabs.value.length) % tabs.value.length
  document.getElementById(`${props.block.id}-tab-${active.value}`)?.focus()
}
</script>

<style lang="scss" scoped>
.v-block-tabs {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--spacing-4xl);
  align-items: start;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

.v-block-tabs__heading {
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid currentColor;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 16px;
  line-height: 1.28;
}

.v-block-tabs__tab {
  width: 100%;
  padding: var(--spacing-xs) 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 16px;
  text-align: left;
  cursor: pointer;

  &.is-active {
    font-family: var(--font-accent);
  }
}

// Radio-like dot of the mockup: filled on the open tab.
.v-block-tabs__marker {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  border: 1px solid currentColor;
  border-radius: 50%;

  .is-active & {
    background: currentColor;
  }
}

// Writer HTML: v-html content, hence :deep().
.v-block-tabs__panel {
  :deep(p),
  :deep(li) {
    font-size: 16px;
    line-height: 1.28;
  }

  // A paragraph holding only bold text: an underlined subtitle.
  :deep(p:has(> strong:only-child)) {
    margin-top: var(--spacing-2xl);
    padding-bottom: var(--spacing-xs);
    border-bottom: 1px solid currentColor;
  }
}

.v-block-tabs__program {
  font-weight: 700;
  font-size: 16px;
}
</style>
