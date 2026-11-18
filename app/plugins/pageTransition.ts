/**
 * Every page route uses the JS page transition (utils/pageTransition.ts),
 * through its meta: transition hooks are functions, which nuxt.config.ts
 * can't hold. Set on the server too, so both render the same wrapper.
 *
 * Before leaving a page scrolled down, scrolls it back up: the crossfade
 * then happens with the top of both pages on screen.
 *
 * Also keeps the displayed path: the colors of the site (usePageTheme)
 * follow the page on screen, switching at the swap, not on click.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const displayedPath = useState('displayed-path', () => router.currentRoute.value.path)

  router.beforeEach((to) => {
    to.meta.pageTransition = pageTransition
  })

  if (import.meta.client) {
    // Registered before app.vue's guard: the Repères bar stays until the
    // scroll is over. Not on back / forward (history.state is already the
    // target's), which returns to the position the page was left at.
    router.beforeEach(async (to, from) => {
      const viaHistory = window.history.state?.current === to.fullPath
      if (from.matched.length && to.path !== from.path && !viaHistory && !reducedMotion()) {
        await scrollToTop()
      }
    })

    const syncPath = () => {
      displayedPath.value = router.currentRoute.value.path
    }
    onPageSwap(syncPath)
    // No transition (e.g. language switch, which remounts the app).
    nuxtApp.hook('page:finish', () => {
      setTimeout(syncPath, 300)
    })
  }
})
