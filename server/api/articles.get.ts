import type { KqlArticle } from '~~/shared/types/kql'

interface RawArticle extends Omit<KqlArticle, 'isFeatured'> {
  isFeatured: boolean | null
}

/**
 * Every published article of the Actualités blog, most recent first.
 * Fetched by template rather than by the blog page's slug, like events.
 */
export default defineEventHandler(async (event): Promise<KqlArticle[]> => {
  const articles = await kqlFetch<RawArticle[]>({
    query: 'site.index.filterBy("intendedTemplate", "article").sortBy("published_at", "desc")',
    select: {
      id: true,
      uri: 'page.uri',
      title: true,
      subtitle: 'page.subtitle',
      publishedAt: 'page.published_at.toDate("Y-m-d")',
      categories: 'page.categories.split',
      cover: {
        query: 'page.cover.toFile',
        select: FILE_SELECT
      },
      excerpt: 'page.text.excerpt(180)',
      isFeatured: 'page.is_featured.toBool'
    }
  }, requestLocale(event))

  return (articles ?? []).map(article => ({
    ...article,
    subtitle: article.subtitle || null,
    publishedAt: article.publishedAt || null,
    excerpt: article.excerpt || null,
    isFeatured: article.isFeatured === true
  }))
})
