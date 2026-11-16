/**
 * Answer of POST /api/newsletter. Only a status: the footer form turns it
 * into a message in the visitor's language (t()).
 */
export interface NewsletterResponse {
  status: 'success' | 'invalid' | 'unavailable' | 'error'
}
