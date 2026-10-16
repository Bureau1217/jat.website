<template>
  <div v-if="members.length" class="v-block-team u-block">
    <ul class="v-block-team__list">
      <li v-for="member in members" :key="member.id" class="v-block-team__member u-flex u-flex--column u-gap-xs">
        <div class="v-block-team__photo">
          <UiImage v-if="member.photo" :file="member.photo" cover />
        </div>
        <h4>{{ member.title }}</h4>
        <p v-if="member.role" class="v-block-team__role">{{ member.role }}</p>
        <a v-if="member.contact" :href="member.contact" class="v-block-team__contact">{{ contactLabel(member.contact) }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { TeamContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

/**
 * Members of every published team, or only the teams whose "Type d'équipe"
 * (jat.cms `team_type`) matches the block's scope.
 */
const props = defineProps<{
  block: KqlBlock<TeamContent>
}>()

const { data: teams } = await useTeams()
const members = computed(() => (teams.value ?? [])
  .filter(team => props.block.content.scope === 'all' || team.teamType === props.block.content.scope)
  .flatMap(team => team.members))

/** "mailto:a@b.ch" → "a@b.ch", "tel:+41…" → "+41…". */
function contactLabel(contact: string): string {
  return contact.replace(/^(mailto|tel):/, '')
}
</script>

<style lang="scss" scoped>
.v-block-team__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-2xl) var(--spacing-xl);
}

.v-block-team__photo {
  aspect-ratio: 1;
  margin-bottom: var(--spacing-xs);
  background: var(--color-surface);
  border-radius: var(--radius-m);
  overflow: hidden;
}

.v-block-team__role,
.v-block-team__contact {
  font-size: 16px;
}
</style>
