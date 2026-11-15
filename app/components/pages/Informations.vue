<template>
  <article class="v-page-informations">
    <UiPageHero :title="page.title" />
    <UiPracticalInfo class="u-block" />
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/** "Informations générales" (jat.cms `informations` template): the practical information. */
defineProps<{
  page: KqlPage
}>()
</script>
