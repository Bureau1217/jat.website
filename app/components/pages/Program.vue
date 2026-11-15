<template>
  <article class="v-page-program">
    <UiPageHero :title="page.title" :signature="page.parentTitle" />

    <div v-if="page.program?.description" class="v-page-program__row u-block">
      <h2 class="v-page-program__label">{{ t('Descriptif') }}</h2>
      <UiRichText :html="page.program.description" wide class="v-page-program__lead" />
    </div>

    <div v-if="page.program?.outline" class="v-page-program__row u-block">
      <h2 class="v-page-program__label">{{ t('Déroulé') }}</h2>
      <UiRichText :html="page.program.outline" wide class="v-page-program__text" />
    </div>

    <UiDisclosure v-if="teachers.length" :title="t('Enseignant·es')" open>
      <UiTeamTable :members="teachers" class="u-block" />
    </UiDisclosure>
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/**
 * A course (jat.cms `program` template), its category (parent page) as the
 * banner signature: description, outline, and its
 * teachers — the published team members whose "Cours" field holds it, as
 * the Panel shows them (reverse relation).
 */
const props = defineProps<{
  page: KqlPage
}>()

const { data: teams } = await useTeams()
const teachers = computed(() => (teams.value ?? [])
  .flatMap(team => team.members)
  .filter(member => member.courses.some(course => course.id === props.page.id)))
</script>

<style lang="scss" scoped>
// Same ¼ / ¾ split as the Paragraph block.
.v-page-program__row {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: var(--spacing-xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-m);
  }
}

.v-page-program__label {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 40px;
  line-height: 1.12;
  letter-spacing: -0.02em;

  @media (max-width: $breakpoint-mobile) {
    font-size: 28px;
  }
}

// Writer HTML: v-html content, hence :deep().
.v-page-program__lead :deep(p) {
  font-size: 26px;
  line-height: 1.24;
}

.v-page-program__text :deep(p),
.v-page-program__text :deep(li) {
  font-size: 20px;
  line-height: 1.24;
}
</style>
