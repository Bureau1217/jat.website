<template>
  <NuxtLink :to="teaser.to" class="ui-teaser-card u-flex u-flex--column u-gap-l">
    <div class="ui-teaser-card__media">
      <UiImage v-if="teaser.cover" :file="teaser.cover" cover />
    </div>
    <div class="u-flex u-flex--column u-gap-s">
      <p v-if="teaser.categories.length" class="ui-teaser-card__categories">
        <span v-for="category in teaser.categories" :key="category"># {{ category }}</span>
      </p>
      <h3 class="ui-teaser-card__title">{{ teaser.title }}</h3>
      <p v-if="teaser.date || teaser.schedule" class="ui-teaser-card__line u-flex u-flex--justify-between u-gap-m">
        <span>{{ teaser.date }}</span>
        <span v-if="teaser.schedule">{{ teaser.schedule }}</span>
      </p>
      <p v-if="teaser.location" class="ui-teaser-card__line">→ {{ teaser.location }}</p>
      <p v-if="teaser.excerpt && !compact" class="ui-teaser-card__line ui-teaser-card__excerpt">{{ teaser.excerpt }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Teaser } from '~/utils/teasers'

/**
 * Card of an Agenda event or an Actualités article (grids, "Actualités en
 * lien"). `compact` drops the excerpt for narrow columns.
 */
defineProps<{
  teaser: Teaser
  compact?: boolean
}>()
</script>

<style lang="scss" scoped>
.ui-teaser-card {
  text-decoration: none;

  &:hover .ui-teaser-card__title {
    text-decoration: underline;
  }
}

.ui-teaser-card__media {
  aspect-ratio: 411 / 300;
  background: var(--color-accent);
  overflow: hidden;
}

.ui-teaser-card__categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  font-family: var(--font-accent);
  font-style: italic;
  font-size: 20px;
  line-height: 1.2;
}

.ui-teaser-card__title {
  font-size: 40px;
  line-height: 1;
  text-transform: uppercase;

  @media (max-width: $breakpoint-mobile) {
    font-size: 32px;
  }
}

.ui-teaser-card__line {
  font-size: 20px;
  line-height: 1.24;
}

// 3 lines, as in the mockup.
.ui-teaser-card__excerpt {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
