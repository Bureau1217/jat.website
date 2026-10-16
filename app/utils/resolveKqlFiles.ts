import type { KirbyFileRef, KqlFile } from '~~/shared/types/kql'

/**
 * Block content stores files as "file://<uuid>" refs — resolves them
 * against the page's own files (every file field of jat.cms only picks
 * files of the current page), keeping the editor's order and dropping refs
 * to deleted files.
 */
export function resolveKqlFiles(refs: KirbyFileRef[] | undefined, files: KqlFile[] | undefined): KqlFile[] {
  if (!refs?.length || !files?.length) {
    return []
  }

  return refs
    .map(ref => files.find(file => file.uuid === ref))
    .filter((file): file is KqlFile => Boolean(file))
}

/** Single-file variant of resolveKqlFiles (image, photo, pictogram fields). */
export function resolveKqlFile(refs: KirbyFileRef[] | undefined, files: KqlFile[] | undefined): KqlFile | null {
  return resolveKqlFiles(refs, files)[0] ?? null
}
