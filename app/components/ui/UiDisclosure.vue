<template>
  <details v-if="collapsible" class="ui-disclosure" :open="open">
    <summary class="ui-disclosure__bar u-flex u-flex--align-center u-flex--justify-between u-gap-xl">
      <h3 class="ui-disclosure__title">{{ title }}</h3>
      <span class="ui-disclosure__icon" aria-hidden="true" />
    </summary>
    <slot />
  </details>
  <div v-else class="ui-disclosure">
    <div class="ui-disclosure__bar u-flex u-flex--align-center">
      <h3 class="ui-disclosure__title">{{ title }}</h3>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Full-width colored bar with a title — the "Barre de section" of the
 * mockup — over its content, collapsible (+ / −) or not. Filled by the
 * --bar-* variables of the Section / sub-section, else the page theme.
 */
withDefaults(defineProps<{
  title: string
  collapsible?: boolean
  open?: boolean
}>(), {
  collapsible: true,
  open: false
})
</script>

<style lang="scss" scoped>
.ui-disclosure {
  // Bars span the whole width; the gutter moves inside the bar.
  --disclosure-gutter: var(--gutter);

  &[open] .ui-disclosure__icon::after {
    transform: translate(-50%, -50%) scaleY(0);
  }
}

.ui-disclosure__bar {
  min-height: 119px;
  padding: var(--spacing-xl) var(--disclosure-gutter);
  background: var(--bar-fill, var(--theme-bar-gradient));
  color: var(--bar-text, var(--theme-text));
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  @media (max-width: $breakpoint-mobile) {
    min-height: 72px;
  }
}

summary.ui-disclosure__bar {
  cursor: pointer;
}

.ui-disclosure__title {
  flex: 1;
  // Lets a long title wrap instead of pushing the icon out of the row.
  min-width: 0;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 40px;
  line-height: 1.12;
  letter-spacing: -0.02em;

  @media (max-width: $breakpoint-mobile) {
    font-size: 24px;
  }
}

// "+" that becomes a "−" when open.
.ui-disclosure__icon {
  position: relative;
  flex-shrink: 0;
  width: 24px;
  height: 24px;

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
}
</style>
