// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Jazz à Tours',
      // Each page builds its complete title itself (usePageSeo.ts): no
      // template on top.
      titleTemplate: '%s',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/FaviconJAT.png', sizes: '512x512' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },
  css: ['~/assets/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // "as *" keeps every $variable globally accessible with its bare
          // name (e.g. $breakpoint-mobile) in every component's <style>.
          additionalData: '@use "~/assets/_params.scss" as *;'
        }
      }
    }
  },
  runtimeConfig: {
    public: {
      // Canonical public origin (e.g. "https://www.jazzatours.com") for the
      // canonical URLs, Open Graph and the sitemap — NUXT_PUBLIC_SITE_URL.
      // Empty: falls back to the host the request came in on.
      siteUrl: ''
    },
    // Server-only (never sent to the browser) — see server/utils/kql.ts.
    apiUrl: '',
    apiAuthEmail: '',
    apiAuthPassword: '',
    // Newsletter (server/api/newsletter.post.ts): NUXT_MAILCHIMP_API_KEY /
    // NUXT_MAILCHIMP_LIST_ID. Empty: the footer falls back to the form
    // address set in « Informations générales », if any.
    mailchimp: {
      apiKey: '',
      listId: ''
    }
  }
})
