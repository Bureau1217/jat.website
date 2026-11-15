<template>
  <nav class="ui-language-switcher" :aria-label="t('Langue')">
    <template v-for="(item, index) in items" :key="item.locale">
      <span v-if="index > 0" aria-hidden="true">/</span>
      <NuxtLink
        :to="item.to"
        :lang="item.locale"
        :hreflang="item.locale"
        class="ui-language-switcher__link u-stable-label"
        :class="{ 'is-active': item.locale === locale }"
        :data-label="item.label"
        :aria-current="item.locale === locale ? 'true' : undefined"
      >
        <span>{{ item.label }}</span>
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
// Flex, centered: the links' invisible width copies (u-stable-label) would
// otherwise shift their baseline against the "/" text.
.ui-language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  white-space: nowrap;
}

// As the navigation links: Gaya on hover and for the current language,
// never underlined, without changing width (u-stable-label, typo.scss).
.ui-language-switcher__link {
  line-height: 24px;
  text-decoration: none;

  &:hover > span,
  &.is-active > span {
    font-family: var(--font-accent);
    font-weight: 400;
  }
}
</style>
