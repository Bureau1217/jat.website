<template>
  <article class="v-page-articles">
    <UiPageHero :title="page.title" />
    <UiArticleGrid class="u-block" />
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/** Actualités data page (jat.cms `articles` template): every article. */
defineProps<{
  page: KqlPage
}>()
</script>
