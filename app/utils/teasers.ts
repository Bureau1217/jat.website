import type { KqlArticle, KqlEvent, KqlFile, KqlPageRef } from '~~/shared/types/kql'

/** What a card (UiTeaserCard, UiFeaturedTeaser) shows, whatever its source. */
export interface Teaser {
  id: string
  to: string
  title: string
  cover: KqlFile | null
  categories: string[]
  date: string
  schedule: string | null
  location: string | null
  excerpt: string | null
}

/** Agenda event — from the events list or a resolved page ref. */
export function eventTeaser(event: KqlEvent | KqlPageRef): Teaser {
  return {
    id: event.id,
    to: pagePath(event),
    title: event.title,
    cover: event.cover,
    categories: event.categories,
    date: formatEventDate(event.startDate, event.endDate),
    schedule: event.schedule,
    location: event.location,
    excerpt: event.excerpt || null
  }
}

/** Actualités article: no schedule nor place, its publication date instead. */
export function articleTeaser(article: KqlArticle): Teaser {
  return {
    id: article.id,
    to: pagePath(article),
    title: article.title,
    cover: article.cover,
    categories: article.categories,
    date: formatEventDate(article.publishedAt),
    schedule: null,
    location: null,
    excerpt: article.subtitle || article.excerpt
  }
}
