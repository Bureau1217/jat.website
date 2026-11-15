import type { KqlArticle } from '~~/shared/types/kql'

/** Every published article — shared by every Actualités block of a page. */
export function useArticles() {
  const locale = useLocale()
  return useFetch<KqlArticle[]>('/api/articles', {
    query: { lang: locale },
    key: () => `articles:${locale.value}`
  })
}
