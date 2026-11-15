<template>
  <article v-if="page.article" class="v-page-article u-block">
    <div class="v-page-article__main u-flex u-flex--column u-gap-2xl">
      <UiImage v-if="page.article.cover" :file="page.article.cover" class="v-page-article__cover" />
      <div class="u-flex u-flex--column u-gap-s">
        <p v-if="page.article.categories.length" class="v-page-article__categories">
          <span v-for="category in page.article.categories" :key="category"># {{ category }}</span>
        </p>
        <h1 class="v-page-article__title">{{ page.title }}</h1>
        <p v-if="page.article.publishedAt" class="v-page-article__date">
          <time :datetime="page.article.publishedAt">{{ formatEventDate(page.article.publishedAt) }}</time>
        </p>
      </div>
      <p v-if="page.article.subtitle" class="v-page-article__subtitle">{{ page.article.subtitle }}</p>
      <UiRichText v-if="page.article.text" :html="page.article.text" class="v-page-article__text" />
    </div>

    <aside v-if="page.article.gallery.length" class="v-page-article__aside u-nested" :aria-label="t('Galerie')">
      <UiAsideGallery :images="page.article.gallery" />
    </aside>
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/**
 * Actualités article (jat.cms `article` template), mockup B18: visual,
 * title, chapô (subtitle), text — and the optional gallery on the right,
 * like an Agenda event.
 */
defineProps<{
  page: KqlPage
}>()
</script>

<style lang="scss" scoped>
.v-page-article {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-5xl);
  align-items: start;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

.v-page-article__main,
.v-page-article__aside {
  min-width: 0;
}

.v-page-article__categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  font-family: var(--font-accent);
  font-style: italic;
  font-size: 20px;
}

.v-page-article__title {
  text-transform: uppercase;
}

.v-page-article__date {
  font-size: 20px;
}

// Chapô: the lead size of the Paragraph block.
.v-page-article__subtitle {
  font-size: 26px;
  line-height: 1.24;
}

.v-page-article__text :deep(p) {
  font-size: 20px;
  line-height: 1.24;
}
</style>
