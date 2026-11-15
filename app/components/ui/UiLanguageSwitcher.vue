<template>
  <nav class="ui-language-switcher" :aria-label="t('Langue')">
    <template v-for="(item, index) in items" :key="item.locale">
      <span v-if="index > 0" aria-hidden="true"> / </span>
      <NuxtLink
        :to="item.to"
        :lang="item.locale"
        :hreflang="item.locale"
        class="ui-language-switcher__link"
        :class="{ 'is-active': item.locale === locale }"
        :aria-current="item.locale === locale ? 'true' : undefined"
      >
        {{ item.label }}
      </NuxtLink>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { LOCALES, stripLocale, withLocale } from '~~/shared/utils/locales'

/**
 * "Fr / En" (header, footer): the same page in the other language. Kirby
 * slugs are not translated, so only the /en prefix changes.
 */
const route = useRoute()
const locale = useLocale()

const items = computed(() => LOCALES.map(code => ({
  locale: code,
  label: code === 'fr' ? 'Fr' : 'En',
  to: withLocale(stripLocale(route.path), code) + (route.hash || '')
})))
</script>

<style lang="scss" scoped>
.ui-language-switcher {
  white-space: nowrap;
}

.ui-language-switcher__link {
  text-decoration: none;

  &:hover,
  &.is-active {
    text-decoration: underline;
  }
}
</style>
