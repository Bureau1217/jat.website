<template>
  <!-- Gab's dev--gab header (sizes, logo, colours) + FR / EN. The fill is
       the section's (main.scss, --theme-*-header-*) unless the page picks
       its own « Fond de la navigation » in the Panel. -->
  <header
    class="v-navigation-menu"
    :class="[`u-theme--${theme}`, { 'is-open': isOpen }]"
    :style="headerFill ? { '--theme-header-gradient': headerFill.background, '--theme-header-text': headerFill.color } : undefined"
  >
    <!-- Previous colors, fading out over the new ones at a page change. -->
    <span
      v-if="previousBackground"
      :key="previousBackground.key"
      class="v-navigation-menu__previous"
      :style="{ background: previousBackground.value }"
      aria-hidden="true"
      @animationend="previousBackground = null"
    />
    <div class="v-navigation-menu__bar u-flex u-flex--align-center u-gap-5xl u-gutter-x">
      <NuxtLink :to="withLocale('/', locale)" class="v-navigation-menu__logo" :aria-label="t('Jazz à Tours — accueil')" @click="isOpen = false">JÀT</NuxtLink>

      <nav class="v-navigation-menu__desktop-nav" :aria-label="t('Navigation principale')">
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

      <UiLanguageSwitcher class="v-navigation-menu__languages" />

      <button
        type="button"
        class="v-navigation-menu__burger"
        :aria-expanded="isOpen"
        aria-controls="v-navigation-menu-nav"
        :aria-label="t(isOpen ? 'Fermer le menu' : 'Ouvrir le menu')"
        @click="isOpen = !isOpen"
      >
        <span class="v-navigation-menu__burger-icon" :class="{ 'is-open': isOpen }">
          <span /><span /><span />
        </span>
      </button>
    </div>

    <!-- Durations: the links' staggered entrance outlasts the panel's own
         transition (see the styles). -->
    <Transition name="v-navigation-menu-nav" :duration="{ enter: 900, leave: 350 }" @after-leave="tintScrollbarPlace(false)">
      <nav v-if="isOpen" id="v-navigation-menu-nav" ref="panel" class="v-navigation-menu__mobile-nav u-gutter-x" :aria-label="t('Navigation principale')">
        <ul class="u-flex u-flex--column u-gap-m">
          <li v-for="(item, index) in navItems" :key="item.id" :style="{ '--index': index }">
            <NuxtLink :to="pagePath(item)" class="v-navigation-menu__mobile-link" @click="isOpen = false">{{ item.title }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { withLocale } from '~~/shared/utils/locales'

const isOpen = ref(false)
const theme = usePageTheme()
const locale = useLocale()
// « Fond de la navigation » of the page, read from the page data itself
// (shared request): known at server render, so the fill is in the HTML.
const { data: currentPage } = await useCurrentPage()
const headerFill = computed(() => {
  const fill = currentPage.value?.headerFill
  return fill ? resolveFill(fill.fill, fill.reverse) : null
})

// At a page change the colors crossfade with the page
// (utils/pageTransition.ts): the old background is laid over the new one
// and fades out. Gradients can't be transitioned by CSS themselves.
const background = computed(() => headerFill.value?.background ?? `var(--theme-${theme.value}-header-gradient)`)
const previousBackground = shallowRef<{ key: number, value: string } | null>(null)
let previousKey = 0
watch(background, (_, old) => {
  if (import.meta.client && !reducedMotion()) {
    previousBackground.value = { key: ++previousKey, value: `${old}, var(--color-background)` }
  }
})

// Every listed top-level site page, in Panel order (see /api/nav). The home
// page is left out: the logo already links to "/".
const { data: navPages } = await useSiteNav()
const navItems = computed(() => (navPages.value ?? []).filter(page => page.uri !== 'home'))

// Open: the page behind stops scrolling. Its scrollbar's place stays
// reserved (scrollbar-gutter: stable, so the bar doesn't move) and shows
// the root background: tinted like the panel, not a beige strip beside it.
const panel = useTemplateRef<HTMLElement>('panel')
function tintScrollbarPlace(open: boolean): void {
  document.documentElement.style.backgroundColor = open && panel.value ? getComputedStyle(panel.value).backgroundColor : ''
}

watch(isOpen, async (open) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = open ? 'hidden' : ''
  if (open) {
    await nextTick()
    tintScrollbarPlace(true)
  }
})

