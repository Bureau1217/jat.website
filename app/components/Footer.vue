<template>
  <footer class="v-footer">
    <div class="v-footer__newsletter u-gutter-x">
      <div class="u-flex u-flex--column u-gap-xs">
        <p class="v-footer__newsletter-text">{{ siteInfo?.newsletter.text ?? t('Pour vous tenir au courant de l’actualité de l’école, inscrivez-vous à notre') }}</p>
        <h2 class="v-footer__newsletter-title">Newsletter</h2>
      </div>
      <form
        :action="nativeAction"
        method="post"
        target="_blank"
        class="v-footer__form"
        @submit="onSubmit"
      >
        <label class="u-visually-hidden" for="v-footer-email">{{ t('E-mail') }}</label>
        <input id="v-footer-email" v-model="email" name="EMAIL" type="email" required autocomplete="email" :placeholder="t('e-mail')" class="v-footer__input">
        <label class="u-visually-hidden" for="v-footer-first-name">{{ t('Prénom') }}</label>
        <input id="v-footer-first-name" v-model="firstName" name="FNAME" type="text" autocomplete="given-name" :placeholder="t('Prénom')" class="v-footer__input">
        <label class="u-visually-hidden" for="v-footer-last-name">{{ t('Nom') }}</label>
        <input id="v-footer-last-name" v-model="lastName" name="LNAME" type="text" autocomplete="family-name" :placeholder="t('Nom')" class="v-footer__input">
        <button type="submit" class="v-footer__submit" :disabled="sending">{{ t('S’inscrire') }}</button>
        <p class="v-footer__newsletter-status" aria-live="polite">{{ statusMessage }}</p>
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

        <!-- Last column: FR / EN on top, the legal links at the bottom, on
             the line of the postal code (first column). -->
        <div class="v-footer__end">
          <UiLanguageSwitcher class="v-footer__languages" />
          <ul v-if="siteInfo?.legalLinks.length" class="v-footer__legal">
            <li v-for="link in siteInfo.legalLinks" :key="link.label">
              <NuxtLink :to="localHref(link.href)" class="v-footer__title">{{ t(link.label) }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="v-footer__signature" aria-hidden="true">Jazz à Tours</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { NewsletterResponse } from '~~/shared/types/newsletter'
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

// Newsletter, always shown (mockup): with Mailchimp configured on the
// server, the form posts to /api/newsletter and answers in place; else it
// posts natively to the e-mailing tool's form address set in the Panel (new
// tab); with neither, /api/newsletter answers that sign-up opens soon.
const nativeAction = computed(() => (siteInfo.value?.newsletter.api ? undefined : siteInfo.value?.newsletter.action ?? undefined))
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const sending = ref(false)
const status = ref<NewsletterResponse['status'] | null>(null)

const STATUS_MESSAGES: Record<NewsletterResponse['status'], string> = {
  success: 'Merci, vous êtes inscrit·e à la newsletter.',
  invalid: 'L’adresse e-mail n’est pas valide.',
  unavailable: 'L’inscription à la newsletter ouvre bientôt.',
  error: 'Une erreur est survenue, réessayez ou écrivez-nous.'
}
const statusMessage = computed(() => (status.value ? t(STATUS_MESSAGES[status.value]) : ''))

async function onSubmit(submitEvent: Event): Promise<void> {
  if (nativeAction.value) return
  submitEvent.preventDefault()
  sending.value = true
  try {
    const response = await $fetch<NewsletterResponse>('/api/newsletter', {
      method: 'POST',
      body: { email: email.value, firstName: firstName.value, lastName: lastName.value }
    })
    status.value = response.status
    email.value = firstName.value = lastName.value = ''
  } catch (error) {
    // Validation / not configured / Mailchimp errors come back with a status.
    status.value = (error as { data?: NewsletterResponse }).data?.status ?? 'error'
  } finally {
    sending.value = false
  }
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

// Desktop: the three fields and « S'inscrire » on one line, the button at
// its right end. Mobile: the fields stack, the button stays on the right.
.v-footer__form {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  gap: var(--spacing-xl);
  max-width: 900px;

  // Mobile: everything stacks, « S'inscrire » full width under the fields.
  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    gap: var(--spacing-m);
  }
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

  @media (max-width: $breakpoint-mobile) {
    flex: none;
  }

  min-width: 0;

  &::placeholder {
    color: inherit;
  }
}

// The fields' colors inverted, so the action stands apart from them.
.v-footer__submit {
  flex: none;
  margin-left: auto;
  border-color: var(--color-footer);
  background: var(--color-footer);
  color: var(--color-secondaire-2);
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: var(--color-secondaire-2);
    color: var(--color-footer);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  @media (max-width: $breakpoint-mobile) {
    margin-left: 0;
  }
}

.v-footer__newsletter-status {
  flex-basis: 100%;
  text-align: right;

  @media (max-width: $breakpoint-mobile) {
    text-align: left;
  }

  &:empty {
    display: none;
  }
}

.v-footer__main {
  overflow: hidden;
  background: var(--color-footer);
  color: var(--color-background);
}

// Desktop: one row of columns spread over the width (mockup). Mobile: one
// column (two left addresses and names wrapping word by word).
.v-footer__columns {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  gap: var(--spacing-xl) var(--spacing-2xl);
  padding-block: var(--spacing-2xl) var(--spacing-4xl);

  @media (max-width: $breakpoint-mobile) {
    grid-auto-flow: row;
    grid-template-columns: 1fr;
    justify-content: stretch;
  }
}

// As tall as the row (the « Infos pratiques » column, the tallest): the
// legal links at its bottom sit on the line of the postal code.
.v-footer__end {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-xl);
}

.v-footer__languages {
  align-self: flex-start;
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
  // Its whole width at any screen size (no lower bound: it'd overflow a phone).
  font-size: min(18.5vw, 274px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.011em;
  text-align: center;
  white-space: nowrap;
}
</style>
