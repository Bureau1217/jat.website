<template>
  <article v-if="page.event" class="v-page-event u-block">
    <div class="v-page-event__main u-flex u-flex--column u-gap-2xl">
      <UiImage v-if="page.event.cover" :file="page.event.cover" class="v-page-event__cover" />
      <h1>{{ page.title }}</h1>
      <UiRichText v-if="page.event.text" :html="page.event.text" />
    </div>

    <aside class="v-page-event__aside u-nested" aria-label="Informations pratiques et galerie">
      <UiAsideBox title="Informations pratiques">
        <dl class="v-page-event__infos u-flex u-flex--column u-gap-s">
          <div v-if="page.event.startDate">
            <dt>Date</dt>
            <dd>{{ formatEventDate(page.event.startDate, page.event.endDate) }}</dd>
          </div>
          <div v-if="page.event.schedule">
            <dt>Horaires</dt>
            <dd>{{ page.event.schedule }}</dd>
          </div>
          <div v-if="page.event.location">
            <dt>Lieu</dt>
            <dd>{{ page.event.location }}</dd>
          </div>
          <div v-if="page.event.categories.length">
            <dt>Catégories</dt>
            <dd>{{ page.event.categories.join(', ') }}</dd>
          </div>
        </dl>
      </UiAsideBox>
      <UiAsideGallery :images="page.event.gallery" />
    </aside>
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/**
 * Agenda entry (jat.cms `event` template), same split as its Panel view:
 * main content (cover, title, text) on the left, practical information and
 * the optional photo gallery on the right.
 */
defineProps<{
  page: KqlPage
}>()
</script>

<style lang="scss" scoped>
.v-page-event {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-5xl);
  align-items: start;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

.v-page-event__main,
.v-page-event__aside {
  min-width: 0;
}

.v-page-event__cover {
  border-radius: var(--radius-m);
}

.v-page-event__infos {
  margin: 0;

  dt {
    font-size: 13px;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
