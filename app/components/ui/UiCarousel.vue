<template>
  <div class="ui-carousel u-flex u-flex--column u-gap-l" :class="`ui-carousel--${variant}`">
    <div
      ref="track"
      class="ui-carousel__track"
      tabindex="0"
      role="region"
      aria-roledescription="carrousel"
      :aria-label="t(label)"
      @scroll.passive="onScroll"
    >
      <figure v-for="(image, index) in images" :key="image.uuid" class="ui-carousel__slide" :aria-label="`${index + 1} ${t('sur')} ${images.length}`">
        <UiImage :file="image" cover />
      </figure>
    </div>

    <div v-if="variant === 'row'" class="ui-carousel__controls u-flex u-flex--align-center u-flex--justify-center u-gap-xs">
      <button type="button" class="ui-carousel__arrow ui-carousel__arrow--prev" :aria-label="t('Photos précédentes')" :disabled="current === 0" @click="go(-1)" />
      <span class="ui-carousel__counter" aria-live="polite">{{ current + 1 }}|{{ images.length }}</span>
      <button type="button" class="ui-carousel__arrow" :aria-label="t('Photos suivantes')" :disabled="isAtEnd" @click="go(1)" />
    </div>

    <div v-else class="ui-carousel__dots u-flex u-flex--justify-center u-gap-s">
      <button
        v-for="(image, index) in images"
        :key="image.uuid"
        type="button"
        class="ui-carousel__dot"
        :class="{ 'is-active': index === current }"
        :aria-label="`${t('Photo')} ${index + 1}`"
        :aria-current="index === current"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlFile } from '~~/shared/types/kql'

/**
 * Horizontal photo carousel on native scroll-snap (swipe and keyboard come
 * for free). `row`: 3 photos per view with arrows + counter (Locaux).
 * `cover`: one full-width photo per view with dots (home page).
 */
const props = withDefaults(defineProps<{
  images: KqlFile[]
  variant?: 'row' | 'cover'
  label?: string
}>(), {
  variant: 'row',
  label: 'Photos'
})

const track = ref<HTMLElement | null>(null)
const current = ref(0)
const isAtEnd = ref(props.images.length <= 1)

function slideWidth(): number {
  const slide = track.value?.querySelector<HTMLElement>('.ui-carousel__slide')
  if (!slide || !track.value) return 1
  const gap = Number.parseFloat(getComputedStyle(track.value).columnGap) || 0
  return slide.offsetWidth + gap
}

function onScroll() {
  const element = track.value
  if (!element) return
  current.value = Math.min(props.images.length - 1, Math.round(element.scrollLeft / slideWidth()))
  isAtEnd.value = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2
}

function goTo(index: number) {
  track.value?.scrollTo({ left: index * slideWidth(), behavior: 'smooth' })
}

// Arrows move by one photo: the counter then reads like the mockup (1|26, 2|26…).
function go(direction: 1 | -1) {
  goTo(Math.max(0, Math.min(props.images.length - 1, current.value + direction)))
}

onMounted(onScroll)
</script>

<style lang="scss" scoped>
.ui-carousel__track {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spacing-5xl);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }
}

.ui-carousel__slide {
  margin: 0;
  scroll-snap-align: start;
  overflow: hidden;
}

// 3 per view, 293 × 195 in the mockup.
.ui-carousel--row .ui-carousel__track {
  grid-auto-columns: calc((100% - 2 * var(--spacing-5xl)) / 3);

  @media (max-width: $breakpoint-mobile) {
    grid-auto-columns: 80%;
    gap: var(--spacing-m);
  }
}

.ui-carousel--row .ui-carousel__slide {
  aspect-ratio: 293 / 195;
}

.ui-carousel--cover .ui-carousel__track {
  grid-auto-columns: 100%;
  gap: 0;
}

.ui-carousel--cover .ui-carousel__slide {
  aspect-ratio: 16 / 7;

  @media (max-width: $breakpoint-mobile) {
    aspect-ratio: 4 / 3;
  }
}

.ui-carousel__counter {
  min-width: 57px;
  padding: var(--spacing-xs);
  font-size: 16px;
  line-height: 1.28;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

// The mockup's long arrow (assets/icons), tinted with the text color.
.ui-carousel__arrow {
  width: 74px;
  height: 24px;
  padding: 0;
  border: 0;
  background: currentColor;
  mask: url('~/assets/icons/arrow-long.svg') center / 74px 10px no-repeat;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}

.ui-carousel__arrow--prev {
  transform: rotate(180deg);
}

.ui-carousel__dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 1px solid currentColor;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  &.is-active {
    background: currentColor;
  }
}
</style>
