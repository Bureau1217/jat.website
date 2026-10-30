<template>
  <div class="v-app u-flex u-flex--column" :class="`u-theme--${theme}`" :style="headerStyle">
    <NavigationMenu />
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// The theme (navigation, hero and bar fills, text, anchors bar, page
// background) follows the page's section in the URL — set in code, not in
// the Panel. It sits on the whole app so every block, the footer included,
// reads the same --theme-* variables. In the Panel, the page can only pick
// its navigation fill; sections and sub-sections pick their hero / bars.
const theme = usePageTheme()

// The page is fetched here too (same key as pages/[...slug].vue, one
// request) so the navigation fill is known on the server, before the
// navigation renders.
const { data: page } = await useCurrentPage()
const headerStyle = computed(() =>
  fillStyle(page.value?.headerFill, page.value?.headerFillReverse, 'header')
)
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
