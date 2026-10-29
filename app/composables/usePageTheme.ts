import type { PageTheme } from '~/utils/pageTheme'

/**
 * Theme picked on the current page in the Panel — set by app.vue once the
 * page is fetched, read by the navigation, the anchors bar and the app
 * shell (which sit outside the page component).
 */
export function usePickedPageTheme() {
  return useState<PageTheme | null>('picked-page-theme', () => null)
}

/**
 * Theme of the current page: the one picked in the Panel, else the one of
 * its URL section. Add `u-theme--${theme}` to read the --theme-* variables.
 */
export function usePageTheme(): ComputedRef<PageTheme> {
  const route = useRoute()
  const picked = usePickedPageTheme()
  return computed(() => picked.value ?? pageTheme(route.path))
}
