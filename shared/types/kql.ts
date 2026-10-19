/**
 * Shapes returned by the server API (server/api/*), built from the Kirby
 * blueprints of jat.cms. Raw Kirby field names (snake_case) are kept inside
 * block content — see shared/types/blocks.ts — while every value normalized
 * by the server uses camelCase.
 */

/** A Kirby file reference as stored in content: "file://<uuid>". */
export type KirbyFileRef = string

/** A Kirby page reference as stored in content: "page://<uuid>". */
export type KirbyPageRef = string

export interface KqlFile {
  filename: string
  url: string
  alt: string | null
  width: number | null
  height: number | null
  extension: string
  /** Kirby UUID with its "file://" prefix — matches the refs stored in block content. */
  uuid: string
  /** Panel focal point ("x% y%"), "" when unset — see app/utils/objectPosition.ts. */
  focus: string | null
}

/**
 * Any page referenced from block content (pages fields, link fields),
 * resolved server-side in one KQL request — see server/utils/fetchPageRefs.ts.
 * Template-specific fields are null on every other template.
 */
export interface KqlPageRef {
  uuid: KirbyPageRef
  id: string
  uri: string
  title: string
  template: string
  /** Parent page title, e.g. the program group ("Ateliers") of a program. */
  parentTitle: string | null
  /** `program` template. */
  description: string | null
  /** `event` template. */
  startDate: string | null
  endDate: string | null
  schedule: string | null
  location: string | null
  categories: string[]
  cover: KqlFile | null
}

/** Page refs indexed by their "page://<uuid>". */
export type KqlPageRefs = Record<KirbyPageRef, KqlPageRef>

export interface KqlBlock<TContent = Record<string, unknown>> {
  id: string
  type: string
  isHidden: boolean
  content: TContent
}

export interface KqlPage {
  id: string
  uri: string
  title: string
  template: string
  /** Every file of the page — block file refs are resolved against it by uuid. */
  files: KqlFile[]
  /** Pages referenced anywhere in `blocks`. */
  pages: KqlPageRefs
  /** `default` template: `body` field. */
  blocks: KqlBlock[]
  /** `event` template fields (null/empty on every other template). */
  event: KqlEventFields | null
}

export interface KqlEventFields {
  startDate: string | null
  endDate: string | null
  schedule: string | null
  location: string | null
  categories: string[]
  cover: KqlFile | null
  /** Writer HTML. */
  text: string | null
  /** "Galerie photos" (3 photos max). */
  gallery: KqlFile[]
}

/** One event of the Agenda, as listed by the News block. */
export interface KqlEvent {
  id: string
  uri: string
  title: string
  startDate: string | null
  endDate: string | null
  schedule: string | null
  location: string | null
  categories: string[]
  cover: KqlFile | null
  /** "Mis en avant" in the Panel. */
  isFeatured: boolean
}

export interface KqlTeamMember {
  id: string
  title: string
  firstName: string
  lastName: string
  role: string | null
  email: string | null
  phone: string | null
  /** Teaching staff only. */
  instrument: string | null
  /** Teaching staff only: personal website. */
  websiteUrl: string | null
  photo: KqlFile | null
}

export interface KqlTeam {
  /** Kirby UUID with its "page://" prefix — matches the refs picked in the Team block. */
  uuid: string
  id: string
  title: string
  members: KqlTeamMember[]
}

export interface KqlNavItem {
  id: string
  title: string
  uri: string
}

export interface KqlAddress {
  name: string | null
  street: string | null
  number: string | null
  postalCode: string | null
  city: string | null
}

export interface KqlOpeningHours {
  days: string
  hours: string
}

export interface KqlTransport {
  travelTime: string
  lines: string
}

export interface KqlReferent {
  name: string
  /** "mailto:…" or "tel:…" (Kirby link field). */
  contact: string | null
}

export interface KqlLink {
  label: string
  href: string
}

/** Everything editors manage from "Informations générales" (`informations` template). */
export interface KqlSiteInfo {
  address: KqlAddress | null
  email: string | null
  phone: string | null
  openingHours: KqlOpeningHours[]
  transports: KqlTransport[]
  disabilityReferents: KqlReferent[]
  footerPages: KqlNavItem[]
  /** Only the networks with a URL filled in. */
  socialLinks: KqlLink[]
  /** Only the legal links with a target picked. */
  legalLinks: KqlLink[]
  /** Writer HTML. */
  accessibilityText: string | null
}
