/** Sections of the site (first URL segment) — default fills (main.scss $section-fills). */
export const PAGE_SECTIONS = ['home', 'news', 'training', 'school', 'concerts', 'spaces'] as const
export type PageSection = typeof PAGE_SECTIONS[number]

/** Page themes (main.scss $page-themes): text color and page background. */
export const PAGE_THEMES = ['base', 'school', 'news'] as const
export type PageTheme = typeof PAGE_THEMES[number]

/**
 * Top-level slugs → section: a page and all its children share their
 * section's default fills and theme (set in code, not in the Panel).
 * Several slugs per section absorb the usual Kirby slug variants
 * (with/without article). Pages outside the sections (legal pages,
 * tests…) fall back to home.
 */
const SECTION_BY_SLUG: Record<string, PageSection> = {
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

export function pageSection(path: string): PageSection {
  const slug = path.split('/').find(Boolean) ?? ''
  return SECTION_BY_SLUG[slug] ?? 'home'
}

/** Only L'École (red text) and Actualités / Agenda (gradient background) differ from the base theme. */
export function pageTheme(path: string): PageTheme {
  const section = pageSection(path)
  return section === 'school' || section === 'news' ? section : 'base'
}
