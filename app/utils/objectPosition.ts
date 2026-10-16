import type { KqlFile } from '~~/shared/types/kql'

/**
 * The Panel's built-in focal-point picker stores "x% y%" on the file, or ""
 * when never set. Used as `object-position` for any <img> with
 * `object-fit: cover`, so a cropped image keeps its subject in frame.
 */
export function objectPosition(file: Pick<KqlFile, 'focus'> | null | undefined): string {
  return file?.focus || 'center'
}
