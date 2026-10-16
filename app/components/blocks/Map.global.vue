<template>
  <div v-if="block.content.address" class="v-block-map u-block">
    <iframe
      class="v-block-map__frame"
      :src="embedUrl"
      :title="`Carte : ${block.content.address}`"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    />
  </div>
</template>

<script setup lang="ts">
import type { MapContent } from '~~/shared/types/blocks'
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock<MapContent>
}>()

// Google Maps' keyless embed: geocodes the address itself and drops an
// interactive pin on it (zoom, drag, "open in Maps").
const embedUrl = computed(() =>
  `https://www.google.com/maps?q=${encodeURIComponent(props.block.content.address)}&output=embed`
)
</script>

<style lang="scss" scoped>
.v-block-map__frame {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: var(--radius-m);

  @media (max-width: $breakpoint-mobile) {
    aspect-ratio: 1;
  }
}
</style>
