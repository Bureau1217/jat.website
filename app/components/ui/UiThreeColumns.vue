<template>
  <div class="ui-three-columns">
    <nav v-if="summary.length" class="ui-three-columns__summary" aria-label="Sommaire">
      <ol class="u-flex u-flex--column u-gap-s">
        <li v-for="heading in summary" :key="heading.id">
          <a :href="`#${heading.id}`">{{ heading.text }}</a>
        </li>
      </ol>
    </nav>
    <div class="ui-three-columns__main u-nested">
      <Blocks :blocks="body" :files="files" :pages="pages" />
    </div>
    <aside v-if="aside.length" class="ui-three-columns__aside u-nested" aria-label="Contenus liés">
      <Blocks :blocks="aside" :files="files" :pages="pages" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import type { HeadingContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/**
 * "3 colonnes" layout of an Accordion sub-section: Sommaire (generated) ·
 * content · Contenus liés. The summary links to every Titre block of the
 * content, anchored by block id (see Heading.global.vue).
 */
const props = defineProps<{
  body: KqlBlock[]
  aside: KqlBlock[]
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const summary = computed(() => props.body
  .filter(block => block.type === 'heading')
  .map(block => ({ id: block.id, text: (block.content as unknown as HeadingContent).text })))
</script>

<style lang="scss" scoped>
.ui-three-columns {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-areas: "summary main aside";
  gap: var(--spacing-4xl);
  align-items: start;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    grid-template-areas: "summary" "main" "aside";
    gap: var(--spacing-xl);
  }
}

.ui-three-columns__summary {
  grid-area: summary;
  position: sticky;
  top: var(--spacing-5xl);
  padding-top: var(--block-spacing);
  font-size: 16px;

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: $breakpoint-mobile) {
    position: static;
  }
}

.ui-three-columns__main {
  grid-area: main;
  min-width: 0;
}

.ui-three-columns__aside {
  grid-area: aside;
  min-width: 0;
}
</style>
