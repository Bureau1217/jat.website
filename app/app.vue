<template>
  <div class="v-app u-flex u-flex--column" :class="[`u-theme--${pageTheme.theme}`, `u-fills--${pageTheme.section}`]" :style="colorStyle">
    <NavigationMenu />
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// Theme (text color, page background: base / school / news) and default
// fills of the section (navigation, hero, bars, anchors bar) follow the
// URL — set in code, not in the Panel. They sit on the whole app so every
// block, the footer included, reads the same --theme-* variables. In the
// Panel, the page picks its header fill and page background; sections and
// sub-sections their hero / bars.
const pageTheme = usePageTheme()

// The page is fetched here too (same key as pages/[...slug].vue, one
// request) so the navigation fill is known on the server, before the
// navigation renders.
const { data: page } = await useCurrentPage()
const colorStyle = computed(() => ({
  ...fillStyle(page.value?.headerFill, page.value?.headerFillReverse, 'header'),
  ...pageFillStyle(page.value?.pageFill, page.value?.pageFillReverse)
}))
</script>

<style lang="scss">
.v-app {
  min-height: 100vh;

  main {
    flex: 1;
    background: var(--theme-page-background, var(--color-background));
  }
}
</style>
