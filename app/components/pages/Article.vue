<template>
  <article v-if="page.article" class="v-page-article">
    <UiImage v-if="page.article.cover" :file="page.article.cover" cover class="v-page-article__cover" />

    <h1 class="v-page-article__title u-gutter-x">{{ page.title }}</h1>
    <p v-if="page.article.subtitle" class="v-page-article__subtitle u-gutter-x">{{ page.article.subtitle }}</p>

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
 * filling the first screen, a title bar, a subtitle bar, then the text on
 * about 60 % of the width (gallery beside it). No category nor date: the
 * mockup shows none.
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

// Title bar then subtitle bar, on the section's gradient and its reverse.
.v-page-article__title {
  padding-block: var(--spacing-4xl);
  background: var(--theme-gradient);
  font-size: 72px;
  line-height: 1.07;
  text-transform: uppercase;

  @media (max-width: $breakpoint-mobile) {
    font-size: 36px;
  }
}

.v-page-article__subtitle {
  padding-block: var(--spacing-3xl);
  background: var(--theme-bar-gradient);
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
