import type { KqlFile } from '~~/shared/types/kql'

/**
 * Real <img> attributes for a Kirby file, so the browser picks the smallest
 * generated version that still fits the space the image occupies instead of
 * always downloading the biggest one:
 *
 *   <img v-bind="imageAttrs(file, '(max-width: 900px) 100vw, 33vw')" :alt="…">
 *
 * - srcset lists every size Kirby generated (FILE_SELECT in
 *   server/utils/kqlSelects.ts — keep SRCSET_WIDTHS in sync with it).
 * - `sizes` tells the browser how wide the image will be on screen, which it
 *   needs to choose among them; pass the real layout width per usage. Left
 *   out, the browser assumes 100vw (still correct, just less saving).
 * - Lazy-loaded by default; `eager` for the image at the very top of a page
 *   (hero, cover) so it isn't delayed (and gets a high fetch priority).
 * Same helper as jav.website (copy between Kirby + Nuxt projects).
 */
const SRCSET_WIDTHS = [600, 1000, 1600] as const
const MAX_WIDTH = 2000
const NON_RESIZED_EXTENSIONS = ['svg', 'gif', 'pdf']

export interface ImageAttrs {
  src: string
  srcset?: string
  sizes?: string
  width?: number
  height?: number
  loading: 'lazy' | 'eager'
  decoding: 'async'
  fetchpriority?: 'high'
}

type ImageSource = Pick<KqlFile, 'url'> & Partial<Pick<KqlFile, 'width' | 'height' | 'url600' | 'url1000' | 'url1600' | 'extension'>>

export function imageAttrs(
  file: ImageSource | null | undefined,
  sizes?: string,
  options: { eager?: boolean } = {}
): ImageAttrs | Record<string, never> {
  if (!file?.url) return {}

  const attrs: ImageAttrs = {
    src: file.url,
    loading: options.eager ? 'eager' : 'lazy',
    decoding: 'async',
    ...(file.width ? { width: file.width } : {}),
    ...(file.height ? { height: file.height } : {})
  }
  if (options.eager) attrs.fetchpriority = 'high'

  if (file.extension && NON_RESIZED_EXTENSIONS.includes(file.extension.toLowerCase())) {
    return attrs
  }

  const byWidth: Record<number, string | null | undefined> = {
    600: file.url600,
    1000: file.url1000,
    1600: file.url1600
  }
  const largestWidth = file.width || MAX_WIDTH
  // Kirby never upscales: a size at or above the image's own width would be
  // that same image mislabeled, so only strictly smaller sizes are listed,
  // followed by the largest version.
  const candidates = SRCSET_WIDTHS
    .filter(width => width < largestWidth && byWidth[width])
    .map(width => `${byWidth[width]} ${width}w`)

  if (candidates.length) {
    candidates.push(`${file.url} ${Math.min(largestWidth, MAX_WIDTH)}w`)
    attrs.srcset = candidates.join(', ')
    if (sizes) attrs.sizes = sizes
  }

  return attrs
}
