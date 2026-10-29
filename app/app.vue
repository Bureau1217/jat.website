<template>
  <div class="v-app u-flex u-flex--column" :class="`u-theme--${theme}`" :style="colorStyle">
    <NavigationMenu />
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// The page is fetched here, before the navigation renders, so the theme
// picked in the Panel is known on the server too (pages/[...slug].vue
// reuses the same request). The theme sits on the whole app so every
// block, the footer included, reads the same --theme-* variables.
const { data: page } = await useCurrentPage()
const pickedTheme = usePickedPageTheme()
watch(() => page.value?.theme, (picked) => {
  pickedTheme.value = isPageTheme(picked) ? picked : null
}, { immediate: true })

const theme = usePageTheme()

// « Couleurs » picked on the page in the Panel: override the theme's
// navigation, hero and bar fills (and/or flip them) for the whole page.
const colorStyle = computed(() => {
  const colors = page.value?.colors
  if (!colors) return undefined
  return {
    ...fillStyle(colors.header, colors.headerReverse, 'header'),
    ...fillStyle(colors.hero, colors.heroReverse, 'hero'),
    ...fillStyle(colors.bar, colors.barReverse, 'bar')
  }
})
</script>

<style lang="scss">
.v-app {
  min-height: 100vh;

  main {
    flex: 1;
  }
}
</style>
