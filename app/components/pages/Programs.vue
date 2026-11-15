<template>
  <article class="v-page-programs">
    <UiPageHero :title="page.title" />
    <div class="v-page-programs__groups">
      <UiDisclosure v-for="group in groups" :key="group.id" :title="group.title" open>
        <ul class="v-page-programs__list u-gutter-x">
          <li v-for="program in group.children" :key="program.id" class="v-page-programs__item">
            <NuxtLink :to="pagePath(program)" class="v-page-programs__title">{{ program.title }}</NuxtLink>
            <UiRichText v-if="program.description" :html="program.description" class="v-page-programs__description" />
          </li>
        </ul>
      </UiDisclosure>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/**
 * Courses data pages: `programs` (every category with its courses) and
 * `program_group` (one category) — a bar per category over its courses.
 */
const props = defineProps<{
  page: KqlPage
}>()

const groups = computed(() => (props.page.template === 'programs'
  ? props.page.children.filter(group => group.children.length)
  : [{ id: props.page.id, title: props.page.title, children: props.page.children }]))
</script>

<style lang="scss" scoped>
.v-page-programs__groups {
  padding-block: var(--block-spacing);
}

.v-page-programs__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-4xl) var(--spacing-5xl);
  padding-block: var(--spacing-4xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

.v-page-programs__item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);
  padding-top: var(--spacing-m);
  border-top: 1px solid currentColor;
}

.v-page-programs__title {
  font-family: var(--font-heading);
  font-size: 32px;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

// Writer HTML: v-html content, hence :deep().
.v-page-programs__description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;

  :deep(p) {
    font-size: 18px;
    line-height: 1.24;
  }
}
</style>
