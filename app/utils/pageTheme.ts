export const PAGE_THEMES = ['home', 'news', 'training', 'school', 'concerts', 'spaces'] as const

export type PageTheme = typeof PAGE_THEMES[number]

export function isPageTheme(value: unknown): value is PageTheme {
  return typeof value === 'string' && (PAGE_THEMES as readonly string[]).includes(value)
}

/**
 * Top-level slugs → theme, used when a page has no « Thème » picked in the
 * Panel: the theme then follows the first URL segment, so a page and all
 * its children share their section's colors. Several slugs per theme
 * absorb the usual Kirby slug variants (with/without article). Unknown
 * sections fall back to home.
 */
const THEME_BY_SLUG: Record<string, PageTheme> = {
  'actualites': 'news',
  'agenda': 'news',
  'articles': 'news',
  'se-former': 'training',
  'formations': 'training',
  'ecole': 'school',
  'l-ecole': 'school',
  'concerts-projets': 'concerts',
  'concerts-et-projets': 'concerts',
  'espaces': 'spaces'
}

export function pageTheme(path: string): PageTheme {
  const slug = path.split('/').find(Boolean) ?? ''
  return THEME_BY_SLUG[slug] ?? 'home'
}
