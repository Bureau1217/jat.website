const NNBSP = ' ' // narrow no-break space (French typography)

/**
 * French punctuation spacing on HTML coming from the CMS: the space before
 * ; : ! ? » % and after « becomes a narrow no-break space, so the sign never
 * wraps alone onto the next line. Only text between tags is touched, never
 * attributes or URLs (`https://…` has no space before its colon anyway).
 */
export function frenchSpacing(html: string): string {
  return html
    .split(/(<[^>]*>)/)
    .map(part => (part.startsWith('<')
      ? part
      : part
          .replace(/(?:[  ]|&nbsp;)+([;:!?»%])/g, `${NNBSP}$1`)
          .replace(/«(?:[  ]|&nbsp;)+/g, `«${NNBSP}`)))
    .join('')
}
