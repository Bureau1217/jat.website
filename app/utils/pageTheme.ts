export const PAGE_THEMES = ['home', 'news', 'training', 'school', 'concerts', 'spaces'] as const

export type PageTheme = typeof PAGE_THEMES[number]

/**
 * Top-level slugs → theme: the theme follows the first URL segment, so a
 * page and all its children share their section's colors (not editable in
 * the Panel). Several slugs per theme absorb the usual Kirby slug variants
 * (with/without article). Pages outside the sections (legal pages, tests…)
 * fall back to home.
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
