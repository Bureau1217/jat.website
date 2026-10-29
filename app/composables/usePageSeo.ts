import type { KqlPage } from '~~/shared/types/kql'

const SITE_NAME = 'Jazz à Tours'

// Last resort — only used when neither the page nor « Informations
// générales » (Panel, « SEO » tab) provides its own.
const FALLBACK_DESCRIPTION
  = 'Jazz à Tours — école de jazz et de musiques actuelles à Tours depuis 1981 : formations professionnalisantes et diplômantes, cours, stages, concerts.'

/**
 * Every SEO tag of a Kirby page, in one place — title, description,
 * canonical URL, Open Graph / Twitter card. Called once by
 * pages/[...slug].vue with the fetched page. Ported from jav.website.
 *
 * What editors fill in the Panel (« SEO » tab) wins; each value has a
 * fallback so a page is never left without tags:
 * - title: SEO title → page title, then " - Jazz à Tours" (home: site name)
 * - description: SEO description → article subtitle → event / article
 *   text (cut to ~160 chars) → site-wide default (« Informations
 *   générales ») → built-in text
 * - image: the event / article photo, else the share image of
 *   « Informations générales »
 * Image and canonical URLs are absolute (Open Graph requires it), based on
 * NUXT_PUBLIC_SITE_URL when set, else the request's own origin.
 */
export function usePageSeo(page: Ref<KqlPage | null | undefined>): void {
  const config = useRuntimeConfig()
  const route = useRoute()
  const requestUrl = useRequestURL()
  const { data: siteInfo } = useSiteInfo()

  const origin = computed(() => (config.public.siteUrl || requestUrl.origin).replace(/\/+$/, ''))

  function absolute(url: string | null | undefined): string | null {
    if (!url) return null
    return /^https?:\/\//i.test(url) ? url : `${origin.value}${url.startsWith('/') ? '' : '/'}${url}`
  }

  const isHome = computed(() => route.path === '/' || page.value?.id === 'home')

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
    || FALLBACK_DESCRIPTION
  )

  // An event or article shares its own photo, other pages the site image.
  const image = computed(() => absolute(page.value?.event?.cover?.url ?? page.value?.article?.cover?.url ?? siteInfo.value?.seoImage))

  // Trailing slash dropped (except the root), so "/agenda" and "/agenda/"
  // don't count as two different pages for search engines.
  const canonical = computed(() => {
    const path = route.path.length > 1 ? route.path.replace(/\/+$/, '') : route.path
    return `${origin.value}${path}`
  })

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogImage: () => image.value ?? undefined,
    ogUrl: () => canonical.value,
    ogType: 'website',
    ogSiteName: SITE_NAME,
    ogLocale: 'fr_FR',
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value ?? undefined
  })

  useHead({
    link: [{ rel: 'canonical', href: () => canonical.value }]
  })
}
