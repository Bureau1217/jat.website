const SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

/**
 * Validates a URL path before it gets interpolated into a KQL query
 * string. Returns the normalized id, an empty string for the home
 * page, or null if the path contains anything unexpected.
 */
export function sanitizePageId(path: string): string | null {
  const trimmed = path.replace(/^\/+|\/+$/g, '')

  if (trimmed === '') {
    return ''
  }

  const isValid = trimmed.split('/').every(segment => SEGMENT.test(segment))

  return isValid ? trimmed : null
}
