<template>
  <div :key="locale" class="v-app u-flex u-flex--column" :class="`u-theme--${theme}`">
    <TheIntroLoader />
    <NavigationMenu />
    <Transition name="v-anchors-slide">
      <Anchors v-if="anchorsPage" :key="anchorsPage.path" :path="anchorsPage.path" :blocks="anchorsPage.blocks" />
    </Transition>
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

// The page theme on the root: running text, buttons and default fills of
// every block follow the section of the site.
const theme = usePageTheme()

// Switching language remounts the app: every interface text (t()) and data
// source re-renders in the new language, the header and footer included.
const locale = useLocale()

// The Repères bar lives here, not in the page, so it can slide between
// pages: up as soon as we leave one, down once the next is in place
// (crossfade, utils/pageTransition.ts). It belongs to site pages
// (`default` template), never the home page.
const { data: currentPage } = await useCurrentPage()
const route = useRoute()

interface AnchorsPage {
  path: string
  blocks: KqlBlock[]
}

function anchorsFor(): AnchorsPage | null {
  const page = currentPage.value
  if (!page || page.template !== 'default' || page.uri === 'home') return null
  return { path: route.path, blocks: page.blocks }
}

const anchorsPage = shallowRef<AnchorsPage | null>(anchorsFor())

function showAnchors(): void {
  if (anchorsPage.value?.path !== route.path) anchorsPage.value = anchorsFor()
}

const router = useRouter()
const nuxtApp = useNuxtApp()
const removeGuard = router.beforeEach((to, from) => {
  // A hash link within the page keeps its bar.
  if (to.path !== from.path) anchorsPage.value = null
})
const unhooks = [
  nuxtApp.hook('page:transition:finish', showAnchors),
  // No transition (first render after a language switch): show it anyway,
  // once a crossfade would have ended.
  nuxtApp.hook('page:finish', () => { setTimeout(showAnchors, PAGE_CROSSFADE_MS + 50) })
]
onBeforeUnmount(() => {
  removeGuard()
  unhooks.forEach(unhook => unhook())
})
</script>

<style lang="scss">
.v-app {
  min-height: 100vh;
  color: var(--color-text);
  background: var(--theme-page-background, var(--color-background));

  main {
    flex: 1;
  }
}

// The Repères bar slides out from under the navigation (z-index below
// it), over the page, which never moves (the bar takes no room: Anchors.vue).
// It leaves at once, quick and ease-in. It arrives once the crossfade is
// over (mounted then), 0.5 s later, sliding slowly and settling (ease-out).
.v-anchors-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.v-anchors-slide-enter-active {
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s;
}

.v-anchors-slide-enter-from,
.v-anchors-slide-leave-to {
  // 2px beyond its height: the navigation's height is fractional (fluid),
  // and an exact -100% leaves a hairline of the bar showing under it.
  transform: translateY(calc(-100% - 2px));
}
</style>
