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
.ui-button {
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  line-height: 1;
  width: fit-content;
}

// Filled pill, switches to outline-only on hover. A transparent border is
// reserved at all times so the button doesn't change size on hover.
.ui-button--primary {
  background: var(--button-color);
  color: var(--button-text);
  border: 2px solid transparent;
  border-radius: var(--radius-pill);
  padding: var(--spacing-s) var(--spacing-xl);
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: transparent;
    color: var(--button-color);
    border-color: var(--button-color);
  }
}

.ui-button--secondary {
  background: transparent;
  color: inherit;
  border-bottom: 2px solid currentColor;
  padding: 0 0 2px;
  border-radius: 0;

  &:hover {
    opacity: 0.7;
  }
}
</style>
