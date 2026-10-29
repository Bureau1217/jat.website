import { createHash } from 'node:crypto'

export interface MailchimpSubscriber {
  email: string
  firstName?: string
  lastName?: string
  /** 'subscribed': added at once; 'pending': Mailchimp sends a confirmation e-mail first (double opt-in). */
  status?: 'subscribed' | 'pending'
}

/** Whether the Mailchimp credentials are set (NUXT_MAILCHIMP_API_KEY / NUXT_MAILCHIMP_LIST_ID). */
export function isMailchimpConfigured(): boolean {
  const { apiKey, listId } = useRuntimeConfig().mailchimp
  return Boolean(apiKey && listId && apiKey.includes('-'))
}

/**
 * Adds (or updates) an e-mail address in the Mailchimp audience — same as
 * jav.website. The API key ends with its datacenter ("…-us8").
 */
export async function addToMailchimpList(subscriber: MailchimpSubscriber): Promise<void> {
  const { apiKey, listId } = useRuntimeConfig().mailchimp
  const datacenter = apiKey.split('-')[1]
  if (!apiKey || !listId || !datacenter) {
    throw new Error('Mailchimp is not configured (NUXT_MAILCHIMP_API_KEY / NUXT_MAILCHIMP_LIST_ID)')
  }

  const email = subscriber.email.trim().toLowerCase()
  const memberHash = createHash('md5').update(email).digest('hex')

  await $fetch(`https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members/${memberHash}`, {
    method: 'PUT',
    headers: { Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}` },
    timeout: 8000,
    retry: 0,
    body: {
      email_address: email,
      status_if_new: subscriber.status ?? 'subscribed',
      merge_fields: {
        ...(subscriber.firstName && { FNAME: subscriber.firstName }),
        ...(subscriber.lastName && { LNAME: subscriber.lastName })
      }
    }
  })
}
