import type { ResolvedFill } from '~/utils/fills'

/** "Fond de la navigation" of the current page (null = page theme), shared with NavigationMenu. */
export function useHeaderFill() {
  return useState<ResolvedFill | null>('header-fill', () => null)
}
