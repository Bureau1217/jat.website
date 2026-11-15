<template>
  <UiTeamTable v-if="members.length" :members="members" class="u-block" />
</template>

<script setup lang="ts">
import type { TeamContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/** Members of the teams picked in the block, or of every published team when none is picked. */
const props = defineProps<{
  block: KqlBlock<TeamContent>
}>()

const { data: teams } = await useTeams()
const members = computed(() => {
  const picked = props.block.content.teams ?? []
  return (teams.value ?? [])
    .filter(team => picked.length === 0 || picked.includes(team.uuid))
    .flatMap(team => team.members)
})
</script>
