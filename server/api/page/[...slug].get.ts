export default defineEventHandler(async (event) => {
  const id = sanitizePageId(getRouterParam(event, 'slug') ?? '')

  if (id === null) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid page path' })
  }

  const page = await fetchPage(id)

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
