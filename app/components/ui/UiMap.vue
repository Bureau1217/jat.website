<template>
  <div class="ui-map">
    <iframe
      class="ui-map__frame"
      :src="embedUrl"
      :title="`Carte : ${address}`"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    />
  </div>
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
// Shape follows its own width (container query): square when narrow.
.ui-map {
  container-type: inline-size;
}

.ui-map__frame {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border: 0;

  @include container-wide {
    aspect-ratio: 16 / 9;
  }
}
</style>
