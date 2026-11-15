<template>
  <dl v-if="items.length" class="v-block-key-info u-block u-flex u-flex--column u-gap-2xl">
    <div v-for="(item, index) in items" :key="index" class="u-flex u-flex--column u-gap-xs">
      <dt class="v-block-key-info__label">{{ item.label }}</dt>
      <dd class="v-block-key-info__text">
        <UiRichText :html="item.text" />
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import type { KeyInfoContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/** Left column of an Accordion "3 colonnes" sub-section (fiches formation / concert). */
const props = defineProps<{
  block: KqlBlock<KeyInfoContent>
}>()

const items = computed(() => (props.block.content.items ?? []).filter(item => item.label && item.text))
</script>

<style lang="scss" scoped>
.v-block-key-info__label {
  font-weight: 700;
  font-size: 20px;
  line-height: 1.24;
}

.v-block-key-info__text {
  margin: 0;

  // Writer HTML: v-html content, hence :deep().
  :deep(p),
  :deep(li) {
    font-size: 20px;
    line-height: 1.24;
    margin-bottom: var(--spacing-xxs);
  }

  // Every line of the design starts with an arrow: one per paragraph / list
  // item, so editors never type it.
  :deep(p)::before,
  :deep(li)::before {
    content: '→ ';
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 0;
    list-style: none;
  }

  // Organisations, key words: Gaya in the design.
  :deep(strong) {
    font-family: var(--font-accent);
    font-weight: 400;
  }

  @media (max-width: $breakpoint-mobile) {
    :deep(p),
    :deep(li) {
      font-size: 18px;
    }
  }
}
</style>
