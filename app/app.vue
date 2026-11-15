<template>
  <div :key="locale" class="v-app u-flex u-flex--column" :class="`u-theme--${theme}`">
    <NavigationMenu />
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// The page theme on the root: running text, buttons and default fills of
// every block follow the section of the site.
const theme = usePageTheme()

// Switching language remounts the app: every interface text (t()) and data
// source re-renders in the new language, the header and footer included.
const locale = useLocale()
</script>

<style lang="scss">
.v-app {
  min-height: 100vh;
  color: var(--color-text);

  main {
    flex: 1;
  }
}
</style>
