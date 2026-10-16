<template>
  <div class="v-block-columns-3 u-block">
    <nav v-if="summary.length" class="v-block-columns-3__summary" aria-label="Sommaire">
      <ol class="u-flex u-flex--column u-gap-s">
        <li v-for="heading in summary" :key="heading.id" :class="`v-block-columns-3__summary-item--${heading.level}`">
          <a :href="`#${heading.id}`">{{ heading.text }}</a>
        </li>
      </ol>
    </nav>
    <div class="v-block-columns-3__main u-nested">
      <Blocks :blocks="body" :files="files" :pages="pages" />
    </div>
    <aside v-if="aside.length" class="v-block-columns-3__aside u-nested" aria-label="Contenus liés">
      <Blocks :blocks="aside" :files="files" :pages="pages" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import type { Columns3Content, HeadingContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/**
 * Sommaire (generated) · Contenu principal · Contenus liés. The summary
 * links to every Titre block of the main content, anchored by block id
 * (see Heading.global.vue).
 */
const props = defineProps<{
  block: KqlBlock<Columns3Content>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const body = computed(() => parseKqlBlocks(props.block.content.body))
const aside = computed(() => parseKqlBlocks(props.block.content.aside))

const summary = computed(() => body.value
  .filter(block => block.type === 'heading')
  .map((block) => {
    const { text, level } = block.content as unknown as HeadingContent
    return { id: block.id, text, level }
  }))
</script>

<style lang="scss" scoped>
.v-block-columns-3 {
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

.v-block-columns-3__summary {
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

.v-block-columns-3__summary-item--h3,
.v-block-columns-3__summary-item--h4 {
  padding-left: var(--spacing-m);
}

.v-block-columns-3__main {
  grid-area: main;
  min-width: 0;
}

.v-block-columns-3__aside {
  grid-area: aside;
  min-width: 0;
}
</style>
