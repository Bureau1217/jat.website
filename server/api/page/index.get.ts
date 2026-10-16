export default defineEventHandler(async () => {
  const page = await fetchPage('')

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
