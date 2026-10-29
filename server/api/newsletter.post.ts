import type { NewsletterResponse } from '~~/shared/types/newsletter'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Short trimmed text from the request body, or undefined. */
function field(value: unknown, max = 100): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : undefined
}

/**
 * Newsletter sign-up of the footer form: e-mail (required), first and last
 * name (optional) → the Mailchimp audience. Answers with a status and a
 * message the form shows as is.
 */
export default defineEventHandler(async (event): Promise<NewsletterResponse> => {
  const body = await readBody<Record<string, unknown>>(event)
  const email = field(body?.email, 254)?.toLowerCase()

  if (!email || !EMAIL_PATTERN.test(email)) {
    setResponseStatus(event, 422)
    return { status: 'invalid', message: 'L’adresse e-mail n’est pas valide.' }
  }

  if (!isMailchimpConfigured()) {
    setResponseStatus(event, 503)
    return { status: 'unavailable', message: 'L’inscription à la newsletter ouvre bientôt.' }
  }

  try {
    await addToMailchimpList({ email, firstName: field(body?.firstName), lastName: field(body?.lastName) })
  } catch (error) {
    console.error('Newsletter sign-up failed:', error)
    setResponseStatus(event, 502)
    return { status: 'error', message: 'Une erreur est survenue, réessayez ou écrivez-nous.' }
  }

  return { status: 'success', message: 'Merci, vous êtes inscrit·e à la newsletter.' }
})
