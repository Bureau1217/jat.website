<template>
  <div class="v-app u-flex u-flex--column">
    <TheHeader />
    <main>
      <NuxtPage />
    </main>
    <TheFooter />
  </div>
</template>

<style lang="scss">
.v-app {
  min-height: 100vh;

  main {
    flex: 1;
  }
}
</style>
