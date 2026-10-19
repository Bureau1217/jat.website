<template>
  <div v-if="members.length" class="v-block-team u-block">
    <ul class="v-block-team__list">
      <li v-for="member in members" :key="member.id" class="v-block-team__member u-flex u-flex--column u-gap-xs">
        <div class="v-block-team__photo">
          <UiImage v-if="member.photo" :file="member.photo" cover />
        </div>
        <h4>{{ member.title }}</h4>
        <p v-if="member.role" class="v-block-team__detail">{{ member.role }}</p>
        <p v-if="member.instrument" class="v-block-team__detail">{{ member.instrument }}</p>
        <a v-if="member.email" :href="`mailto:${member.email}`" class="v-block-team__detail">{{ member.email }}</a>
        <a v-if="member.phone" :href="`tel:${member.phone.replace(/\s/g, '')}`" class="v-block-team__detail">{{ member.phone }}</a>
        <a v-if="member.websiteUrl" :href="member.websiteUrl" target="_blank" rel="noopener" class="v-block-team__detail">Site personnel</a>
      </li>
    </ul>
  </div>
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

.v-block-team__detail {
  font-size: 16px;
}
</style>
