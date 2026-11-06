/**
 * Named fills — the Figma color styles (« dégradés », same names) and the
 * « aplats » of the main colors, defined as
 * CSS variables in assets/main.scss (`--<name>` and `--<name>-text`). The
 * jat.cms select fields (fields/fill.yml) store these names; keep the three
 * lists in sync. The page background (« Agenda — Fond ») is not one of them:
 * it is set in code by the page theme (main.scss), not in the Panel.
 */
export const FILLS = [
  'degrade-se-former-formations-pro',
  'degrade-se-former-diplomantes',
  'degrade-se-former-tarifs',
  'degrade-se-former-cours-loisirs',
  'degrade-se-former-stages-inverse',
  'degrade-concerts-projets',
  'degrade-concerts-projets-pedago',
  'degrade-concerts-pedago',
  'degrade-concerts-bouton',
  'degrade-espace-etudiant',
  'degrade-espace-enseignant',
  'degrade-espace-presse',
  'degrade-espace-alumni',
  'degrade-ecole',
  'degrade-accueil',
  'degrade-agenda',
  'aplat-accueil',
  'aplat-ecole',
  'aplat-se-former',
  'aplat-concerts-projets',
  'aplat-espaces',
  'aplat-footer'
] as const

export type Fill = typeof FILLS[number]

export function isFill(value: unknown): value is Fill {
  return typeof value === 'string' && (FILLS as readonly string[]).includes(value)
}

/** Fills the Panel can set: navigation (page), hero (section), bars (section, sub-section), quote band. */
export type FillRole = 'header' | 'hero' | 'bar' | 'quote'

/**
 * Inline style overriding one fill of the page theme (`role`: navigation,
 * hero, title bars or quote band) with a named fill picked in the Panel,
 * and/or « Inverser le dégradé »: the fill's « INVERSE » version, defined in
 * main.scss as --<name>-inverse (the Figma INVERSE style, or the stops
 * mirrored). --theme-<role>-inverse always holds the other version, so a
 * section / sub-section that only ticks « Inverser » flips the fill it
 * inherits. Read by the fill-background mixin.
 * Undefined when nothing is picked: the page theme applies.
 */
export function fillStyle(value: unknown, reverse: unknown = false, role: FillRole = 'bar'): Record<string, string> | undefined {
  const flip = reverse === true || reverse === 'true'
  if (isFill(value)) {
    return {
      [`--theme-${role}`]: `var(--${value}${flip ? '-inverse' : ''})`,
      [`--theme-${role}-inverse`]: `var(--${value}${flip ? '' : '-inverse'})`,
      [`--theme-${role}-text`]: `var(--${value}-text)`
    }
  }
  // Only « Inverser »: the inherited fill's other version.
  return flip ? { [`--theme-${role}`]: `var(--theme-${role}-inverse)` } : undefined
}

/**
 * Inline style for « Fond de la page » picked in the Panel: the fill (or its
 * « INVERSE » version) painted bottom → top over the whole page, in place of
 * the theme's page background (--theme-page-background, read by app.vue).
 * Undefined when nothing is picked.
 */
export function pageFillStyle(value: unknown, reverse: unknown = false): Record<string, string> | undefined {
  if (!isFill(value)) return undefined
  const flip = reverse === true || reverse === 'true'
  return { '--theme-page-background': `linear-gradient(to top, var(--${value}${flip ? '-inverse' : ''}))` }
}
