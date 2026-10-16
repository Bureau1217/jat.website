import type { PageTheme } from '~/utils/pageTheme'

/** Theme of the current route — add `u-theme--${theme}` to read the --theme-* variables. */
export function usePageTheme(): ComputedRef<PageTheme> {
  const route = useRoute()
  return computed(() => pageTheme(route.path))
}
