interface KqlResponse<T> {
  code: number
  result: T
  status: string
}

/**
 * POSTs a query to the Kirby KQL endpoint using the server-only
 * credentials from runtimeConfig. Never call this from client code.
 */
export async function kqlFetch<T>(body: Record<string, unknown>): Promise<T> {
  const config = useRuntimeConfig()
  const credentials = Buffer
    .from(`${config.apiAuthEmail}:${config.apiAuthPassword}`)
    .toString('base64')

  const response = await $fetch<KqlResponse<T>>('/api/query', {
    baseURL: config.apiUrl,
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`
    },
    body
  })

  return response.result
}
