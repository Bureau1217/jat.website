<template>
  <article class="v-page-teams">
    <UiPageHero :title="page.title" :signature="page.template === 'team' ? page.parentTitle : null" />
    <div class="v-page-teams__teams">
      <UiDisclosure v-for="team in teams" :key="team.uuid" :title="team.title" open>
        <UiTeamTable :members="team.members" class="u-block" />
      </UiDisclosure>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/**
 * Team data pages: `teams` (every team) and `team` (one team), a bar per
 * team over its members table.
 */
const props = defineProps<{
  page: KqlPage
}>()

const { data: allTeams } = await useTeams()
const teams = computed(() => (allTeams.value ?? []).filter(team => (props.page.template === 'team'
  ? team.uuid === props.page.uuid
  : props.page.children.some(child => child.uuid === team.uuid))))
</script>

