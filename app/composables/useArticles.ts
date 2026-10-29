import type { KqlArticle } from '~~/shared/types/kql'

/** Every article of the « Actualités » blog, most recent first — shared by every Articles block of a page. */
export function useArticles() {
  return useFetch<KqlArticle[]>('/api/articles', { key: 'articles' })
}
