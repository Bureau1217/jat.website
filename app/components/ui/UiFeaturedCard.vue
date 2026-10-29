<template>
  <NuxtLink :to="to" class="ui-featured-card">
    <div class="ui-featured-card__grid">
      <div class="ui-featured-card__media">
        <UiImage v-if="cover" :file="cover" cover sizes="(max-width: 900px) 100vw, 62vw" />
      </div>
      <div class="ui-featured-card__body u-flex u-flex--column">
        <h3 class="ui-featured-card__title">{{ title }}</h3>
        <p v-if="date" class="ui-featured-card__date">{{ date }}</p>
        <p v-if="excerpt" class="ui-featured-card__excerpt">{{ excerpt }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/**
 * « À la une » item (mockup « Event UNE »): large photo on the left, title,
 * date and start of the text on the right; stacked when its container is
 * narrow. Shared by the News (event) and Articles blocks.
 */
withDefaults(defineProps<{
  to: string
  title: string
  cover?: KqlFile | null
  date?: string | null
  excerpt?: string | null
}>(), {
  cover: null,
  date: null,
  excerpt: null
})
</script>

<style lang="scss" scoped>
.ui-featured-card {
  display: block;
  container-type: inline-size;
  text-decoration: none;

  &:hover .ui-featured-card__title {
    text-decoration: underline;
  }
}

// Mockup at 1440: 885px photo, 63px gap, 411px text column.
.ui-featured-card__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-xl) var(--grid-gap);
  align-items: center;

  @include container-wide {
    grid-template-columns: minmax(0, 885fr) minmax(0, 411fr);
  }
}

.ui-featured-card__media {
  aspect-ratio: 885 / 464;
  background: var(--color-text);
  overflow: hidden;
}

.ui-featured-card__body {
  gap: var(--spacing-l);
}

.ui-featured-card__title {
  @include t-h4;
}

.ui-featured-card__date {
  @include t-lead;
}

.ui-featured-card__excerpt {
  @include t-p;
}
</style>
