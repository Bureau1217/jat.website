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
const locale = useLocale()

// Same request as NavigationMenu (shared key): already resolved here.
const { data: page, error } = await useCurrentPage()

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

usePageSeo(page)
</script>
