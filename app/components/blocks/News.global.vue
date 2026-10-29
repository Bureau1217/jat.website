<template>
  <div v-if="featured || upcoming.length || (showPast && past.length)" class="v-block-news">
    <!-- À la une: the one event ticked in the Panel. -->
    <section v-if="featured" class="v-block-news__group">
      <UiBar level="h3" title="À la une" />
      <div class="v-block-news__content u-gutter-x">
        <UiFeaturedCard
          :to="pagePath(featured)"
          :title="featured.title"
          :cover="featured.cover"
          :date="formatEventDate(featured.startDate, featured.endDate)"
          :excerpt="featured.excerpt"
        />
      </div>
    </section>

    <details v-if="upcoming.length" class="v-block-news__group" open @toggle="onToggle('upcoming', $event)">
      <UiBar as="summary" level="h3" title="À venir" toggle :open="openGroups.upcoming" />
      <div class="v-block-news__content u-gutter-x u-flex u-flex--column u-gap-2xl">
        <!-- Category filters, only when there's something to filter. -->
        <div v-if="categories.length > 1" class="v-block-news__filters u-flex u-flex--wrap" role="group" aria-label="Filtrer par catégorie">
          <UiDotItem :active="activeCategory === null" @click="activeCategory = null">Tout</UiDotItem>
          <UiDotItem
            v-for="category in categories"
            :key="category"
            :active="activeCategory === category"
            @click="activeCategory = category"
          >
            {{ category }}
          </UiDotItem>
        </div>
        <ul class="v-block-news__list">
          <li v-for="event in filteredUpcoming" :key="event.id">
            <UiEventCard :event="event" />
          </li>
        </ul>
      </div>
    </details>

    <details v-if="showPast && past.length" class="v-block-news__group" open @toggle="onToggle('past', $event)">
      <UiBar as="summary" level="h3" title="Passé" toggle :open="openGroups.past" />
      <div class="v-block-news__content u-gutter-x u-flex u-flex--column u-flex--align-center u-gap-2xl">
        <ul class="v-block-news__list">
          <li v-for="event in shownPast" :key="event.id">
            <UiEventCard :event="event" />
          </li>
        </ul>
        <UiButton v-if="shownPast.length < past.length" variant="secondary" @click="pastCount += PAGE_SIZE">
          charger +
        </UiButton>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { NewsContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/**
 * The Agenda as in the mockup (accueil, Actualités / Agenda): « À la une »
 * (the single event ticked in the Panel), « À venir » (every event not over
 * yet, soonest first, filterable by category) and « Passé » (most recent
 * first, three at a time) — the latter can be turned off in the Panel
 * (accueil: the Actualités take its place).
 */
const props = defineProps<{
  block: KqlBlock<NewsContent>
}>()

const PAGE_SIZE = 3

// Older blocks have no value yet: past events stay shown.
const showPast = computed(() => props.block.content.show_past === undefined || isKirbyTrue(props.block.content.show_past))

const { data: allEvents } = await useEvents()

// Today's date from the server render, so server and client split the
// events the same way (no hydration mismatch around midnight).
const today = useState('news-today', () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
})

const split = computed(() => splitEvents(allEvents.value ?? [], today.value))
const featured = computed(() => split.value.featured)
const upcoming = computed(() => split.value.upcoming)
const past = computed(() => split.value.past)

const categories = computed(() => [...new Set(upcoming.value.flatMap(event => event.categories))])
const activeCategory = ref<string | null>(null)
const filteredUpcoming = computed(() => (activeCategory.value
  ? upcoming.value.filter(event => event.categories.includes(activeCategory.value!))
  : upcoming.value))

const pastCount = ref(PAGE_SIZE)
const shownPast = computed(() => past.value.slice(0, pastCount.value))

// Native <details> keeps its own open state; mirror it for the « ± » icon.
const openGroups = reactive({ upcoming: true, past: true })
function onToggle(group: keyof typeof openGroups, event: Event): void {
  openGroups[group] = (event.target as HTMLDetailsElement).open
}
</script>

<style lang="scss" scoped>
// Lays out from its own width (container query), not the viewport.
.v-block-news {
  container-type: inline-size;
}

// Mockup: 30–40px from a bar to its content, then 86px to the next bar.
.v-block-news__content {
  padding-top: var(--space-bar);
  padding-bottom: calc(2 * var(--block-spacing));
}

.v-block-news__filters {
  @include t-p-medium;
  gap: var(--spacing-s) var(--spacing-3xl);
}

.v-block-news__list {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-4xl) var(--grid-gap);

  @include container-wide {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
