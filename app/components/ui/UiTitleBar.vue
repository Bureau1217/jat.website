<template>
  <div class="ui-title-bar u-block">
    <h2 :id="anchor" class="ui-title-bar__title">{{ text }}</h2>
  </div>
</template>

<script setup lang="ts">
// "Barre de section" of the mockup: a section's name (Section.global.vue),
// or an old Titre block still in the content (Heading.global.vue).
defineProps<{
  text: string
  /** Target of the "3 colonnes" Sommaire links (UiThreeColumns.vue). */
  anchor?: string
}>()
</script>

<style lang="scss" scoped>
// At page / section level: a full-width colored bar, filled by the
// section's bar fill or else the page theme.
.ui-title-bar {
  padding-block: var(--spacing-4xl);
  background: var(--bar-fill, var(--theme-bar-gradient));
  color: var(--bar-text, var(--theme-text));
}

.ui-title-bar__title {
  font-size: 72px;
  line-height: 1.07;
  text-transform: uppercase;
  scroll-margin-top: calc(var(--navigation-menu-height) + var(--anchors-height) + var(--spacing-xl));

  @media (max-width: $breakpoint-mobile) {
    font-size: 36px;
  }
}

// Inside a column or an accordion: a plain label above its content.
// (The whole selector goes in :global() — `:global(.a) .b` compiles to `.a`.)
:global(.u-nested .ui-title-bar) {
  padding-bottom: 0;
  background: none;
  color: inherit;
}

:global(.u-nested .ui-title-bar__title) {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 20px;
  line-height: 1.24;
  text-transform: none;
}
</style>
