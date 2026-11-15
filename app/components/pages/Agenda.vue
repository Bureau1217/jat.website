<template>
  <article class="v-page-agenda">
    <UiPageHero :title="page.title" />
    <UiAgenda />
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/** Agenda data page (jat.cms `agenda` template): every event, as the Agenda block shows them. */
defineProps<{
  page: KqlPage
}>()
</script>
