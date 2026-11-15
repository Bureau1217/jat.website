<template>
  <div v-if="featured || upcoming.length || past.length" class="ui-agenda">
    <UiDisclosure v-if="featured" :title="t('À la une')" :collapsible="false">
      <div class="ui-agenda__content">
        <UiFeaturedTeaser :teaser="eventTeaser(featured)" />
      </div>
    </UiDisclosure>

    <UiDisclosure v-if="upcoming.length" :title="t('À venir')" open>
      <div class="ui-agenda__content u-flex u-flex--column u-gap-4xl">
        <div v-if="categories.length > 1" class="ui-agenda__filters" role="group" :aria-label="t('Filtrer par catégorie')">
          <button
            v-for="category in ['', ...categories]"
            :key="category"
            type="button"
            class="ui-agenda__filter u-flex u-flex--align-center u-gap-xs"
            :class="{ 'is-active': category === activeCategory }"
            :aria-pressed="category === activeCategory"
            @click="activeCategory = category; upcomingCount = PAGE_SIZE"
          >
            <span class="ui-agenda__marker" aria-hidden="true" />
            {{ category || t('Tout') }}
          </button>
        </div>

        <ul class="ui-agenda__grid">
          <li v-for="event in filteredUpcoming.slice(0, upcomingCount)" :key="event.id">
            <UiTeaserCard :teaser="eventTeaser(event)" />
          </li>
        </ul>
        <p v-if="!filteredUpcoming.length" class="ui-agenda__empty">{{ t('Aucun événement à venir dans cette catégorie.') }}</p>
        <button v-if="filteredUpcoming.length > upcomingCount" type="button" class="ui-agenda__more" @click="upcomingCount += PAGE_SIZE">
          {{ t('charger +') }}
        </button>
      </div>
    </UiDisclosure>

    <UiDisclosure v-if="past.length" :title="t('Passé')">
      <div class="ui-agenda__content u-flex u-flex--column u-gap-4xl">
        <ul class="ui-agenda__grid">
          <li v-for="event in past.slice(0, pastCount)" :key="event.id">
            <UiTeaserCard :teaser="eventTeaser(event)" />
          </li>
        </ul>
        <button v-if="past.length > pastCount" type="button" class="ui-agenda__more" @click="pastCount += PAGE_SIZE">
          {{ t('charger +') }}
        </button>
      </div>
    </UiDisclosure>
  </div>
</template>

<script setup lang="ts">
import type { KqlEvent } from '~~/shared/types/kql'

/**
 * Agenda: the "À la une" event, upcoming events filtered by category,
 * past events (`showPast`). Agenda block and `agenda` page.
 */
const props = withDefaults(defineProps<{
  showPast?: boolean
}>(), {
  showPast: true
})

const PAGE_SIZE = 6

const { data: allEvents } = await useEvents()

// Kirby dates are "Y-m-d": compared as strings against today's local date.
const today = new Date().toLocaleDateString('sv-SE')
const isUpcoming = (event: KqlEvent) => (event.endDate || event.startDate || '') >= today

const featured = computed(() => (allEvents.value ?? []).find(event => event.isFeatured) ?? null)

// /api/events is most recent first: upcoming events read soonest first,
// the "À la une" one being already shown above.
const upcoming = computed(() => (allEvents.value ?? []).filter(event => isUpcoming(event) && event.id !== featured.value?.id).reverse())
const past = computed(() => props.showPast ? (allEvents.value ?? []).filter(event => !isUpcoming(event)) : [])

const categories = computed(() => [...new Set(upcoming.value.flatMap(event => event.categories))])
const activeCategory = ref('')
const filteredUpcoming = computed(() => activeCategory.value
  ? upcoming.value.filter(event => event.categories.includes(activeCategory.value))
  : upcoming.value)

const upcomingCount = ref(PAGE_SIZE)
const pastCount = ref(3)
</script>

<style lang="scss" scoped>
.ui-agenda {
  padding-block: var(--block-spacing);
}

.ui-agenda__content {
  padding: var(--spacing-4xl) var(--gutter);
}

.ui-agenda__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs) var(--spacing-3xl);
  padding-block: var(--spacing-m);
  border-block: 1px solid currentColor;
}

.ui-agenda__filter {
  padding: var(--spacing-xs) 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.2;
  cursor: pointer;
}

.ui-agenda__marker {
  width: 16px;
  height: 16px;
  border: 1px solid currentColor;
  border-radius: 50%;

  .is-active & {
    background: currentColor;
  }
}

.ui-agenda__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6xl) var(--spacing-5xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-3xl);
  }
}

.ui-agenda__more {
  align-self: center;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 20px;
  cursor: pointer;
}

// Right under the Agenda title bar, the "À la une" bar follows it directly.
:global(.v-block-heading + .ui-agenda) {
  padding-top: 0;
}
</style>
