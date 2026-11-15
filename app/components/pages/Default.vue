<template>
  <!-- The home page opens straight on its carousel: no Repères bar (mockup). -->
  <Anchors v-if="page.uri !== 'home'" :blocks="page.blocks" />
  <article class="v-page-default" :class="{ 'v-page-default--with-anchors': hasSectionAnchors }">
    <UiPageHero
      v-if="page.hero.title"
      :title="page.hero.title"
      :signature="page.hero.signature"
      :fill-value="page.hero.fill"
    />
    <h1 v-else class="u-visually-hidden">{{ page.title }}</h1>
    <Blocks :blocks="page.blocks" :files="page.files" :pages="page.pages" />
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/**
 * Site page (jat.cms `default` template): optional banner ("Titre du
 * bandeau" filled — the home and Agenda pages open on their own blocks) +
 * blocks of the `body` field.
 */
const props = defineProps<{
  page: KqlPage
}>()

// The home page opens straight on its carousel: no Repères bar there.
// Elsewhere the bar lists the named sections (or the section's subpages).
const hasSectionAnchors = computed(() => props.page.uri !== 'home' && sectionAnchors(props.page.blocks).length > 0)
</script>

<style lang="scss" scoped>
// The Repères bar also sits above the fold: an opening cover image (see
// Image.global.vue) subtracts it too.
.v-page-default--with-anchors {
  --opening-offset: var(--anchors-height);
}
</style>
