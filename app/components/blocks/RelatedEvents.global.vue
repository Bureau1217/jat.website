<template>
  <UiAsideBox v-if="events.length" :title="t('Actualités en lien')">
    <ul class="u-flex u-flex--column u-gap-xl">
      <li v-for="event in events" :key="event.id">
        <UiTeaserCard :teaser="eventTeaser(event)" compact />
      </li>
    </ul>
  </UiAsideBox>
</template>

<script setup lang="ts">
import type { RelatedEventsContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlPageRefs } from '~~/shared/types/kql'

/** "Contenus liés" box of an Accordion "3 colonnes" sub-section. */
const props = defineProps<{
  block: KqlBlock<RelatedEventsContent>
  pages?: KqlPageRefs
}>()

const events = computed(() => resolvePageRefs(props.block.content.events, props.pages))
</script>
