<template>
  <div v-if="images.length" class="ui-carousel" :class="`ui-carousel--${variant}`">
    <ul
      ref="track"
      class="ui-carousel__track"
      :aria-label="`${images.length} photos`"
      @scroll.passive="onScroll"
    >
      <li v-for="image in images" :key="image.uuid" class="ui-carousel__slide">
        <figure class="ui-carousel__figure u-flex u-flex--column u-gap-xs">
          <div class="ui-carousel__media">
            <UiImage :file="image" cover :sizes="SIZES[variant]" />
          </div>
          <figcaption v-if="image.caption" class="ui-carousel__caption">{{ image.caption }}</figcaption>
        </figure>
      </li>
    </ul>

    <!-- Full width: one dot per photo (mockup: accueil). -->
    <div v-if="hasControls && variant === 'full'" class="ui-carousel__dots u-flex u-flex--justify-center u-gap-s">
      <button
        v-for="(image, i) in images"
        :key="image.uuid"
        type="button"
        class="ui-carousel__dot"
        :class="{ 'is-active': i === index }"
        :aria-label="`Photo ${i + 1}`"
        :aria-current="i === index ? 'true' : undefined"
        @click="goTo(i)"
      />
    </div>

    <!-- Inline / aside: ← 1|n → (mockup: locaux). -->
    <div v-else-if="hasControls" class="ui-carousel__nav u-flex u-flex--align-center u-flex--justify-center u-gap-m">
      <button type="button" class="ui-carousel__arrow" aria-label="Photo précédente" :disabled="index === 0" @click="goTo(index - 1)">←</button>
      <span class="ui-carousel__counter">{{ index + 1 }}|{{ images.length }}</span>
      <button type="button" class="ui-carousel__arrow" aria-label="Photo suivante" :disabled="index >= lastIndex" @click="goTo(index + 1)">→</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/**
 * Several photos that scroll sideways (CSS scroll snap: swipe, trackpad and
 * keyboard work natively; the buttons only drive the scroll position).
 * - `full`: full-bleed slides + dots (Image block, « Couverture » on)
 * - `inline`: 3 photos per view on the grid + arrows (Image block, off)
 * - `aside`: one photo per view in a « Contenus liés » box + arrows
 * Controls only show when there are more photos than fit in one view.
 */
const props = withDefaults(defineProps<{
  images: KqlFile[]
  variant?: 'full' | 'inline' | 'aside'
}>(), {
  variant: 'full'
})

// Rendered width of one photo per variant, for the srcset (see UiImage).
const SIZES = {
  full: '100vw',
  inline: '(max-width: 900px) 80vw, 25vw',
  aside: '(max-width: 900px) 100vw, 20vw'
} as const

const track = ref<HTMLElement | null>(null)
const index = ref(0)

const perView = computed(() => (props.variant === 'inline' ? 3 : 1))
const lastIndex = computed(() => Math.max(0, props.images.length - perView.value))
const hasControls = computed(() => props.images.length > perView.value)

function slideWidth(): number {
  const slide = track.value?.querySelector<HTMLElement>('.ui-carousel__slide')
  if (!slide || !track.value) return 0
  const gap = parseFloat(getComputedStyle(track.value).columnGap) || 0
  return slide.offsetWidth + gap
}

function onScroll(): void {
  const width = slideWidth()
  if (width && track.value) {
    index.value = Math.min(lastIndex.value, Math.round(track.value.scrollLeft / width))
  }
}

function goTo(target: number): void {
  const clamped = Math.min(Math.max(target, 0), lastIndex.value)
  track.value?.scrollTo({ left: clamped * slideWidth(), behavior: 'smooth' })
  index.value = clamped
}
</script>

<style lang="scss" scoped>
.ui-carousel {
  --carousel-gap: var(--grid-gap);
  // Lays out from its own width (container query), not the viewport.
  container-type: inline-size;
}

.ui-carousel--full {
  --carousel-gap: 0px;
  position: relative;
}

.ui-carousel--aside {
  --carousel-gap: var(--spacing-m);
}

.ui-carousel__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  column-gap: var(--carousel-gap);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.ui-carousel--inline .ui-carousel__track {
  grid-auto-columns: 80%;

  @include container-wide {
    grid-auto-columns: calc((100% - 2 * var(--carousel-gap)) / 3);
  }
}

.ui-carousel__slide {
  scroll-snap-align: start;
}

.ui-carousel__figure {
  margin: 0;
}

.ui-carousel__media {
  overflow: hidden;
}

// Mockup ratios: accueil 1440×672, locaux 293×195, aside 232×209.
.ui-carousel--full .ui-carousel__media {
  aspect-ratio: 4 / 3;

  @include container-wide {
    aspect-ratio: 1440 / 672;
  }
}

.ui-carousel--inline .ui-carousel__media {
  aspect-ratio: 293 / 195;
}

.ui-carousel--aside .ui-carousel__media {
  aspect-ratio: 232 / 209;
}

.ui-carousel__caption {
  @include t-small;
}

.ui-carousel--full .ui-carousel__caption {
  padding-inline: var(--gutter);
}

// Dots sit over the bottom of the photos.
.ui-carousel__dots {
  position: absolute;
  inset-inline: 0;
  bottom: var(--spacing-xl);
}

.ui-carousel__dot {
  width: rem(12px);
  height: rem(12px);
  padding: 0;
  background: transparent;
  border: 1.5px solid var(--color-secondaire-5);
  border-radius: 50%;
  cursor: pointer;

  &.is-active {
    background: var(--color-secondaire-5);
  }
}

.ui-carousel__nav {
  margin-top: var(--spacing-m);
}

.ui-carousel__arrow {
  padding: 0 var(--spacing-xs);
  background: none;
  border: none;
  color: inherit;
  font-size: rem(24px);
  line-height: 1;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}

.ui-carousel__counter {
  @include t-small;
  font-variant-numeric: tabular-nums;
}
</style>
