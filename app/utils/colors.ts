/**
 * Base colors a block can use for its text — the Figma variables, defined as
 * `--color-<name>` in assets/main.scss. The jat.cms select
 * (fields/text_color.yml) stores these names; keep the lists in sync.
 */
export const COLORS = [
  'se-former',
  'accueil',
  'ecole',
  'ecole-texte',
  'concerts-projets',
  'espaces',
  'footer',
  'background',
  'secondaire-1',
  'secondaire-2',
  'secondaire-3',
  'secondaire-4',
  'secondaire-5',
  'secondaire-6',
  'secondaire-7',
  'secondaire-8',
  'secondaire-9'
] as const

export type Color = typeof COLORS[number]

export function isColor(value: unknown): value is Color {
  return typeof value === 'string' && (COLORS as readonly string[]).includes(value)
}

/** CSS value of a color picked in the Panel, undefined when none (or unknown). */
export function colorValue(value: unknown): string | undefined {
  return isColor(value) ? `var(--color-${value})` : undefined
}
