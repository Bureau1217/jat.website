<template>
  <div class="v-block-accordion">
    <details
      v-for="(item, index) in items"
      :key="index"
      class="v-block-accordion__item"
      :style="item.style"
      @toggle="onToggle(index, $event)"
    >
      <UiBar as="summary" level="h3" :title="item.heading" toggle :open="openItems.has(index)" />

      <div class="v-block-accordion__content">
        <!-- 3 colonnes: the sub-section title, set large, opens the content
             (mockup: name in Gaya, its acronym « [AMP] » in Animo top right). -->
        <div v-if="item.isThreeColumns" class="v-block-accordion__hero u-gutter-x" aria-hidden="true">
          <p class="v-block-accordion__hero-inner">
            <span v-if="item.acronym" class="v-block-accordion__acronym">[{{ item.acronym }}]</span>
            <span class="v-block-accordion__name">{{ item.name }}</span>
          </p>
        </div>
        <div class="v-block-accordion__body u-gutter-x">
          <UiThreeColumns
            v-if="item.isThreeColumns"
            :body="item.blocks"
            :aside="item.aside"
            :files="files"
            :pages="pages"
          />
          <UiTwoColumns v-else>
            <div class="u-nested u-flex u-flex--column u-gap-stack">
              <Blocks :blocks="item.blocks" :files="files" :pages="pages" />
            </div>
          </UiTwoColumns>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { AccordionContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/**
 * Sous-sections, each opened by a UiBar (h3 + « ± »). « Simple »: its
 * blocks on the ¾ column; « 3 colonnes »: the title set large, then
 * Sommaire · content · Contenus liés. A sub-section can pick a named fill
 * (« dégradé » / « aplat »), otherwise the page theme's bar fill applies.
 */
const props = defineProps<{
  block: KqlBlock<AccordionContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

provideNestedBlocks()

// « AMP – Artiste Musicien·ne Professionnel·le » → acronym « AMP » + name,
// shown apart in the large title (the bar keeps the full heading).
const ACRONYM_HEADING = /^\s*([A-ZÀ-Ý0-9]{2,8})\s*[–—-]\s*(.+)$/

const items = computed(() => (props.block.content.items ?? []).map((item) => {
  const match = item.heading.match(ACRONYM_HEADING)
  return {
    heading: item.heading,
    acronym: match?.[1] ?? null,
    name: match?.[2] ?? item.heading,
    isThreeColumns: item.layout === 'three_columns',
    blocks: parseKqlBlocks(item.body),
    aside: parseKqlBlocks(item.aside),
    style: fillStyle(item.fill, item.fill_reverse, 'bar')
  }
}))

// Native <details> keeps its own open state; mirror it for the « ± » icon.
const openItems = ref(new Set<number>())
function onToggle(index: number, event: Event): void {
  const next = new Set(openItems.value)
  if ((event.target as HTMLDetailsElement).open) next.add(index)
  else next.delete(index)
  openItems.value = next
}
</script>

<style lang="scss" scoped>
.v-block-accordion__content {
  padding-bottom: var(--space-section);
}

// Mockup (Se former, AMP): a 580px band at 1440px on the hero fill; the
// name in Gaya ~150px on a block ~968px wide, centered, the acronym in
// Animo at its top right.
.v-block-accordion__hero {
  // Same height as the mockup band even for a one-word name (« Calendrier »),
  // the title centered in it.
  display: flex;
  align-items: center;
  min-height: fluid(240px, 580px);
  padding-block: fluid(24px, 40px);
  @include fill-background(hero);
}

.v-block-accordion__hero-inner {
  position: relative;
  width: min(100%, #{scaled(968px)});
  margin-inline: auto;
}

.v-block-accordion__name {
  @include t-signature;
  display: block;
}

.v-block-accordion__acronym {
  @include t-acronym;
  display: block;
  text-align: right;

  @media (min-width: $breakpoint-mobile) {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.v-block-accordion__body {
  padding-top: var(--space-bar);
}
</style>
