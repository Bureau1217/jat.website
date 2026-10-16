import type { KqlAddress, KqlLink, KqlNavItem, KqlOpeningHours, KqlSiteInfo, KqlTransport } from '~~/shared/types/kql'

interface RawSiteInfos {
  /** Kirby object field — [] when never filled in. */
  address: { name?: string, street?: string, number?: string, postal_code?: string, city?: string } | [] | null
  email: string | null
  phone: string | null
  openingHours: KqlOpeningHours[] | null
  transports: Array<{ travel_time: string, lines: string }> | null
  disabilityReferents: Array<{ referent_name: string, contact: string }> | null
  footerPages: KqlNavItem[] | null
  socialInstagram: string | null
  socialFacebook: string | null
  socialLinkedin: string | null
  socialYoutube: string | null
  legalNoticeLink: string | null
  privacyPolicyLink: string | null
  accessibilityText: string | null
}

/** Social networks and legal links, in display order — labels are fixed, only the URLs are edited. */
const SOCIAL_LINKS: Array<{ label: string, rawKey: keyof RawSiteInfos }> = [
  { label: 'Instagram', rawKey: 'socialInstagram' },
  { label: 'Facebook', rawKey: 'socialFacebook' },
  { label: 'LinkedIn', rawKey: 'socialLinkedin' },
  { label: 'YouTube', rawKey: 'socialYoutube' }
]

const LEGAL_LINKS: Array<{ label: string, rawKey: keyof RawSiteInfos }> = [
  { label: 'Mentions légales', rawKey: 'legalNoticeLink' },
  { label: 'Politique de confidentialité', rawKey: 'privacyPolicyLink' }
]

const EMPTY: KqlSiteInfo = {
  address: null,
  email: null,
  phone: null,
  openingHours: [],
  transports: [],
  disabilityReferents: [],
  footerPages: [],
  socialLinks: [],
  legalLinks: [],
  accessibilityText: null
}

/**
 * Everything editors manage from "Informations générales" (jat.cms
 * `informations` template): contact details, opening hours, transports,
 * disability referents, footer pages,
 * social networks, legal links and the accessibility text.
 */
export default defineEventHandler(async (): Promise<KqlSiteInfo> => {
  const config = useRuntimeConfig()
  const page = await kqlFetch<RawSiteInfos | null>({
    query: 'site.index.filterBy("intendedTemplate", "informations").first',
    select: {
      address: 'page.address.toObject.toArray',
      email: 'page.email',
      phone: 'page.phone',
      openingHours: {
        query: 'page.opening_hours.toStructure',
        select: { days: true, hours: true }
      },
      transports: {
        query: 'page.transports.toStructure',
        select: { travel_time: true, lines: true }
      },
      disabilityReferents: {
        query: 'page.disability_referents.toStructure',
        select: { referent_name: true, contact: true }
      },
      footerPages: {
        query: 'page.footer_pages.toPages',
        select: { id: true, title: true, uri: 'page.uri' }
      },
      socialInstagram: 'page.social_instagram',
      socialFacebook: 'page.social_facebook',
      socialLinkedin: 'page.social_linkedin',
      socialYoutube: 'page.social_youtube',
      // Kirby link fields store "page://<uuid>" for internal pages — .toUrl resolves them.
      legalNoticeLink: 'page.legal_notice_link.toUrl',
      privacyPolicyLink: 'page.privacy_policy_link.toUrl',
      accessibilityText: 'page.accessibility_text'
    }
  })

  if (!page) {
    return EMPTY
  }

  const address: KqlAddress | null = page.address && !Array.isArray(page.address)
    ? {
        name: page.address.name || null,
        street: page.address.street || null,
        number: page.address.number || null,
        postalCode: page.address.postal_code || null,
        city: page.address.city || null
      }
    : null

  /** Keeps only the links with a target, made relative when they point to the CMS host. */
  const toLinks = (links: typeof SOCIAL_LINKS): KqlLink[] => links
    .map(({ label, rawKey }) => ({ label, href: toRelativeLink(page[rawKey] as string | null, config.apiUrl) }))
    .filter((link): link is KqlLink => Boolean(link.href))

  return {
    address,
    email: page.email || null,
    phone: page.phone || null,
    openingHours: page.openingHours ?? [],
    transports: (page.transports ?? []).map((row): KqlTransport => ({ travelTime: row.travel_time, lines: row.lines })),
    disabilityReferents: (page.disabilityReferents ?? []).map(row => ({ name: row.referent_name, contact: row.contact || null })),
    footerPages: page.footerPages ?? [],
    socialLinks: toLinks(SOCIAL_LINKS),
    legalLinks: toLinks(LEGAL_LINKS),
    accessibilityText: page.accessibilityText || null
  }
})
