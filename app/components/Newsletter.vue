<template>
  <section class="v-newsletter u-gutter-x" aria-labelledby="v-newsletter-title">
    <p v-if="text" class="v-newsletter__text">{{ text }}</p>
    <form class="v-newsletter__row" @submit.prevent="subscribe">
      <h2 id="v-newsletter-title" class="v-newsletter__title">Newsletter</h2>
      <div class="v-newsletter__fields">
        <label class="v-newsletter__field">
          <span class="u-visually-hidden">E-mail (obligatoire)</span>
          <input v-model="email" type="email" name="email" autocomplete="email" placeholder="E-mail" required>
        </label>
        <label class="v-newsletter__field">
          <span class="u-visually-hidden">Prénom</span>
          <input v-model="firstName" type="text" name="firstName" autocomplete="given-name" placeholder="Prénom">
        </label>
        <label class="v-newsletter__field">
          <span class="u-visually-hidden">Nom</span>
          <input v-model="lastName" type="text" name="lastName" autocomplete="family-name" placeholder="Nom">
        </label>
        <button type="submit" class="v-newsletter__submit" :disabled="state === 'sending'">S’inscrire</button>
      </div>
      <p class="v-newsletter__status" aria-live="polite">{{ message }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import type { NewsletterResponse } from '~~/shared/types/newsletter'

/**
 * Newsletter band at the top of the footer (mockup): invitation sentence
 * from « Informations générales », then e-mail, first and last name. Posts
 * to /api/newsletter (Mailchimp, as on jav.website).
 */
const { data: siteInfo } = await useSiteInfo()
const text = computed(() => siteInfo.value?.newsletterText ?? 'Pour vous tenir au courant de l’actualité de l’école, inscrivez-vous à notre')

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const state = ref<'idle' | 'sending' | NewsletterResponse['status']>('idle')
const message = ref('')

async function subscribe(): Promise<void> {
  state.value = 'sending'
  message.value = 'Envoi…'
  try {
    const response = await $fetch<NewsletterResponse>('/api/newsletter', {
      method: 'POST',
      body: { email: email.value, firstName: firstName.value, lastName: lastName.value }
    })
    state.value = response.status
    message.value = response.message
    email.value = firstName.value = lastName.value = ''
  } catch (error) {
    // Validation / not configured / Mailchimp errors come back with a message.
    const answer = (error as { data?: NewsletterResponse }).data
    state.value = answer?.status ?? 'error'
    message.value = answer?.message ?? 'Une erreur est survenue, réessayez ou écrivez-nous.'
  }
}
</script>

<style lang="scss" scoped>
// Mockup: apricot band, footer bordeaux text, lime pill fields.
.v-newsletter {
  padding-block: var(--spacing-3xl);
  background: var(--color-secondaire-6);
  color: var(--color-footer);
}

.v-newsletter__text {
  @include t-small-bold;
}

.v-newsletter__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-s) var(--grid-gap);
}

.v-newsletter__title {
  @include t-newsletter;
  line-height: 1.1;
}

.v-newsletter__fields {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--spacing-m) var(--spacing-2xl);
  min-width: min(100%, #{rem(320px)});
}

.v-newsletter__field {
  flex: 1 1 rem(180px);
  max-width: rem(260px);

  @media (max-width: $breakpoint-mobile) {
    max-width: none;
  }
}

.v-newsletter__field input,
.v-newsletter__submit {
  @include t-small;
  width: 100%;
  min-height: rem(46px);
  padding: var(--spacing-xs) var(--spacing-l);
  color: var(--color-footer);
  background: var(--color-secondaire-2);
  border: 1px solid var(--color-footer);
  border-radius: var(--radius-pill);
}

.v-newsletter__field input {
  &::placeholder {
    color: var(--color-footer);
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid var(--color-footer);
    outline-offset: 2px;
  }
}

.v-newsletter__submit {
  width: auto;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
}

.v-newsletter__status {
  @include t-small-bold;
  flex-basis: 100%;

  &:empty {
    display: none;
  }
}
</style>
