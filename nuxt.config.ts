// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'JAT',
      titleTemplate: '%s - JAT',
      meta: [
        { name: 'description', content: 'JAT' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'JAT' }
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
    // Server-only (never sent to the browser) — see server/utils/kql.ts.
    apiUrl: '',
    apiAuthEmail: '',
    apiAuthPassword: ''
  }
})
