import { stripLocale } from '~~/shared/utils/locales'

export type PageTheme = 'home' | 'news' | 'training' | 'school' | 'concerts' | 'spaces'

/**
 * Top-level slugs → theme. Jat.cms has no theme field on pages, so the
 * theme follows the first URL segment: a page and all its children share
 * their section's colors. Several slugs per theme absorb the usual Kirby
 * slug variants (with/without article). Unknown sections fall back to home.
 */
const THEME_BY_SLUG: Record<string, PageTheme> = {
  'actualites': 'news',
  'agenda': 'news',
  // Blog data page (articles template)
  'actualites-blog': 'news',
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
  // "/en/ecole" belongs to the same section as "/ecole".
  const slug = stripLocale(path).split('/').find(Boolean) ?? ''
  return THEME_BY_SLUG[slug] ?? 'home'
}
