<template>
  <NuxtLink :to="to" class="ui-card u-flex u-flex--column">
    <div class="ui-card__media">
      <UiImage v-if="cover" :file="cover" cover :sizes="sizes" />
    </div>
    <div class="ui-card__body u-flex u-flex--column">
      <p v-if="categories.length" class="ui-card__categories">
        <span v-for="category in categories" :key="category"># {{ category }}</span>
      </p>
      <h3 class="ui-card__title">{{ title }}</h3>
      <p v-if="date || time" class="ui-card__when u-flex u-flex--justify-between u-gap-s">
        <span>{{ date }}</span>
        <span v-if="time">{{ time }}</span>
      </p>
      <p v-if="place" class="ui-card__text">→ {{ place }}</p>
      <p v-if="excerpt" class="ui-card__text ui-card__excerpt">{{ excerpt }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/**
 * Teaser card of the mockup (« BLOC EVENT »): photo, # categories, title,
 * date (and time), → place, start of the text. Shared by events
 * (UiEventCard) and articles (Articles block).
 */
withDefaults(defineProps<{
  to: string
  title: string
  cover?: KqlFile | null
  categories?: string[]
  date?: string | null
  time?: string | null
  place?: string | null
  excerpt?: string | null
  /** Rendered width of the photo (UiImage). */
  sizes?: string
}>(), {
  cover: null,
  categories: () => [],
  date: null,
  time: null,
  place: null,
  excerpt: null,
  sizes: '(max-width: 900px) 100vw, 30vw'
})
</script>

<style lang="scss" scoped>
// Mockup: 411 × 300 photo, 20px to the text, 10px between the lines.
.ui-card {
  gap: var(--spacing-l);
  text-decoration: none;

  &:hover .ui-card__title {
    text-decoration: underline;
  }
}

.ui-card__media {
  aspect-ratio: 411 / 300;
  background: var(--color-text);
  overflow: hidden;
}

.ui-card__body {
  gap: var(--spacing-xs);
}

.ui-card__categories {
  @include t-p;
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--spacing-s);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.ui-card__title {
  @include t-h4;
}

.ui-card__when,
.ui-card__text {
  @include t-p-medium;
}

// Three lines of description at most (mockup).
.ui-card__excerpt {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
</style>
