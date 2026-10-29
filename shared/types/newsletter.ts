/** Answer of POST /api/newsletter, shown as is by the Newsletter form. */
export interface NewsletterResponse {
  status: 'success' | 'invalid' | 'unavailable' | 'error'
  message: string
}
