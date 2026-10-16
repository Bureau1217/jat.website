<template>
  <header class="v-header" :class="{ 'is-open': isOpen }">
    <div class="v-header__bar u-flex u-flex--align-center u-flex--justify-between u-gutter-x">
      <NuxtLink to="/" class="v-header__logo" @click="isOpen = false">JAT</NuxtLink>
      <button
        type="button"
        class="v-header__burger"
        :aria-expanded="isOpen"
        aria-controls="v-header-nav"
        :aria-label="isOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="isOpen = !isOpen"
      >
        <span class="v-header__burger-icon" :class="{ 'is-open': isOpen }">
          <span /><span /><span />
        </span>
      </button>
    </div>

    <transition name="v-header-nav">
      <nav v-if="isOpen" id="v-header-nav" class="v-header__nav u-gutter-x" aria-label="Navigation principale">
        <ul class="u-flex u-flex--column u-gap-m">
          <li v-for="item in navItems" :key="item.id">
            <NuxtLink :to="pagePath(item)" class="v-header__nav-link" @click="isOpen = false">{{ item.title }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </transition>
  </header>
</template>

<script setup lang="ts">
const isOpen = ref(false)

// Every listed top-level site page, in Panel order (see /api/nav). The home
// page is left out: the logo already links to "/".
const { data: navPages } = await useSiteNav()
const navItems = computed(() => (navPages.value ?? []).filter(page => page.uri !== 'home'))

watch(isOpen, (open) => {
  if (import.meta.client) {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<style lang="scss" scoped>
// Sticky bar; .is-open turns it into a full-screen panel. The bar itself
// is the same element in both states so nothing jumps when the menu opens.
.v-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--color-background);

  &.is-open {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
  }
}

.v-header__bar {
  padding-block: var(--spacing-m);
}

.v-header__logo {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 800;
  text-decoration: none;
}

.v-header__burger {
  width: 48px;
  height: 48px;
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  cursor: pointer;
}

// Hamburger ↔ cross: the outer bars rotate around the middle one, which fades out.
.v-header__burger-icon {
  position: relative;
  display: block;
  width: 100%;
  height: 20px;

  span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 3px;
    border-radius: var(--radius-pill);
    background: currentColor;
    transition: transform 0.25s ease, opacity 0.2s ease;
  }

  span:nth-child(1) { top: 0; }
  span:nth-child(2) { top: 8.5px; }
  span:nth-child(3) { top: 17px; }

  &.is-open {
    span:nth-child(1) {
      top: 8.5px;
      transform: rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      top: 8.5px;
      transform: rotate(-45deg);
    }
  }
}

.v-header__nav {
  flex: 1;
  padding-block: var(--spacing-4xl);
  overflow-y: auto;
}

.v-header__nav-link {
  font-family: var(--font-heading);
  font-size: 40px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: $breakpoint-mobile) {
    font-size: 28px;
  }
}

.v-header-nav-enter-active,
.v-header-nav-leave-active {
  transition: opacity 0.2s ease;
}

.v-header-nav-enter-from,
.v-header-nav-leave-to {
  opacity: 0;
}
</style>
