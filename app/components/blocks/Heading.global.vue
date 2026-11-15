<template>
  <div class="v-block-heading u-block">
    <h2 :id="block.id" class="v-block-heading__title">{{ block.content.text }}</h2>
  </div>
</template>

<script setup lang="ts">
import type { HeadingContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

// Always an h2: editors no longer pick the level (the page title is the h1).
// The block id doubles as the anchor targeted by the "3 colonnes" Sommaire.
defineProps<{
  block: KqlBlock<HeadingContent>
}>()
</script>

<style lang="scss" scoped>
// At page / section level: a full-width colored bar ("bandeau H2" of the
// mockup), filled by the section's bar fill or else the page theme.
.v-block-heading {
  padding-block: var(--spacing-4xl);
  background: var(--bar-fill, var(--theme-bar-gradient));
  color: var(--bar-text, var(--theme-text));
}

.v-block-heading__title {
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
:global(.u-nested .v-block-heading) {
  padding-bottom: 0;
  background: none;
  color: inherit;
}

:global(.u-nested .v-block-heading__title) {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 20px;
  line-height: 1.24;
  text-transform: none;
}
</style>
