import type { TransitionProps } from 'vue'

/**
 * Page change as a crossfade (plugins/pageTransition.ts), never a blank:
 * 0. if the page is scrolled down, it first scrolls back up (scrollToTop);
 * 1. the old page stays on screen while the next one loads;
 * 2. at the swap, the old page is pinned where it is (position: fixed),
 *    the window jumps to the top underneath it (router.options.ts) and the
 *    new page is laid out there;
 * 3. the old page fades out over the new one, while the navigation
 *    crossfades to the new page's colors (NavigationMenu.vue);
 * 4. the Repères bar slides in a little after (app.vue).
 */
export const PAGE_CROSSFADE_MS = 700
export const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)'

const swapListeners = new Set<() => void>()

/** Called at every swap (see 2.); returns the unsubscribe. */
export function onPageSwap(listener: () => void): () => void {
  swapListeners.add(listener)
  return () => swapListeners.delete(listener)
}

/** Called once, at the next swap. */
export function onNextPageSwap(listener: () => void): void {
  const unsubscribe = onPageSwap(() => {
    unsubscribe()
    listener()
  })
}

export function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2

/**
 * Scrolls the window back to the top, then resolves. Animated here rather
 * than with scrollTo({ behavior: 'smooth' }): the browser's smooth scroll
 * has no end event and takes longer the further down we are; this one lasts
 * 450 to 900 ms whatever the distance.
 */
export function scrollToTop(): Promise<void> {
  const start = window.scrollY
  if (start <= 0) return Promise.resolve()
  const duration = Math.min(900, Math.max(450, start / 4))
  const startTime = performance.now()

  return new Promise((resolve) => {
    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration)
      window.scrollTo({ top: start * (1 - easeInOutCubic(progress)), behavior: 'instant' })
      if (progress < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

/** Set on every page route (plugins/pageTransition.ts). JS-driven: css false, default mode (both at once). */
export const pageTransition: TransitionProps = {
  name: 'page',
  css: false,

  onLeave(el, done) {
    const page = el as HTMLElement
    // Pinned where it is on screen, out of the flow: the new page takes its
    // place and the scroll can reset without moving it.
    const rect = page.getBoundingClientRect()
    // It keeps its own colors: the app's theme class switches to the new
    // page's at the swap (usePageTheme), and the theme variables cascade.
    const theme = [...(page.closest('.v-app')?.classList ?? [])].find(name => name.startsWith('u-theme--'))
    if (theme) page.classList.add(theme)
    Object.assign(page.style, {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: '10',
      pointerEvents: 'none'
    })
    swapListeners.forEach(listener => listener())

    if (reducedMotion()) {
      done()
      return
    }
    // Commit the pinned state before fading from it.
    void page.offsetHeight
    page.style.transition = `opacity ${PAGE_CROSSFADE_MS}ms ${EASE_IN_OUT}`
    page.style.opacity = '0'
    setTimeout(done, PAGE_CROSSFADE_MS)
  }
}
