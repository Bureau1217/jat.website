<template>
  <PagesDefault v-if="page?.template === 'default'" :page="page" />
  <PagesEvent v-else-if="page?.template === 'event'" :page="page" />
  <PagesArticle v-else-if="page?.template === 'article'" :page="page" />
  <PagesAgenda v-else-if="page?.template === 'agenda'" :page="page" />
  <PagesArticles v-else-if="page?.template === 'articles'" :page="page" />
  <PagesPrograms v-else-if="page?.template === 'programs' || page?.template === 'program_group'" :page="page" />
  <PagesProgram v-else-if="page?.template === 'program'" :page="page" />
  <PagesTeams v-else-if="page?.template === 'teams' || page?.template === 'team'" :page="page" />
  <PagesTeamMember v-else-if="page?.template === 'team_member'" :page="page" />
  <PagesInformations v-else-if="page?.template === 'informations'" :page="page" />
  <p v-else-if="page" class="v-page-unsupported u-block">
    Le template « {{ page.template }} » n'est pas encore pris en charge.
  </p>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

const route = useRoute()
const locale = useLocale()

// Kirby page id: the URL without its /en prefix.
const path = computed(() => {
  const segments = Array.isArray(route.params.slug) ? route.params.slug : []
  return (locale.value === 'en' ? segments.slice(1) : segments).join('/')
})

const { data: page, error } = await useFetch<KqlPage>(
  () => (path.value === '' ? '/api/page' : `/api/page/${path.value}`),
  {
    query: { lang: locale },
    key: () => `page:${locale.value}:${path.value}`
  }
)

useHead({
  htmlAttrs: { lang: locale }
})

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: t(error.value.statusCode === 404 ? 'Page introuvable' : 'Erreur serveur'),
    fatal: true
  })
}

// Read by NavigationMenu, which lives outside the page.
const headerFill = useHeaderFill()
watchEffect(() => {
  const fill = page.value?.headerFill
  headerFill.value = fill ? resolveFill(fill.fill, fill.reverse) : null
})

useSeoMeta({
  title: () => page.value?.title
})
</script>
