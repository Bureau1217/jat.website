<template>
  <PagesDefault v-if="page?.template === 'default'" :page="page" />
  <PagesEvent v-else-if="page?.template === 'event'" :page="page" />
  <p v-else-if="page" class="v-page-unsupported u-block">
    Le template « {{ page.template }} » n'est pas encore pris en charge.
  </p>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

const route = useRoute()
const path = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug.join('/') : ''
)

const { data: page, error } = await useFetch<KqlPage>(
  () => (path.value === '' ? '/api/page' : `/api/page/${path.value}`),
  { key: () => `page:${path.value}` }
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusCode === 404 ? 'Page introuvable' : 'Erreur serveur',
    fatal: true
  })
}

useSeoMeta({
  title: () => page.value?.title
})
</script>
