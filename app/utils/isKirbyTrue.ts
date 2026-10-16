import type { RawToggle } from '~~/shared/types/blocks'

/** Kirby stores toggle fields as "true"/"false" strings inside block content. */
export function isKirbyTrue(value: RawToggle | undefined): boolean {
  return value === true || value === 'true'
}
