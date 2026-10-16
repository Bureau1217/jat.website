<template>
  <nav v-if="anchors.length" class="v-anchors u-gutter-x" :class="`u-theme--${theme}`" aria-label="Sections de la page">
    <ul class="v-anchors__list u-flex u-flex--align-center u-gap-2xl">
      <li v-for="anchor in anchors" :key="anchor.id">
        <a
          :href="`#${anchor.id}`"
          class="v-anchors__link"
          :class="{ 'is-active': anchor.id === activeId }"
          :aria-current="anchor.id === activeId ? 'location' : undefined"
        >{{ anchor.label }}</a>
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

// Too many sections for the width: scroll sideways rather than wrap.
.v-anchors__list {
  height: var(--anchors-height);
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;
}

.v-anchors__link {
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &:hover,
  &.is-active {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }
}
</style>
