import type { KqlArticle } from '~~/shared/types/kql'

type RawArticle = Omit<KqlArticle, 'isFeatured'> & { isFeatured: boolean | null }

/**
 * Every published article of the « Actualités » blog, most recent first.
 * Fetched by template (like the events) so it doesn't depend on the slug
 * editors give the data page.
 */
export default defineEventHandler(async (): Promise<KqlArticle[]> => {
  const articles = await kqlFetch<RawArticle[]>({
    query: 'site.index.filterBy("intendedTemplate", "article").sortBy("published_at", "desc")',
    select: {
      id: true,
      uri: 'page.uri',
      title: true,
      isFeatured: 'page.is_featured.toBool',
      ...ARTICLE_SELECT
    }
  })

  return (articles ?? []).map(article => ({
    ...article,
    subtitle: article.subtitle || null,
    publishedAt: article.publishedAt || null,
    excerpt: article.excerpt || null,
    isFeatured: article.isFeatured === true
  }))
})
