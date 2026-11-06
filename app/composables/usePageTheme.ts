import type { PageSection, PageTheme } from '~/utils/pageTheme'

/**
 * Theme and section of the current page, from its URL (utils/pageTheme.ts).
 * Add `u-theme--${theme} u-fills--${section}` to read the --theme-* variables.
 */
export function usePageTheme(): ComputedRef<{ theme: PageTheme, section: PageSection }> {
  const route = useRoute()
  return computed(() => ({ theme: pageTheme(route.path), section: pageSection(route.path) }))
}
