<template>
  <PagesDefault v-if="page?.template === 'default'" :page="page" />
  <PagesEvent v-else-if="page?.template === 'event'" :page="page" />
  <PagesArticle v-else-if="page?.template === 'article'" :page="page" />
  <p v-else-if="page" class="v-page-unsupported u-block">
    Le template « {{ page.template }} » n'est pas encore pris en charge.
  </p>
</template>

<script setup lang="ts">
// Same request as app.vue (shared key): already resolved when this renders.
const { data: page, error } = await useCurrentPage()

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusCode === 404 ? 'Page introuvable' : 'Erreur serveur',
    fatal: true
  })
}

// Title, description, canonical, Open Graph — see usePageSeo.ts.
usePageSeo(page)
</script>
