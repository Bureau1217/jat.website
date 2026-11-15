interface KqlResponse<T> {
  code: number
  result: T
  status: string
}

import type { Locale } from '~~/shared/utils/locales'

/**
 * POSTs a query to the Kirby KQL endpoint using the server-only
 * credentials from runtimeConfig. Never call this from client code.
 * `locale` picks the content language (Kirby falls back to French for
 * untranslated fields).
 */
export async function kqlFetch<T>(body: Record<string, unknown>, locale?: Locale): Promise<T> {
  const config = useRuntimeConfig()
  const credentials = Buffer
    .from(`${config.apiAuthEmail}:${config.apiAuthPassword}`)
    .toString('base64')

  const response = await $fetch<KqlResponse<T>>('/api/query', {
    baseURL: config.apiUrl,
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      ...(locale ? { 'X-Language': locale } : {})
    },
    body
  })

  return response.result
}
