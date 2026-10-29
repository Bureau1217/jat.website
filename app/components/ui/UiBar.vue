<template>
  <component
    :is="as"
    class="ui-bar u-flex u-flex--align-center u-gap-xl u-gutter-x"
    :class="`ui-bar--${level}`"
    :style="fillStyle(fill)"
  >
    <component :is="level" :id="titleId" class="ui-bar__title">{{ title }}</component>
    <span v-if="toggle" class="ui-bar__icon" :class="{ 'is-open': open }" aria-hidden="true" />
  </component>
</template>

<script setup lang="ts">
/**
 * Title bar of the mockup (« Barre / Formation » + « Frame 162 »): full
 * width, page-theme fill, one title. Same component for the Titre block
 * (h2, Animo) and the accordion bars (h3, Rebond, with ±) — only the title
 * level changes. `fill` overrides the page theme with a named fill.
 */
withDefaults(defineProps<{
  title: string
  /** h1: page title bar (article); h2: Titre block; h3: accordion. */
  level?: 'h1' | 'h2' | 'h3'
  /** Rendered element: `summary` when the bar opens an accordion item. */
  as?: 'div' | 'summary'
  /** Shows the « + / − » of an accordion. */
  toggle?: boolean
  open?: boolean
  fill?: string | null
  titleId?: string
}>(), {
  level: 'h2',
  as: 'div',
  toggle: false,
  open: false,
  fill: null,
  titleId: undefined
})
</script>

<style lang="scss" scoped>
.ui-bar {
  min-height: var(--bar-height);
  padding-block: var(--spacing-m);
  @include fill-background(bar);
}

summary.ui-bar {
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
}

.ui-bar__title {
  flex: 1;
  // Lets a long title wrap instead of pushing the icon out of the row.
  min-width: 0;
  color: inherit;
}

.ui-bar--h1 .ui-bar__title,
.ui-bar--h2 .ui-bar__title {
  @include t-h2;
}

.ui-bar--h3 .ui-bar__title {
  @include t-h3;
}

// "+" that becomes a "−" when open.
.ui-bar__icon {
  position: relative;
  flex-shrink: 0;
  width: rem(28px);
  height: rem(28px);

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background: currentColor;
    transform: translate(-50%, -50%);
  }

  &::before {
    width: 100%;
    height: 3px;
  }

  &::after {
    width: 3px;
    height: 100%;
    transition: transform 0.2s ease;
  }

  &.is-open::after {
    transform: translate(-50%, -50%) scaleY(0);
  }
}
</style>
