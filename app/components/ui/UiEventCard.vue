<template>
  <UiCard
    :to="pagePath(event)"
    :title="event.title"
    :cover="event.cover"
    :categories="event.categories"
    :date="formatEventDate(event.startDate, event.endDate)"
    :time="event.schedule"
    :place="event.location"
    :excerpt="event.excerpt"
    :sizes="sizes"
  />
</template>

<script setup lang="ts">
import type { KqlEvent, KqlPageRef } from '~~/shared/types/kql'

/** Card of an Agenda event — News block and « Actualités en lien » box. */
withDefaults(defineProps<{
  event: KqlEvent | KqlPageRef
  sizes?: string
}>(), {
  sizes: undefined
})
</script>
