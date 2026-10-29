<template>
  <component
    :is="tag"
    class="ui-button u-inline-flex u-flex--align-center u-flex--justify-center u-gap-xs"
    :class="`ui-button--${variant}`"
    :to="isInternal ? to : undefined"
    :href="isInternal ? undefined : to"
    :target="opensNewTab ? '_blank' : undefined"
    :rel="opensNewTab ? 'noopener' : undefined"
    :download="download || undefined"
    :type="to ? undefined : type"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** Visual style: filled pill (primary) or underlined text link (secondary). */
  variant?: 'primary' | 'secondary'
  /** Destination — internal path, external URL or file URL. Omit to render a plain <button>. */
  to?: string
  /** Downloads the target instead of opening it (documents). */
  download?: boolean
  /** Native button type, used when `to` is not set. */
  type?: 'button' | 'submit'
}>(), {
  variant: 'primary',
  to: undefined,
  download: false,
  type: 'button'
})

const isInternal = computed(() => Boolean(props.to?.startsWith('/')) && !props.download)
const opensNewTab = computed(() => Boolean(props.to) && !isInternal.value && !props.download && isExternalLink(props.to ?? ''))
const tag = computed(() => {
  if (isInternal.value) return resolveComponent('NuxtLink')
  return props.to ? 'a' : 'button'
})
</script>

<style lang="scss" scoped>
// Mockup « Bouton »: pill 50px high, 1px outline, Rebond Light 16. Colors
// come from --button-* (main.scss), which follow the page theme.
.ui-button {
  @include t-small;
  min-height: rem(50px);
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
}

.ui-button--primary {
  padding: rem(15px) rem(19px);
  background: var(--button-background);
  color: var(--button-text);
  border: 1px solid var(--button-border);
  border-radius: var(--radius-pill);
  transition: background-color 0.2s ease, color 0.2s ease;

  // No hover state in the mockup: swap fill and text.
  &:hover,
  &:focus-visible {
    background: var(--button-text);
    color: var(--button-background);
  }
}

.ui-button--secondary {
  min-height: 0;
  padding: 0 0 2px;
  background: transparent;
  color: inherit;
  border-bottom: 1px solid currentColor;
  border-radius: 0;

  &:hover {
    opacity: 0.7;
  }
}
</style>
