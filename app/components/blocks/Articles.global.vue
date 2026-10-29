<template>
  <div v-if="featured || others.length" class="v-block-articles u-block u-flex u-flex--column u-flex--align-center">
    <UiFeaturedCard
      v-if="featured"
      class="v-block-articles__featured"
      :to="pagePath(featured)"
      :title="featured.title"
      :cover="featured.cover"
      :date="articleDate(featured)"
      :excerpt="featured.subtitle || featured.excerpt"
    />
    <ul v-if="shown.length" class="v-block-articles__list">
      <li v-for="article in shown" :key="article.id">
        <UiCard
          :to="pagePath(article)"
          :title="article.title"
          :cover="article.cover"
          :categories="article.categories"
          :date="articleDate(article)"
          :excerpt="article.subtitle || article.excerpt"
        />
      </li>
    </ul>
    <UiButton v-if="shown.length < others.length" variant="secondary" @click="count += PAGE_SIZE">
      charger +
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import type { KqlArticle } from '~~/shared/types/kql'

/**
 * « Actualité » of the mockup: the article ticked « À la une » in large,
 * then the latest articles, three at a time. The block has no options —
 * articles come from the « Actualités » data page (blog).
 */
const PAGE_SIZE = 3

const { data: articles } = await useArticles()

const featured = computed(() => (articles.value ?? []).find(article => article.isFeatured) ?? null)
const others = computed(() => (articles.value ?? []).filter(article => article !== featured.value))

const count = ref(PAGE_SIZE)
const shown = computed(() => others.value.slice(0, count.value))

function articleDate(article: KqlArticle): string {
  return formatEventDate(article.publishedAt)
}
</script>

<style lang="scss" scoped>
// Lays out from its own width (container query), not the viewport.
.v-block-articles {
  container-type: inline-size;
  gap: calc(2 * var(--block-spacing));
}

.v-block-articles__featured,
.v-block-articles__list {
  width: 100%;
}

.v-block-articles__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-4xl) var(--grid-gap);

  @include container-wide {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
