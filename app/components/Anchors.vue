<template>
  <nav v-if="anchors.length" class="v-anchors u-gutter-x" :class="`u-theme--${theme}`" aria-label="Sections de la page">
    <ul class="v-anchors__list u-flex u-flex--align-center">
      <li v-for="anchor in anchors" :key="anchor.id">
        <!-- Mockup « Menu-Repères »: ○ + section name, ● on the current one. -->
        <UiDotItem :href="`#${anchor.id}`" :active="anchor.id === activeId" class="v-anchors__link">
          {{ anchor.label }}
        </UiDotItem>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  blocks?: KqlBlock[]
}>()

const theme = usePageTheme()
const anchors = computed(() => sectionAnchors(props.blocks))
const activeId = ref<string | null>(null)

// The active anchor is the last section whose top has scrolled past the
// sticky bars: a thin observation band right below them.
let observer: IntersectionObserver | null = null

function observeSections(): void {
  observer?.disconnect()
  // The heights are rem / clamp() values: resolve them to px for rootMargin.
  const barsHeight = Math.round(cssLengthToPx('calc(var(--navigation-menu-height) + var(--anchors-height))'))

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

// Centered on the page, 40px apart. Too many sections for the width:
// scroll sideways rather than wrap.
.v-anchors__list {
  height: var(--anchors-height);
  // « safe »: when the entries overflow, start from the left instead of
  // cutting the first ones off.
  justify-content: safe center;
  gap: var(--spacing-3xl);
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;

  // Scrolling list: start from the left so the first entries stay reachable.
  @media (max-width: $breakpoint-mobile) {
    justify-content: flex-start;
  }
}

// Dot + name, no underline; the other entries are slightly dimmed.
.v-anchors__link {
  @include t-small-bold;
  align-items: center;
  gap: var(--spacing-xs);
  opacity: 0.8;
  transition: opacity 0.2s ease;

  // Mockup: 16px dot for 16px text.
  :deep(.ui-dot-item__dot) {
    width: 1em;
    height: 1em;
    margin-top: 0;
  }

  &:hover,
  &.is-active {
    opacity: 1;
  }

  &:hover :deep(.ui-dot-item__label) {
    text-decoration: none;
  }
}
</style>
