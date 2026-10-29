<template>
  <div v-if="members.length" class="v-block-team" :class="{ 'u-block': !isNested }">
    <component :is="isNested ? 'div' : UiTwoColumns">
      <ul class="v-block-team__list">
        <li v-for="member in members" :key="member.id" class="v-block-team__row">
          <span class="v-block-team__name">{{ member.title }}</span>
          <span class="v-block-team__detail">{{ member.instrument || member.role || '' }}</span>
          <span class="v-block-team__detail u-flex u-flex--column">
            <a v-if="member.email" :href="`mailto:${member.email}`">contacter</a>
            <a v-if="member.phone" :href="`tel:${member.phone.replace(/\s/g, '')}`">{{ member.phone }}</a>
            <a v-if="member.websiteUrl" :href="member.websiteUrl" target="_blank" rel="noopener">Site personnel</a>
          </span>
        </li>
      </ul>
    </component>
  </div>
</template>

<script setup lang="ts">
import type { TeamContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'
import UiTwoColumns from '~/components/ui/UiTwoColumns.vue'

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

const isNested = useIsNested()
</script>

<style lang="scss" scoped>
// Mockup « Équipe administrative »: one row per person — name · role ·
// contact — on the ¾ column, rows separated by rules. Lays out from the
// width of its list (container query): one cell per line when narrow.
.v-block-team__list {
  container-type: inline-size;
}

.v-block-team__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: var(--spacing-xxs);
  column-gap: var(--grid-gap);
  padding-block: var(--spacing-m);
  border-bottom: 1px solid currentColor;

  &:first-child {
    padding-top: 0;
  }

  @container (width > #{rem(560px)}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.v-block-team__name {
  @include t-label;
}

.v-block-team__detail {
  @include t-p;
}
</style>
