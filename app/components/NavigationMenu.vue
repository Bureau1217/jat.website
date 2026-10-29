<template>
  <header class="v-navigation-menu" :class="[`u-theme--${theme}`, { 'is-open': isOpen }]">
    <div class="v-navigation-menu__bar u-flex u-flex--align-center u-gap-5xl u-gutter-x">
      <NuxtLink to="/" class="v-navigation-menu__logo" aria-label="Jazz à Tours — accueil" @click="isOpen = false">JÀT</NuxtLink>

      <nav class="v-navigation-menu__desktop-nav" aria-label="Navigation principale">
        <ul class="u-flex u-flex--align-center u-gap-2xl">
          <li v-for="item in navItems" :key="item.id">
            <!-- Both typefaces stacked in one cell: the link keeps the width of
                 the wider one, so switching to Gaya on hover moves nothing. -->
            <NuxtLink :to="pagePath(item)" class="v-navigation-menu__link">
              <span class="v-navigation-menu__label">{{ item.title }}</span>
              <span class="v-navigation-menu__label v-navigation-menu__label--alt" aria-hidden="true">{{ item.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        class="v-navigation-menu__burger"
        :aria-expanded="isOpen"
        aria-controls="v-navigation-menu-nav"
        :aria-label="isOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="isOpen = !isOpen"
      >
        <span class="v-navigation-menu__burger-icon" :class="{ 'is-open': isOpen }">
          <span /><span /><span />
        </span>
      </button>
    </div>

    <transition name="v-navigation-menu-nav">
      <nav v-if="isOpen" id="v-navigation-menu-nav" class="v-navigation-menu__mobile-nav u-gutter-x" aria-label="Navigation principale">
        <ul class="u-flex u-flex--column u-gap-m">
          <li v-for="item in navItems" :key="item.id">
            <NuxtLink :to="pagePath(item)" class="v-navigation-menu__mobile-link" @click="isOpen = false">{{ item.title }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </transition>
  </header>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const theme = usePageTheme()

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
// Sticky bar; .is-open turns it into a full-screen panel (mobile only). The
// bar itself is the same element in both states so nothing jumps when the
// menu opens.
.v-navigation-menu {
  position: sticky;
  top: 0;
  z-index: 1000;
  @include fill-background(header);

  @media (max-width: $breakpoint-mobile) {
    &.is-open {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
    }
  }
}

.v-navigation-menu__bar {
  min-height: var(--navigation-menu-height);
  padding-block: var(--spacing-s);
}

.v-navigation-menu__logo {
  font-family: var(--font-display);
  font-size: fluid(36px, 55px);
  line-height: 1;
  text-decoration: none;
}

.v-navigation-menu__desktop-nav {
  flex: 1;

  @media (max-width: $breakpoint-mobile) {
    display: none;
  }
}

.v-navigation-menu__link {
  display: inline-grid;
  justify-items: center;
  text-decoration: none;
}

.v-navigation-menu__label {
  @include t-label;
  grid-area: 1 / 1;
  line-height: 1.2;
}

// Mockup: the hovered / active page switches to Gaya.
.v-navigation-menu__label--alt {
  @include t-nav-alt;
  line-height: 1.2;
  visibility: hidden;
}

.v-navigation-menu__link:hover,
.v-navigation-menu__link.router-link-active {
  .v-navigation-menu__label {
    visibility: hidden;
  }

  .v-navigation-menu__label--alt {
    visibility: visible;
  }
}

.v-navigation-menu__burger {
  display: none;
  width: 48px;
  height: 48px;
  margin-left: auto;
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;

  @media (max-width: $breakpoint-mobile) {
    display: block;
  }
}

// Hamburger ↔ cross: the outer bars rotate around the middle one, which fades out.
.v-navigation-menu__burger-icon {
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

.v-navigation-menu__mobile-nav {
  flex: 1;
  padding-block: var(--spacing-4xl);
  overflow-y: auto;

  // Desktop: the panel can stay open after a resize — hide it.
  @media (width > $breakpoint-mobile) {
    display: none;
  }
}

.v-navigation-menu__mobile-link {
  @include t-h2;
  text-decoration: none;

  &:hover,
  &.router-link-active {
    text-decoration: underline;
  }
}

.v-navigation-menu-nav-enter-active,
.v-navigation-menu-nav-leave-active {
  transition: opacity 0.2s ease;
}

.v-navigation-menu-nav-enter-from,
.v-navigation-menu-nav-leave-to {
  opacity: 0;
}
</style>
