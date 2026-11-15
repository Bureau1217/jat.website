<template>
  <footer class="v-footer">
    <div class="v-footer__newsletter u-gutter-x">
      <div class="u-flex u-flex--column u-gap-xs">
        <p v-if="siteInfo?.newsletter.text" class="v-footer__newsletter-text">{{ siteInfo.newsletter.text }}</p>
        <h2 class="v-footer__newsletter-title">Newsletter</h2>
      </div>
      <form
        v-if="siteInfo?.newsletter.action"
        :action="siteInfo.newsletter.action"
        method="post"
        target="_blank"
        class="v-footer__form"
      >
        <label class="u-visually-hidden" for="v-footer-email">{{ t('E-mail') }}</label>
        <input id="v-footer-email" name="EMAIL" type="email" required autocomplete="email" :placeholder="t('e-mail')" class="v-footer__input">
        <label class="u-visually-hidden" for="v-footer-first-name">{{ t('Prénom') }}</label>
        <input id="v-footer-first-name" name="FNAME" type="text" autocomplete="given-name" :placeholder="t('Prénom')" class="v-footer__input">
        <label class="u-visually-hidden" for="v-footer-last-name">{{ t('Nom') }}</label>
        <input id="v-footer-last-name" name="LNAME" type="text" autocomplete="family-name" :placeholder="t('Nom')" class="v-footer__input">
        <button type="submit" class="v-footer__submit">{{ t('S’inscrire') }}</button>
      </form>
    </div>

    <div class="v-footer__main">
      <div class="v-footer__columns u-gutter-x">
        <section v-if="siteInfo?.openingHours.length || addressLines.length">
          <h3 class="v-footer__title">{{ t('Infos pratiques') }}</h3>
          <p v-for="slot in siteInfo?.openingHours" :key="slot.days">→ {{ slot.days }}<br>{{ slot.hours }}</p>
          <p v-if="addressLines.length" class="v-footer__spaced">
            <template v-for="line in addressLines" :key="line">{{ line }}<br></template>
          </p>
        </section>

        <section>
          <h3 v-if="siteInfo?.email || siteInfo?.phone" class="v-footer__title">{{ t('Nous contacter') }}</h3>
          <p v-if="siteInfo?.phone"><a :href="`tel:${siteInfo.phone.replace(/\s/g, '')}`">{{ siteInfo.phone }}</a></p>
          <p v-if="siteInfo?.email"><a :href="`mailto:${siteInfo.email}`">{{ siteInfo.email }}</a></p>
          <p v-for="link in siteInfo?.legalLinks" :key="link.label" class="v-footer__spaced">
            <NuxtLink :to="localHref(link.href)" class="v-footer__title">{{ t(link.label) }}</NuxtLink>
          </p>
        </section>

        <ul v-if="siteInfo?.socialLinks.length">
          <li v-for="link in siteInfo.socialLinks" :key="link.label">
            <a :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
          </li>
        </ul>

        <section v-if="siteInfo?.vhssReferents.length">
          <h3 class="v-footer__title">{{ t('Référent·es VHSS') }}</h3>
          <UiFooterReferents :referents="siteInfo.vhssReferents" />
        </section>

        <section v-if="siteInfo?.disabilityReferents.length">
          <h3 class="v-footer__title">{{ t(siteInfo.disabilityReferents.length > 1 ? 'Référent·es handicap' : 'Référent·e handicap') }}</h3>
          <UiFooterReferents :referents="siteInfo.disabilityReferents" />
        </section>

        <ul v-if="siteInfo?.footerPages.length">
          <li v-for="page in siteInfo.footerPages" :key="page.id">
            <NuxtLink :to="pagePath(page)">{{ page.title }}</NuxtLink>
          </li>
        </ul>

        <UiLanguageSwitcher />
      </div>

      <div class="v-footer__signature" aria-hidden="true">Jazz à Tours</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { stripLocale, withLocale } from '~~/shared/utils/locales'

// Same on every page (unlike the header, it has no page theme). Everything
// comes from "Informations générales" in the Panel; each item is only shown
// once an editor has filled it in. Map and transports live in the
// "Infos pratiques" block.
const { data: siteInfo } = await useSiteInfo()

// Legal pages come as site paths ("/mentions-legales", "/en/…" when Kirby
// answers in English): normalised to the current language. Anything else (external URL) is left as is.
const locale = useLocale()
function localHref(href: string): string {
  return href.startsWith('/') ? withLocale(stripLocale(href), locale.value) : href
}

const addressLines = computed(() => {
  const address = siteInfo.value?.address
  if (!address) return []
  return [
    [address.number, address.street].filter(Boolean).join(' '),
    [address.postalCode, address.city].filter(Boolean).join(' ')
  ].filter(Boolean)
})
</script>

<style lang="scss" scoped>
.v-footer {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.28;

  p {
    font-size: inherit;
    line-height: inherit;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.v-footer__newsletter {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-2xl);
  padding-block: var(--spacing-2xl);
  background: var(--color-secondaire-6);
  color: var(--color-footer);
}

.v-footer__newsletter-title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 79px;
  line-height: 1;
  text-transform: uppercase;

  @media (max-width: $breakpoint-mobile) {
    font-size: 44px;
  }
}

.v-footer__form {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--spacing-xl);
  max-width: 800px;
}

.v-footer__input,
.v-footer__submit {
  height: 50px;
  padding-inline: var(--spacing-l);
  border: 1px solid currentColor;
  border-radius: var(--radius-pill);
  background: var(--color-secondaire-2);
  color: inherit;
  font: inherit;
  font-weight: 400;
}

.v-footer__input {
  flex: 1 1 200px;

  &::placeholder {
    color: inherit;
  }
}

.v-footer__submit {
  cursor: pointer;
}

.v-footer__main {
  overflow: hidden;
  background: var(--color-footer);
  color: var(--color-background);
}

.v-footer__columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--spacing-2xl);
  padding-block: var(--spacing-2xl) var(--spacing-4xl);
}

.v-footer__title {
  font-family: var(--font-body);
  font-size: inherit;
  font-weight: 700;
  text-decoration: underline;
}

.v-footer__spaced {
  margin-top: var(--spacing-xl);
}

// Giant cropped signature at the bottom (the mockup masks its lower part).
.v-footer__signature {
  height: 0.62em;
  overflow: hidden;
  font-family: var(--font-heading);
  font-size: clamp(80px, 19vw, 274px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.011em;
  text-align: center;
  white-space: nowrap;
}
</style>