// Leaving the page (a link of the panel, back button…) closes it.
const route = useRoute()
watch(() => route.path, () => { isOpen.value = false })
</script>

<style lang="scss" scoped>
// Sticky bar. On mobile the burger opens a panel under it
// (.v-navigation-menu__mobile-nav); the bar itself never moves.
.v-navigation-menu {
  position: sticky;
  top: 0;
  z-index: 1000;
  // Some gradients are translucent (Agenda): the page background under them
  // keeps the content from showing through the sticky bar.
  background: var(--theme-header-gradient), var(--color-background);
  color: var(--theme-header-text);
  // The text color follows the crossfade (see .v-navigation-menu__previous).
  transition: color 0.7s cubic-bezier(0.65, 0, 0.35, 1);

}

// 0.7s and curve = PAGE_CROSSFADE_MS and EASE_IN_OUT (utils/pageTransition.ts).
.v-navigation-menu__previous {
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation: v-navigation-menu-previous-out 0.7s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes v-navigation-menu-previous-out {
  to {
    opacity: 0;
  }
}

// Above the fading layer.
.v-navigation-menu__bar {
  position: relative;
}

.v-navigation-menu__bar {
  min-height: var(--navigation-menu-height);
  padding-block: var(--spacing-s);

  @media (max-width: $breakpoint-mobile) {
    gap: var(--spacing-m);
  }
}

.v-navigation-menu__logo {
  font-family: var(--font-heading);
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

// Mockup « B3 small bold »: ES Rebond Bold.
.v-navigation-menu__label {
  grid-area: 1 / 1;
  font-family: var(--font-body);
  font-size: fluid(17px, 20px);
  font-weight: 700;
  line-height: 1.2;
}

// Mockup « B3 interactif »: the hovered / active page switches to Gaya.
.v-navigation-menu__label--alt {
  font-family: var(--font-accent);
  font-size: fluid(19px, 21px);
  font-weight: 400;
  text-transform: capitalize;
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

// Same type as the links; pushed to the right on mobile, the burger after it.
.v-navigation-menu__languages {
  font-size: fluid(17px, 20px);
  font-weight: 700;

  @media (max-width: $breakpoint-mobile) {
    margin-left: auto;
  }
}

.v-navigation-menu__burger {
  display: none;
  width: 48px;
  height: 48px;
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

// Fixed under the bar, down to the bottom of the screen, on a solid color
// the header text reads on (the gradient would fade under the links).
.v-navigation-menu__mobile-nav {
  position: fixed;
  inset: var(--navigation-menu-height) 0 0;
  padding-block: var(--spacing-4xl);
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--theme-menu-background);

  // Desktop: the panel can stay open after a resize — hide it.
  @media (width > $breakpoint-mobile) {
    display: none;
  }
}

// Mockup « H3 »: Animo capitals.
.v-navigation-menu__mobile-link {
  font-family: var(--font-heading);
  font-size: fluid(34px, 72px);
  line-height: 1.07;
  text-transform: uppercase;
  text-decoration: none;

  &:hover,
  &.router-link-active {
    text-decoration: underline;
  }
}

// Opening: the panel unrolls down from the bar (ease-out), then the links
// rise in one after the other. Closing: it rolls back up, quicker
// (ease-in), the links fading at once. Durations: the Transition's.
.v-navigation-menu-nav-enter-active {
  transition: clip-path 0.55s cubic-bezier(0.22, 1, 0.36, 1);

  li {
    transition:
      opacity 0.45s ease-out,
      transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: calc(0.15s + var(--index) * 0.06s);
  }
}

.v-navigation-menu-nav-leave-active {
  transition: clip-path 0.35s cubic-bezier(0.55, 0, 1, 0.45);

  li {
    transition: opacity 0.15s ease-in;
  }
}

.v-navigation-menu-nav-enter-from,
.v-navigation-menu-nav-leave-to {
  clip-path: inset(0 0 100% 0);

  li {
    opacity: 0;
  }
}

.v-navigation-menu-nav-enter-from li {
  transform: translateY(24px);
}

@media (prefers-reduced-motion: reduce) {
  .v-navigation-menu-nav-enter-active,
  .v-navigation-menu-nav-leave-active {
    &,
    li {
      transition-duration: 0.01s;
      transition-delay: 0s;
    }
  }
}
</style>
