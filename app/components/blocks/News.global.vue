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
/** The block has no options: always one row of cards. */
const EVENT_COUNT = 3

// "Mis en avant" events come first, each group keeping the Agenda order
// (most recent first, see /api/events).
const { data: allEvents } = await useEvents()
const events = computed(() => {
  const all = allEvents.value ?? []
  return [...all.filter(event => event.isFeatured), ...all.filter(event => !event.isFeatured)].slice(0, EVENT_COUNT)
})
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
