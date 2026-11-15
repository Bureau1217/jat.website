<template>
  <NuxtLink :to="teaser.to" class="ui-featured-teaser">
    <div class="ui-featured-teaser__media">
      <UiImage v-if="teaser.cover" :file="teaser.cover" cover />
    </div>
    <div class="u-flex u-flex--column u-gap-l">
      <h3 class="ui-featured-teaser__title">{{ teaser.title }}</h3>
      <p v-if="teaser.date" class="ui-featured-teaser__date">{{ teaser.date }}</p>
      <p v-if="teaser.excerpt" class="ui-featured-teaser__excerpt">{{ teaser.excerpt }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Teaser } from '~/utils/teasers'

/** "À la une": the featured event or article, large image + text. */
defineProps<{
  teaser: Teaser
}>()
</script>

<style lang="scss" scoped>
.ui-featured-teaser {
  display: grid;
  grid-template-columns: 885fr 411fr;
  gap: var(--spacing-5xl);
  align-items: center;
  text-decoration: none;

  &:hover .ui-featured-teaser__title {
    text-decoration: underline;
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
}

.ui-featured-teaser__media {
  aspect-ratio: 885 / 464;
  background: var(--color-accent);
  overflow: hidden;
}

.ui-featured-teaser__title {
  font-size: 40px;
  line-height: 1;
  text-transform: uppercase;
}

.ui-featured-teaser__date {
  font-size: 26px;
  line-height: 1.24;
}

.ui-featured-teaser__excerpt {
  font-size: 20px;
  line-height: 1.24;
}
</style>
