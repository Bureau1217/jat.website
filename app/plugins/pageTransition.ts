/**
 * Every page route uses the JS page transition (utils/pageTransition.ts),
 * through its meta: transition hooks are functions, which nuxt.config.ts
 * can't hold. Set on the server too, so both render the same wrapper.
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
