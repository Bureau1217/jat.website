export default defineEventHandler(async (event) => {
  const page = await fetchPage('', requestLocale(event))

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
