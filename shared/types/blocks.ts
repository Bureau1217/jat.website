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

/** Value of a jat.cms fields/fill select ("" = default of the component). */
export type RawFill = string

export interface SectionContent {
  /** Section name, shown in the anchors bar ("" → not listed). */
  heading: string
  /** Opens the section with a large banner holding its name. */
  show_hero?: RawToggle
  /** Banner fill (empty = page theme). */
  fill?: RawFill
  fill_reverse?: RawToggle
  /** Fill of the title / accordion bars inside the section (empty = page theme). */
  bar_fill?: RawFill
  bar_fill_reverse?: RawToggle
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
  /** Left column of the "three_columns" layout (Infos clés, buttons); empty = generated summary. */
  side?: RawBlocks
  /** Bar fill of this sub-section (empty = the section's bars, else page theme). */
  fill?: RawFill
  fill_reverse?: RawToggle
}

export interface AccordionContent {
  items: AccordionItemContent[]
}

/** normal = running text, lead = chapô, highlight = exergue. */
export type ParagraphTextStyle = 'normal' | 'lead' | 'highlight'

export interface ParagraphContent {
  heading: string
  /** Absent on blocks saved before the field existed. */
  text_style?: ParagraphTextStyle
  /** Legacy "Mise en avant" toggle, replaced by text_style: 'highlight'. */
  is_highlighted?: RawToggle
  /** Writer HTML. */
  text: string
  image: KirbyFileRef[]
}

export interface ButtonContent {
  button_label: string
  /** Kirby link field: "page://…", "file://…", URL, "mailto:…" or "tel:…". */
  link: string
}

export interface NewsContent {
  /** "Afficher les événements passés" (absent on blocks saved before it existed). */
  show_past?: RawToggle
}

export interface TabsContent {
  heading: string
  /** text: writer HTML · programs: "Formations concernées". */
  tabs: Array<{ label: string, text: string, programs: KirbyPageRef[] }>
  programs_heading: string
}

export interface ListColumnsContent {
  /** text: writer HTML, one paragraph per entry. */
  groups: Array<{ heading: string, text: string }>
}

export interface KeyInfoContent {
  /** label + writer HTML, one arrowed line per paragraph. */
  items: Array<{ label: string, text: string }>
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
  /** Turns the quote into a colored band (empty = page background). */
  fill?: RawFill
  fill_reverse?: RawToggle
  /** jat.cms fields/text_color value (empty = automatic for the fill). */
  text_color?: string
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
