<template>
  <article v-if="page.article" class="v-page-article">
    <UiImage v-if="page.article.cover" :file="page.article.cover" cover class="v-page-article__cover" />

    <header class="v-page-article__header u-gutter-x u-flex u-flex--column u-gap-l">
      <p v-if="page.article.categories.length || page.article.publishedAt" class="v-page-article__meta u-flex u-flex--wrap u-gap-m">
        <span v-for="category in page.article.categories" :key="category" class="v-page-article__category"># {{ category }}</span>
        <time v-if="page.article.publishedAt" :datetime="page.article.publishedAt">{{ formatEventDate(page.article.publishedAt) }}</time>
      </p>
      <h1 class="v-page-article__title">{{ page.title }}</h1>
      <p v-if="page.article.subtitle" class="v-page-article__subtitle">{{ page.article.subtitle }}</p>
    </header>

    <div class="v-page-article__body u-block">
      <UiRichText v-if="page.article.text" :html="page.article.text" wide class="v-page-article__text" />
      <aside v-if="page.article.gallery.length" class="v-page-article__aside u-nested" :aria-label="t('Galerie')">
        <UiAsideGallery :images="page.article.gallery" />
      </aside>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/**
 * Actualités article (jat.cms `article` template), mockup B18: the visual
 * filling the first screen, the title on the page's bar gradient with the
 * subtitle, then the text on about 60 % of the width (gallery beside it).
 */
defineProps<{
  page: KqlPage
}>()
</script>

<style lang="scss" scoped>
.v-page-article__cover {
  height: calc(100svh - var(--navigation-menu-height));

  @media (max-width: $breakpoint-mobile) {
    height: auto;
    aspect-ratio: 4 / 3;
  }
}

.v-page-article__header {
  padding-block: var(--spacing-3xl);
  background: var(--theme-bar-gradient);
}

.v-page-article__meta {
  font-size: 20px;
}

.v-page-article__category {
  font-family: var(--font-accent);
  font-style: italic;
}

.v-page-article__title {
  font-size: 72px;
  line-height: 1.07;
  text-transform: uppercase;

  @media (max-width: $breakpoint-mobile) {
    font-size: 36px;
  }
}

.v-page-article__subtitle {
  font-weight: 700;
  font-size: 40px;
  line-height: 1.12;
  letter-spacing: -0.02em;

  @media (max-width: $breakpoint-mobile) {
    font-size: 26px;
  }
}

.v-page-article__body {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: var(--spacing-5xl);
  align-items: start;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

// Writer HTML: v-html content, hence :deep().
.v-page-article__text :deep(p) {
  margin-bottom: var(--spacing-xs);
  font-size: 20px;
  line-height: 1.24;
}

.v-page-article__aside {
  min-width: 0;
}
</style>
