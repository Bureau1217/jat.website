import type { PageTheme } from '~/utils/pageTheme'

/**
 * Theme of the page on screen — add `u-theme--${theme}` to read the
 * --theme-* variables. Follows the displayed path (plugins/pageTransition.ts)
 * rather than the route, so the colors switch with the page at the crossfade.
 */
export function usePageTheme(): ComputedRef<PageTheme> {
  const route = useRoute()
  const displayedPath = useState('displayed-path', () => route.path)
  return computed(() => pageTheme(displayedPath.value))
}
