<template>
  <Anchors :blocks="page.blocks" />
  <article class="v-page-default">
    <header class="v-page-default__header u-block">
      <h1>{{ page.title }}</h1>
    </header>
    <Blocks :blocks="page.blocks" :files="page.files" :pages="page.pages" />
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/** Site page (jat.cms `default` template): title + blocks of the `body` field. */
defineProps<{
  page: KqlPage
}>()
</script>

<style lang="scss" scoped>
.v-page-default__header {
  padding-bottom: 0;
}
</style>
