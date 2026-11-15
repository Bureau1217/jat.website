<template>
  <nav v-if="items.length" class="v-anchors u-gutter-x" :class="`u-theme--${theme}`" :aria-label="t(anchors.length ? 'Sections de la page' : 'Pages de la rubrique')">
    <ul class="v-anchors__list u-flex u-flex--align-center">
      <li v-for="item in items" :key="item.id">
        <NuxtLink
          :to="item.to"
          class="v-anchors__link u-flex u-flex--align-center u-gap-xs"
          :class="{ 'is-active': item.isActive }"
          :aria-current="item.isActive ? (anchors.length ? 'location' : 'page') : undefined"
        >
          <span class="v-anchors__marker" aria-hidden="true" />
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'
import { stripLocale } from '~~/shared/utils/locales'

/**
 * "Repères" bar under the navigation (mockup G1): the sections of the page
 * when it has named ones, else the listed subpages of its section of the
 * site (e.g. the Espaces).
 */
const props = defineProps<{
  blocks?: KqlBlock[]
}>()

const theme = usePageTheme()
const route = useRoute()
const { data: nav } = await useSiteNav()

const anchors = computed(() => sectionAnchors(props.blocks))
const activeId = ref<string | null>(null)

// Subpages of the top-level page this route belongs to.
const sectionPages = computed(() => {
  const slug = stripLocale(route.path).split('/').find(Boolean)
  const section = (nav.value ?? []).find(item => item.uri === slug)
  return section?.children ?? []
})

const items = computed(() => anchors.value.length
  ? anchors.value.map(anchor => ({
      id: anchor.id,
      label: anchor.label,
      to: { hash: `#${anchor.id}` },
      isActive: anchor.id === activeId.value
    }))
  : sectionPages.value.map(page => ({
      id: page.id,
      label: page.title,
      to: pagePath(page),
      isActive: stripLocale(route.path) === `/${page.uri}`
    })))

// The active anchor is the last section whose top has scrolled past the
// sticky bars: a thin observation band right below them.
let observer: IntersectionObserver | null = null

function observeSections(): void {
  observer?.disconnect()
  const offset = getComputedStyle(document.documentElement)
  const barsHeight = parseFloat(offset.getPropertyValue('--navigation-menu-height'))
    + parseFloat(offset.getPropertyValue('--anchors-height'))

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) activeId.value = entry.target.id
    }
  }, { rootMargin: `-${barsHeight}px 0px -60% 0px` })

  for (const anchor of anchors.value) {
    const section = document.getElementById(anchor.id)
    if (section) observer.observe(section)
  }
}

onMounted(observeSections)
watch(anchors, () => nextTick(observeSections))
onBeforeUnmount(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
// Sticks right under the navigation menu.
.v-anchors {
  position: sticky;
  top: var(--navigation-menu-height);
  z-index: 999;
  background: var(--theme-anchors-background);
  color: var(--theme-anchors-text);
}

// Right-aligned as in the mockup; too many items for the width scroll
// sideways rather than wrap.
.v-anchors__list {
  justify-content: flex-end;
  gap: var(--spacing-3xl);
  height: var(--anchors-height);
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;

  @media (max-width: $breakpoint-mobile) {
    justify-content: flex-start;
    gap: var(--spacing-xl);
  }
}

.v-anchors__link {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.28;
  text-decoration: none;
}

// Radio-like dot, filled on the current section / page.
.v-anchors__marker {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 1px solid currentColor;
  border-radius: 50%;

  .is-active & {
    background: currentColor;
  }
}
</style>
