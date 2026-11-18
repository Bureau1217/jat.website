import type { RouterConfig } from '@nuxt/schema'

/**
 * Changing page never shows the window scrolling: the jump happens at the
 * swap, under the old page pinned on screen while it fades out
 * (utils/pageTransition.ts). Anchor links within a page still scroll
 * smoothly (html { scroll-behavior: smooth }, main.scss).
 */
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) {
      return to.hash && to.hash !== from.hash ? { el: to.hash, behavior: 'smooth' } : false
    }

    const target = savedPosition ?? (to.hash ? { el: to.hash } : { top: 0 })
    const nuxtApp = useNuxtApp()
    return new Promise((resolve) => {
      let done = false
      const jump = () => {
        if (done) return
        done = true
        resolve({ ...target, behavior: 'instant' })
      }
      onNextPageSwap(jump)
      // No transition (e.g. language switch, which remounts the app).
      nuxtApp.hooks.hookOnce('page:finish', () => { setTimeout(jump, 300) })
    })
  }
}
