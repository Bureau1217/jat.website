/**
 * Named fills — the Figma color styles (« dégradés », same names) and the
 * « aplats » of the main colors, defined as
 * CSS variables in assets/main.scss (`--<name>` and `--<name>-text`). The
 * jat.cms select fields (fields/fill.yml) store these names; keep the three
 * lists in sync.
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
  'degrade-agenda-fond',
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

export type FillRole = 'header' | 'hero' | 'bar'

/**
 * Inline style overriding one fill of the page theme (`role`: navigation,
 * hero or title bars) with a named fill picked in the Panel, and/or
 * flipping its direction (« Inverser le dégradé »: drawn top → bottom, the
 * Figma « INVERSE » version). Read by the fill-background mixin.
 * Undefined when nothing is picked: the page theme applies.
 */
export function fillStyle(value: unknown, reverse: unknown = false, role: FillRole = 'bar'): Record<string, string> | undefined {
  const style: Record<string, string> = {}
  if (isFill(value)) {
    style[`--theme-${role}`] = `var(--${value})`
    style[`--theme-${role}-text`] = `var(--${value}-text)`
  }
  if (reverse === true || reverse === 'true') {
    style[`--theme-${role}-direction`] = 'to bottom'
  }
  return Object.keys(style).length ? style : undefined
}
