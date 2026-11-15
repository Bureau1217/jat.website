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
  /** `event` template: plain-text start of the text ("" when empty). */
  excerpt: string | null
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
  /** "page://<uuid>" — matches team / course refs. */
  uuid: string
  /** null for a top-level page. */
  parentTitle: string | null
  /** Published subpages, two levels deep (listing templates). */
  children: KqlPageChild[]
  /** `program` template fields (null on every other template). */
  program: KqlProgramFields | null
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
  /** `article` template fields (null on every other template). */
  article: KqlArticleFields | null
  /** "Fond de la navigation" (jat.cms fields/fill value); null = page theme. */
  headerFill: KqlFillValue | null
  /** Page banner, shown when its title is filled: title, italic signature, fill (null = page theme). */
  hero: {
    title: string | null
    signature: string | null
    fill: KqlFillValue | null
  }
}

/** A jat.cms fields/fill value with its "Inverser le dégradé" toggle. */
export interface KqlFillValue {
  fill: string
  reverse: boolean
}

export interface KqlPageChild {
  id: string
  uuid: string
  uri: string
  title: string
  template: string
  /** `program` template: writer HTML. */
  description: string | null
  children: KqlPageChild[]
}

export interface KqlProgramFields {
  /** Writer HTML ("Descriptif"). */
  description: string | null
  /** Writer HTML ("Déroulé"). */
  outline: string | null
}

export interface KqlArticleFields {
  subtitle: string | null
  /** "Y-m-d". */
  publishedAt: string | null
  categories: string[]
  cover: KqlFile | null
  /** Writer HTML. */
  text: string | null
  gallery: KqlFile[]
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
  /** Plain-text start of the event text (cards). */
  excerpt: string | null
  /** "À la une" in the Panel. */
  isFeatured: boolean
}

/** Article of the Actualités blog (jat.cms `article` template). */
export interface KqlArticle {
  id: string
  uri: string
  title: string
  subtitle: string | null
  /** "Y-m-d". */
  publishedAt: string | null
  categories: string[]
  cover: KqlFile | null
  excerpt: string | null
  /** "À la une" in the Panel. */
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
  /** Teaching staff only: published courses they teach ("Ateliers" column). */
  courses: Array<{ id: string, title: string, uri: string }>
  /** Fiche dépliable (null = the row doesn't open). */
  profile: KqlTeamMemberProfile | null
}

export interface KqlTeamMemberProfile {
  /** Writer HTML ("Parcours"). */
  bio: string | null
  /** Writer HTML, one paragraph per line. */
  cursus: string | null
  bands: string | null
  collaborations: string | null
  links: Array<{ label: string, url: string }>
  /** YouTube / Vimeo page URLs. */
  videos: string[]
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

/** Top-level page of the header nav, with its listed subpages. */
export interface KqlNavSection extends KqlNavItem {
  children: KqlNavItem[]
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
  vhssReferents: KqlReferent[]
  /** action: form URL of the e-mailing tool (null = no form). */
  newsletter: { text: string | null, action: string | null }
  footerPages: KqlNavItem[]
  /** Only the networks with a URL filled in. */
  socialLinks: KqlLink[]
  /** Only the legal links with a target picked. */
  legalLinks: KqlLink[]
  /** Writer HTML. */
  accessibilityText: string | null
}
