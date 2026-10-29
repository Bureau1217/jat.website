<template>
  <component
    :is="href ? 'a' : 'button'"
    class="ui-dot-item u-inline-flex u-flex--align-start u-gap-s"
    :class="{ 'is-active': active }"
    :href="href"
    :type="href ? undefined : 'button'"
    :aria-current="active && href ? 'location' : undefined"
    :aria-pressed="!href ? active : undefined"
  >
    <span class="ui-dot-item__dot" aria-hidden="true" />
    <span class="ui-dot-item__label"><slot /></span>
  </component>
</template>

<script setup lang="ts">
/**
 * « ○ libellé » item of the mockup, filled (●) when active. Shared by the
 * anchors bar, the 3-column summary, the Agenda filters and the tabs: a link
 * when `href` is given, a toggle button otherwise.
 */
withDefaults(defineProps<{
  href?: string
  active?: boolean
}>(), {
  href: undefined,
  active: false
})
</script>

<style lang="scss" scoped>
.ui-dot-item {
  padding: 0;
  background: none;
  border: none;
  color: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;

  &:hover .ui-dot-item__label {
    text-decoration: underline;
  }
}

.ui-dot-item__dot {
  flex-shrink: 0;
  width: 0.85em;
  height: 0.85em;
  margin-top: 0.15em;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  .is-active & {
    background: currentColor;
  }
}
</style>
