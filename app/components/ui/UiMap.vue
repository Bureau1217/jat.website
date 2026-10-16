<template>
  <iframe
    class="ui-map"
    :src="embedUrl"
    :title="`Carte : ${address}`"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    allowfullscreen
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  address: string
}>()

// Google Maps' keyless embed: geocodes the address itself and drops an
// interactive pin on it (zoom, drag, "open in Maps").
const embedUrl = computed(() =>
  `https://www.google.com/maps?q=${encodeURIComponent(props.address)}&output=embed`
)
</script>

<style lang="scss" scoped>
.ui-map {
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
