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
  /** Section name, shown in the anchors bar ("" → not listed). */
  heading: string
  body: RawBlocks
}

/** Titre block: the level is chosen by the front, editors only type the text. */
export interface HeadingContent {
  text: string
}

/** "Simple": blocks only · "3 colonnes": Sommaire · blocks · Contenus liés. */
export type AccordionItemLayout = 'single' | 'three_columns'

/** One "Sous-section" of an Accordion block, each with its own optional theme. */
export interface AccordionItemContent {
  heading: string
  layout: AccordionItemLayout
  body: RawBlocks
  /** "Contenus liés", only used by the "three_columns" layout. */
  aside: RawBlocks
  has_theme: RawToggle
  background_color: string
  text_color: string
}

export interface AccordionContent {
  items: AccordionItemContent[]
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

export interface BenefitsContent {
  items: Array<{ pictogram: KirbyFileRef[], heading: string }>
}

export interface TeamContent {
  /** Teams to show — every team when empty. */
  teams: KirbyPageRef[]
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
