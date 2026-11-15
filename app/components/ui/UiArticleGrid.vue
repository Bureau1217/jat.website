<template>
  <div v-if="articles.length" class="ui-article-grid u-flex u-flex--column u-gap-4xl">
    <ul class="ui-article-grid__grid">
      <li v-for="article in articles.slice(0, count)" :key="article.id">
        <UiTeaserCard :teaser="articleTeaser(article)" />
      </li>
    </ul>
    <button v-if="articles.length > count" type="button" class="ui-article-grid__more" @click="count += PAGE_SIZE">
      {{ t('charger +') }}
    </button>
  </div>
</template>

<script setup lang="ts">
/** The blog articles, "À la une" first, then most recent — Actualités block and `articles` page. */
const PAGE_SIZE = 3

const { data: allArticles } = await useArticles()
const articles = computed(() => {
  const all = allArticles.value ?? []
  return [...all.filter(article => article.isFeatured), ...all.filter(article => !article.isFeatured)]
})

const count = ref(PAGE_SIZE)
</script>

<style lang="scss" scoped>
.ui-article-grid__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6xl) var(--spacing-5xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-3xl);
  }
}

.ui-article-grid__more {
  align-self: center;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 20px;
  cursor: pointer;
}
</style>
