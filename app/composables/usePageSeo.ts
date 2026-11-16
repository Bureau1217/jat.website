import type { KqlPage } from '~~/shared/types/kql'
import { LOCALES, stripLocale, withLocale } from '~~/shared/utils/locales'

const SITE_NAME = 'Jazz à Tours'

// Last resort — only used when neither the page nor « Informations
// générales » (Panel, « SEO » tab) provides its own.
const FALLBACK_DESCRIPTION = {
  fr: 'Jazz à Tours — école de jazz et de musiques actuelles à Tours depuis 1981 : formations professionnalisantes et diplômantes, cours, stages, concerts.',
  en: 'Jazz à Tours — jazz and contemporary music school in Tours since 1981: professional and diploma courses, lessons, workshops, concerts.'
}

const OG_LOCALE = { fr: 'fr_FR', en: 'en_GB' }

/**
 * Every SEO tag of a Kirby page, in one place — title, description,
 * canonical URL, FR / EN alternates, Open Graph / Twitter card. Called once
 * by pages/[...slug].vue with the fetched page. Ported from jav.website.
 *
 * What editors fill in the Panel (« SEO » tab) wins; each value has a
 * fallback so a page is never left without tags:
 * - title: SEO title → page title, then " - Jazz à Tours" (home: site name)
 * - description: SEO description → article subtitle → event / article
 *   text (cut to ~160 chars) → site-wide default (« Informations
 *   générales ») → built-in text
 * - image: the event / article photo, else the share image of
 *   « Informations générales »
 * Canonical URLs are absolute (Open Graph requires it), based on
 * NUXT_PUBLIC_SITE_URL when set, else the request's own origin.
 */
export function usePageSeo(page: Ref<KqlPage | null | undefined>): void {
  const config = useRuntimeConfig()
  const route = useRoute()
  const requestUrl = useRequestURL()
  const locale = useLocale()
  const { data: siteInfo } = useSiteInfo()

  const origin = computed(() => (config.public.siteUrl || requestUrl.origin).replace(/\/+$/, ''))

  const isHome = computed(() => stripLocale(route.path) === '/' || page.value?.id === 'home')

  const title = computed(() => {
    const own = page.value?.seoTitle || (isHome.value ? '' : page.value?.title)
    if (!own) return SITE_NAME
    return isHome.value ? own : `${own} - ${SITE_NAME}`
  })

  const description = computed(() =>
    page.value?.seoDescription
    || page.value?.article?.subtitle
    || truncateText(page.value?.event?.text ?? page.value?.article?.text, 160)
    || siteInfo.value?.seoDescription
    || FALLBACK_DESCRIPTION[locale.value]
  )

  // An event or article shares its own photo, other pages the site image.
  const image = computed(() => page.value?.event?.cover?.url ?? page.value?.article?.cover?.url ?? siteInfo.value?.seoImage ?? undefined)

  // Trailing slash dropped (except the root), so "/agenda" and "/agenda/"
  // don't count as two different pages for search engines.
  const basePath = computed(() => {
    const path = stripLocale(route.path)
    return path.length > 1 ? path.replace(/\/+$/, '') : path
  })
  const urlFor = (target: typeof LOCALES[number]) => `${origin.value}${withLocale(basePath.value, target)}`
  const canonical = computed(() => urlFor(locale.value))

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogImage: () => image.value,
    ogUrl: () => canonical.value,
    ogType: 'website',
    ogSiteName: SITE_NAME,
    ogLocale: () => OG_LOCALE[locale.value],
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value
  })

  // Every page exists in both languages (Kirby falls back to French).
  useHead({
    link: () => [
      { rel: 'canonical', href: canonical.value },
      ...LOCALES.map(target => ({ rel: 'alternate' as const, hreflang: target, href: urlFor(target) })),
      { rel: 'alternate', hreflang: 'x-default', href: urlFor('fr') }
    ]
  })
}
