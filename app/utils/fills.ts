import type { RawToggle } from '~~/shared/types/blocks'

/**
 * Named fills of jat.cms (fields/fill.yml, fields/fill_reverse.yml) and text
 * colors (fields/text_color.yml) → CSS. Keep FILLS / TEXT_COLORS aligned
 * with those blueprints and with the variables of assets/main.scss.
 */
const FILLS = [
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

const TEXT_COLORS = [
  'se-former', 'accueil', 'ecole', 'ecole-texte', 'concerts-projets', 'espaces', 'footer', 'background',
  'secondaire-1', 'secondaire-2', 'secondaire-3', 'secondaire-4', 'secondaire-5',
  'secondaire-6', 'secondaire-7', 'secondaire-8', 'secondaire-9'
] as const

export type TextColor = typeof TEXT_COLORS[number]

/**
 * Text color that reads on each fill when the editor leaves "Couleur du
 * texte" on automatic — the pairs used by the mockup.
 */
const TEXT_ON_FILL: Record<Fill, TextColor> = {
  'degrade-se-former-formations-pro': 'secondaire-2',
  'degrade-se-former-diplomantes': 'secondaire-2',
  'degrade-se-former-tarifs': 'se-former',
  'degrade-se-former-cours-loisirs': 'secondaire-2',
  'degrade-se-former-stages-inverse': 'se-former',
  'degrade-concerts-projets': 'se-former',
  'degrade-concerts-projets-pedago': 'se-former',
  'degrade-concerts-pedago': 'se-former',
  'degrade-concerts-bouton': 'se-former',
  'degrade-espace-etudiant': 'background',
  'degrade-espace-enseignant': 'background',
  'degrade-espace-presse': 'background',
  'degrade-espace-alumni': 'espaces',
  'degrade-ecole': 'secondaire-1',
  'degrade-accueil': 'espaces',
  'degrade-agenda': 'se-former',
  'aplat-accueil': 'secondaire-5',
  'aplat-ecole': 'secondaire-1',
  'aplat-se-former': 'secondaire-2',
  'aplat-concerts-projets': 'se-former',
  'aplat-espaces': 'background',
  'aplat-footer': 'background'
}

function isFill(value: string | null | undefined): value is Fill {
  return !!value && (FILLS as readonly string[]).includes(value)
}

function isTextColor(value: string | null | undefined): value is TextColor {
  return !!value && (TEXT_COLORS as readonly string[]).includes(value)
}

export interface ResolvedFill {
  background: string
  color: string
}

/**
 * CSS background + text color of a fill, or null when the field is empty
 * (the component then falls back on its default, usually the page theme).
 * Gradients are drawn bottom → top; "Inverser le dégradé" flips them.
 */
export function resolveFill(
  fill: string | null | undefined,
  reverse?: RawToggle | null,
  textColor?: string | null
): ResolvedFill | null {
  if (!isFill(fill)) return null
  const isReversed = isKirbyTrue(reverse ?? undefined)
  const background = fill.startsWith('aplat-')
    ? `var(--${fill})`
    : `linear-gradient(${isReversed ? 'to bottom' : 'to top'}, var(--${fill}))`
  const color = `var(--color-${isTextColor(textColor) ? textColor : TEXT_ON_FILL[fill]})`
  return { background, color }
}

/**
 * The same, as the two CSS variables a component reads (`--<name>-fill`,
 * `--<name>-text`), so nested elements inherit them.
 */
export function fillVariables(name: string, fill: ResolvedFill | null): Record<string, string> | undefined {
  if (!fill) return undefined
  return { [`--${name}-fill`]: fill.background, [`--${name}-text`]: fill.color }
}
