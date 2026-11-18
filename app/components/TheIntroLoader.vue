<template>
  <div v-if="!done" class="v-intro-loader" aria-hidden="true" @animationend="done = true">
    <span class="v-intro-loader__logo">JÀT</span>
  </div>
</template>

<script setup lang="ts">
/**
 * Opening screen: the home page's blue gradient with JÀT in the middle,
 * fading away onto the site. Pure CSS animation, so it runs from the first
 * paint of the server HTML, before (or without) JavaScript. Once per visit:
 * a language switch remounts the app but not this.
 */
const done = useState('intro-loader-done', () => false)

// The animation may end before hydration, its event then missed.
// After the whole animation (2.3 s + 1.6 s), with a margin.
onMounted(() => setTimeout(() => { done.value = true }, 4500))
</script>

<style lang="scss" scoped>
.v-intro-loader {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  background: linear-gradient(to top, var(--degrade-accueil)), var(--color-background);
  color: var(--theme-home-header-text);
  // The site is usable underneath while it fades.
  pointer-events: none;
  // About 4 s in all: held 2.3 s, then a slow 1.6 s fade.
  animation: v-intro-loader-out 1.6s ease-in-out 2.3s forwards;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 0.3s;
    animation-delay: 0.4s;
  }
}

.v-intro-loader__logo {
  font-family: var(--font-heading);
  font-size: fluid(96px, 220px);
  line-height: 1;
}

@keyframes v-intro-loader-out {
  to {
    visibility: hidden;
    opacity: 0;
  }
}
</style>
