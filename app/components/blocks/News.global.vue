<template>
  <div v-if="events.length" class="v-block-news u-block">
    <ul class="v-block-news__list">
      <li v-for="event in events" :key="event.id">
        <UiEventCard :event="event" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { NewsContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/** Number of events shown per block size ("S" / "L" in the Panel). */
const SIZE_COUNTS: Record<NewsContent['size'], number> = { s: 3, l: 9 }

const props = defineProps<{
  block: KqlBlock<NewsContent>
}>()

const { data: allEvents } = await useEvents()
const events = computed(() => (allEvents.value ?? []).slice(0, SIZE_COUNTS[props.block.content.size] ?? SIZE_COUNTS.s))
</script>

<style lang="scss" scoped>
.v-block-news__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-2xl) var(--spacing-xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}
</style>
