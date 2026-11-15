<template>
  <article class="v-page-team-member">
    <UiPageHero :title="page.title" :signature="member?.instrument || member?.role" />
    <UiTeamTable v-if="member" :members="[member]" open class="u-block" />
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/** A team member (jat.cms `team_member` template): their row, profile open. */
const props = defineProps<{
  page: KqlPage
}>()

const { data: teams } = await useTeams()
const member = computed(() => (teams.value ?? [])
  .flatMap(team => team.members)
  .find(candidate => candidate.id === props.page.id) ?? null)
</script>
