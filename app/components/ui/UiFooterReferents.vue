<template>
  <ul class="ui-footer-referents">
    <li v-for="referent in referents" :key="referent.name">
      <a v-if="referent.contact" :href="referent.contact">{{ referent.name }}</a>
      <template v-else>{{ referent.name }}</template>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { KqlReferent } from '~~/shared/types/kql'

/** Referents (VHSS, handicap) listed in the footer, in italic as in the mockup. */
defineProps<{
  referents: KqlReferent[]
}>()
</script>

<style lang="scss" scoped>
.ui-footer-referents {
  font-style: italic;
}
</style>
