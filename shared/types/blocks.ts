import type { KirbyFileRef, KirbyPageRef } from './kql'

/**
 * Raw content of each block type, field for field as stored by Kirby
 * (jat.cms: site/blueprints/blocks/*.yml). Kirby stores booleans as
 * "true"/"false" strings and nested blocks fields as JSON strings — read them
 * with isKirbyTrue() / parseKqlBlocks().
 */

/** A nested blocks field: JSON string (or already-decoded array). */
export type RawBlocks = string | unknown[]

/** Kirby toggle value. */
export type RawToggle = 'true' | 'false' | boolean | ''

export interface SectionContent {
  body: RawBlocks
}

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

export interface HeadingContent {
  level: HeadingLevel
  text: string
}

export interface AccordionContent {
  items: Array<{ heading: string, body: RawBlocks }>
  has_theme: RawToggle
  background_color: string
  text_color: string
}

export interface ParagraphContent {
  heading: string
  is_highlighted: RawToggle
  /** Writer HTML. */
  text: string
  image: KirbyFileRef[]
}

export type ButtonLinkType = 'page' | 'url' | 'file'

export interface ButtonContent {
  button_label: string
  link_type: ButtonLinkType
  link_page: KirbyPageRef[]
  link_url: string
  link_file: KirbyFileRef[]
}

export interface NewsContent {
  size: 's' | 'l'
}

export interface BenefitsContent {
  items: Array<{ pictogram: KirbyFileRef[], heading: string }>
}

export type TeamScope = 'all' | 'admin' | 'teaching'

export interface TeamContent {
  scope: TeamScope
}

export interface MapContent {
  address: string
}

export interface ListContent {
  source: 'manual' | 'programs' | 'team'
  items: Array<{ item_text: string }>
  programs: KirbyPageRef[]
  teams: KirbyPageRef[]
}

export interface QuoteContent {
  /** Inline writer HTML (italic only). */
  text: string
  author: string
  alignment: 'center' | 'right'
}

export interface ImageContent {
  images: KirbyFileRef[]
  is_cover: RawToggle
  caption: string
}

export interface Columns2Content {
  column_1: RawBlocks
  column_2: RawBlocks
}

export interface Columns3Content {
  body: RawBlocks
  aside: RawBlocks
}

export interface GalleryContent {
  images: KirbyFileRef[]
}

export interface RelatedProgramsContent {
  programs: KirbyPageRef[]
}

export interface RelatedEventsContent {
  events: KirbyPageRef[]
}

export interface LaureatesContent {
  laureates: Array<{ heading: string, photo: KirbyFileRef[] }>
  /** Kirby object field (call_to_action). */
  cta: { cta_label?: string, cta_link?: string } | null
}

export interface TestimonialContent {
  /** Writer HTML. */
  text: string
  author: string
}
