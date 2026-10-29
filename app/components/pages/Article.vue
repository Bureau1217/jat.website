<template>
  <article v-if="page.article" class="v-page-article">
    <UiImage v-if="page.article.cover" :file="page.article.cover" sizes="100vw" eager class="v-page-article__cover" />
    <UiBar level="h1" :title="page.title" />

    <div class="v-page-article__body u-block">
      <div class="v-page-article__grid">
        <div class="v-page-article__main u-flex u-flex--column u-gap-2xl">
          <p v-if="page.article.categories.length || page.article.publishedAt" class="v-page-article__meta u-flex u-flex--wrap">
            <span v-for="category in page.article.categories" :key="category" class="v-page-article__category"># {{ category }}</span>
            <time v-if="page.article.publishedAt" :datetime="page.article.publishedAt">{{ formatEventDate(page.article.publishedAt) }}</time>
          </p>
          <p v-if="page.article.subtitle" class="v-page-article__subtitle">{{ page.article.subtitle }}</p>
          <UiRichText v-if="page.article.text" :html="page.article.text" class="v-page-article__text" />
        </div>
      </div>
    </div>

    <div v-if="page.article.gallery.length" class="v-page-article__gallery u-block">
      <UiCarousel :images="page.article.gallery" variant="inline" />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/**
 * « Actualités » blog article (jat.cms `article` template), as in the
 * mockup: photo across the page, title bar, then # categories and date,
 * subtitle and text on three of the four columns; the optional photo
 * gallery below as a carousel.
 */
defineProps<{
  page: KqlPage
}>()
</script>

<style lang="scss" scoped>
.v-page-article__cover {
  width: 100%;
  max-height: 80vh;
  object-fit: cover;
}

.v-page-article__body {
  container-type: inline-size;
  padding-top: calc(2 * var(--block-spacing));
}

.v-page-article__grid {
  @include grid-columns;
}

.v-page-article__main {
  min-width: 0;

  @include container-wide {
    grid-column: 1 / span 3;
  }
}

.v-page-article__meta {
  @include t-p-medium;
  gap: var(--spacing-xs) var(--spacing-xl);
}

.v-page-article__category {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.v-page-article__subtitle {
  @include t-h3;
}

.v-page-article__text {
  @include t-p;
}

// Space before the footer, after whichever comes last.
.v-page-article > :last-child {
  padding-bottom: var(--space-section);
}
</style>
