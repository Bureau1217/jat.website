<template>
  <div v-if="href" class="v-block-button u-block">
    <UiButton :to="href" :download="isDownload">{{ block.content.button_label }}</UiButton>
  </div>
</template>

<script setup lang="ts">
import type { ButtonContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<ButtonContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const isDownload = computed(() => props.block.content.link_type === 'file')

// Not rendered at all when the target is missing (unpublished page, deleted
// document) rather than as a dead button.
const href = computed(() => {
  const { link_type: type, link_page: page, link_url: url, link_file: file } = props.block.content
  if (type === 'page') {
    const target = resolvePageRefs(page, props.pages)[0]
    return target ? pagePath(target) : null
  }
  if (type === 'file') return resolveKqlFile(file, props.files)?.url ?? null
  return url || null
})
</script>
