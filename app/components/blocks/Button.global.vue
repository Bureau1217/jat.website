<template>
  <div v-if="href" class="v-block-button u-block">
    <UiButton :to="href" :download="isDownload">{{ block.content.button_label }}</UiButton>
  </div>
</template>

<script setup lang="ts">
import type { ButtonContent } from '~~/shared/types/blocks'
import type { KqlBlock, KqlFile, KqlPageRefs } from '~~/shared/types/kql'

/**
 * Button of a Kirby link field: page of the site, external URL (new tab),
 * document (downloaded), e-mail (mailto:) or phone number (tel:).
 */
const props = defineProps<{
  block: KqlBlock<ButtonContent>
  files?: KqlFile[]
  pages?: KqlPageRefs
}>()

const isDownload = computed(() => props.block.content.link?.startsWith('file://') ?? false)

// Not rendered at all when the target is missing (unpublished page, deleted
// document) rather than as a dead button.
const href = computed(() => resolveKirbyLink(props.block.content.link, props.pages, props.files))
</script>
