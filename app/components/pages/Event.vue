<template>
  <article v-if="page.event" class="v-page-event">
    <UiImage v-if="page.event.cover" :file="page.event.cover" cover class="v-page-event__cover" />

    <UiDisclosure :title="page.title" :collapsible="false">
      <div class="v-page-event__columns">
        <UiKeyInfo v-if="keyInfo.length" :items="keyInfo" class="v-page-event__side" />
        <UiRichText v-if="page.event.text" :html="page.event.text" wide class="v-page-event__text" />
        <aside v-if="page.event.gallery.length" class="v-page-event__aside u-nested" :aria-label="t('Galerie')">
          <UiAsideGallery :images="page.event.gallery" />
        </aside>
      </div>
    </UiDisclosure>
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

/**
 * Agenda entry (jat.cms `event` template), mockup B10 + B09: the visual
 * full width, the title bar, then the "fiche" — key info · text · photos.
 */
const props = defineProps<{
  page: KqlPage
}>()

const keyInfo = computed(() => {
  const event = props.page.event
  if (!event) return []
  return [
    { label: t('Date'), value: formatEventDate(event.startDate, event.endDate) },
    { label: t('Horaires'), value: event.schedule },
    { label: t('Lieu'), value: event.location },
    { label: t('Catégories'), value: event.categories.join(', ') }
  ]
    .filter((item): item is { label: string, value: string } => !!item.value)
    .map(item => ({ label: item.label, html: `<p>${escapeHtml(item.value)}</p>` }))
})
</script>

<style lang="scss" scoped>
.v-page-event__cover {
  aspect-ratio: 1440 / 548;

  @media (max-width: $breakpoint-mobile) {
    aspect-ratio: 4 / 3;
  }
}

// Same columns as an Accordion "3 colonnes" sub-section.
.v-page-event__columns {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-areas: "side main aside";
  gap: var(--spacing-4xl);
  align-items: start;
  padding: var(--spacing-4xl) var(--gutter) var(--block-spacing);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    grid-template-areas: "side" "main" "aside";
    gap: var(--spacing-2xl);
  }
}

.v-page-event__side {
  grid-area: side;
}

.v-page-event__text {
  grid-area: main;
  min-width: 0;

  // Writer HTML: v-html content, hence :deep().
  :deep(p),
  :deep(li) {
    font-size: 20px;
    line-height: 1.24;
  }
}

.v-page-event__aside {
  grid-area: aside;
  min-width: 0;
}
</style>
