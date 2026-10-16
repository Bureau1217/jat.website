<template>
  <NuxtLink :to="pagePath(event)" class="ui-event-card u-flex u-flex--column u-gap-s">
    <div class="ui-event-card__media">
      <UiImage v-if="event.cover" :file="event.cover" cover />
    </div>
    <div class="ui-event-card__meta u-flex u-gap-xs u-flex--wrap">
      <span v-if="event.startDate">{{ formatEventDate(event.startDate, event.endDate) }}</span>
      <span v-for="category in event.categories" :key="category" class="ui-event-card__category">{{ category }}</span>
    </div>
    <h3 class="ui-event-card__title">{{ event.title }}</h3>
    <p v-if="event.location" class="ui-event-card__location">{{ event.location }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { KqlEvent, KqlPageRef } from '~~/shared/types/kql'

/** Teaser of an Agenda event — shared by the News and "Actualités en lien" blocks. */
defineProps<{
  event: KqlEvent | KqlPageRef
}>()
</script>

<style lang="scss" scoped>
.ui-event-card {
  text-decoration: none;

  &:hover .ui-event-card__title {
    text-decoration: underline;
  }
}

.ui-event-card__media {
  aspect-ratio: 4 / 3;
  background: var(--color-surface);
  border-radius: var(--radius-m);
  overflow: hidden;
}

.ui-event-card__meta {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
}

.ui-event-card__category {
  &::before {
    content: '·';
    margin-right: var(--spacing-xs);
  }
}

.ui-event-card__title {
  font-size: 22px;
}

.ui-event-card__location {
  font-size: 16px;
}
</style>
