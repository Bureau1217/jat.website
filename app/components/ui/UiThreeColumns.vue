<template>
  <div class="ui-three-columns">
    <div class="ui-three-columns__grid">
      <nav v-if="summary.length" class="ui-three-columns__summary" aria-label="Sommaire">
        <ol class="u-flex u-flex--column">
          <li v-for="entry in summary" :key="entry.id" class="ui-three-columns__entry">
            <UiDotItem :href="`#${entry.id}`" :active="entry.id === activeId">{{ entry.text }}</UiDotItem>
          </li>
        </ol>
      </nav>
      <div class="ui-three-columns__main u-nested u-flex u-flex--column">
        <Blocks :blocks="body" :files="files" :pages="pages" />
      </div>
      <aside v-if="aside.length" class="ui-three-columns__aside u-nested u-flex u-flex--column u-gap-4xl" aria-label="Contenus liés">
        <Blocks :blocks="aside" :files="files" :pages="pages" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeadingContent, ParagraphContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/**
 * "3 colonnes" layout of an Accordion sub-section, on the 4-column grid:
 * Sommaire (1 col) · content (2 cols) · Contenus liés (1 col). The summary
 * has one entry per title of the content — Paragraph titles and Titre
 * blocks — each anchored by its block id (see Paragraph / Heading).
 */
const props = defineProps<{
  body: KqlBlock[]
  aside: KqlBlock[]
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

provideNestedBlocks()

const summary = computed(() => props.body
  .map((block) => {
    if (block.type === 'paragraph') return { id: block.id, text: (block.content as unknown as ParagraphContent).heading?.trim() ?? '' }
    if (block.type === 'heading') return { id: block.id, text: (block.content as unknown as HeadingContent).text?.trim() ?? '' }
    return { id: block.id, text: '' }
  })
  .filter(entry => entry.text !== ''))

// Active entry: the last title scrolled past the sticky bars.
const activeId = ref<string | null>(null)
let observer: IntersectionObserver | null = null

function observeTitles(): void {
  observer?.disconnect()
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) activeId.value = entry.target.id
    }
  }, { rootMargin: '-20% 0px -70% 0px' })
  for (const entry of summary.value) {
    const title = document.getElementById(entry.id)
    if (title) observer.observe(title)
  }
}

onMounted(observeTitles)
watch(summary, () => nextTick(observeTitles))
onBeforeUnmount(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
// Lays out from its own width (container query): stacks when narrow.
.ui-three-columns {
  container-type: inline-size;
}

.ui-three-columns__grid {
  @include grid-columns;
  align-items: start;
}

.ui-three-columns__summary {
  @include t-link;

  @include container-wide {
    position: sticky;
    top: calc(var(--navigation-menu-height) + var(--anchors-height) + var(--spacing-xl));
  }
}

// Entries separated by thin rules, as in the mockup menu.
.ui-three-columns__entry {
  padding-block: var(--spacing-s);
  border-bottom: 1px solid currentColor;
}

.ui-three-columns__main {
  // Mockup: 48px between two titled blocks of the middle column.
  gap: calc(1.5 * var(--space-stack));
  min-width: 0;

  @include container-wide {
    grid-column: 2 / span 2;
  }
}

.ui-three-columns__aside {
  min-width: 0;

  @include container-wide {
    grid-column-start: 4;
  }
}
</style>
