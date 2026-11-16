/**
 * Resolves a CSS length (rem, clamp(), calc(), var()…) to pixels, as the
 * browser computes it right now. Needed where an API only takes px, like
 * IntersectionObserver's rootMargin. Client-side only.
 */
export function cssLengthToPx(length: string): number {
  const probe = document.createElement('div')
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;height:${length}`
  document.body.appendChild(probe)
  const px = probe.getBoundingClientRect().height
  probe.remove()
  return px
}
