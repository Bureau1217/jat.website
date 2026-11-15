<template>
  <!-- The home page opens straight on its carousel: no Repères bar (mockup). -->
  <Anchors v-if="page.uri !== 'home'" :blocks="page.blocks" />
  <article class="v-page-default">
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
defineProps<{
  page: KqlPage
}>()
</script>
