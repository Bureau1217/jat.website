<template>
  <dl class="ui-key-info u-flex u-flex--column u-gap-2xl">
    <div v-for="(item, index) in items" :key="index" class="u-flex u-flex--column u-gap-xs">
      <dt class="ui-key-info__label">{{ item.label }}</dt>
      <dd class="ui-key-info__text">
        <UiRichText :html="item.html" />
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
/**
 * Label / text pairs, each paragraph arrowed (fiches formation / concert):
 * Infos clés block, event page. `html`: writer HTML.
 */
defineProps<{
  items: Array<{ label: string, html: string }>
}>()
</script>

<style lang="scss" scoped>
.ui-key-info__label {
  font-weight: 700;
  font-size: 20px;
  line-height: 1.24;
}

.ui-key-info__text {
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
