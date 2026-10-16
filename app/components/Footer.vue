<template>
  <footer class="v-footer">
    <h2 class="v-footer__heading u-gutter-x">Infos pratiques</h2>

    <div class="v-footer__body u-block u-flex u-flex--column u-gap-5xl">
      <div class="v-footer__grid">
        <UiMap v-if="mapAddress" :address="mapAddress" class="v-footer__map" />

        <div class="u-flex u-flex--column u-gap-2xl">
          <section v-if="address || siteInfo?.email || siteInfo?.phone" class="u-flex u-flex--column u-gap-s">
            <h3 class="v-footer__title">Informations pratiques</h3>
            <p v-if="address">
              <template v-for="line in addressLines" :key="line">{{ line }}<br></template>
            </p>
            <p v-if="siteInfo?.email">
              <a :href="`mailto:${siteInfo.email}`">{{ siteInfo.email }}</a>
            </p>
            <p v-if="siteInfo?.phone">
              <a :href="`tel:${siteInfo.phone.replace(/\s/g, '')}`">{{ siteInfo.phone }}</a>
            </p>
          </section>

          <section v-if="siteInfo?.transports.length" class="u-flex u-flex--column u-gap-s">
            <h3 class="v-footer__title">Transports</h3>
            <p v-for="transport in siteInfo.transports" :key="transport.travelTime + transport.lines">
              {{ transport.travelTime }} : {{ transport.lines }}
            </p>
          </section>
        </div>

        <div class="u-flex u-flex--column u-gap-2xl">
          <section v-if="siteInfo?.openingHours.length" class="u-flex u-flex--column u-gap-s">
            <h3 class="v-footer__title">Horaires d’ouverture</h3>
            <p v-for="slot in siteInfo.openingHours" :key="slot.days">
              {{ slot.days }}<br>{{ slot.hours }}
            </p>
          </section>

          <section v-if="siteInfo?.disabilityReferents.length || siteInfo?.accessibilityText" class="u-flex u-flex--column u-gap-s">
            <h3 class="v-footer__title">Situation de handicap</h3>
            <p v-if="siteInfo.disabilityReferents.length">
              {{ siteInfo.disabilityReferents.length > 1 ? 'Personnes référentes' : 'Personne référente' }} :
              <template v-for="referent in siteInfo.disabilityReferents" :key="referent.name">
                <br>
                <a v-if="referent.contact" :href="referent.contact">{{ referent.name }}</a>
                <template v-else>{{ referent.name }}</template>
              </template>
            </p>
            <UiRichText v-if="siteInfo.accessibilityText" :html="siteInfo.accessibilityText" class="v-footer__accessibility" />
          </section>
        </div>
      </div>

      <div class="v-footer__bottom u-flex u-flex--justify-between u-gap-xl u-flex--wrap">
        <ul v-if="siteInfo?.socialLinks.length" class="u-flex u-gap-l u-flex--wrap">
          <li v-for="link in siteInfo.socialLinks" :key="link.label">
            <a :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
          </li>
        </ul>
        <ul class="u-flex u-gap-l u-flex--wrap">
          <li v-for="page in siteInfo?.footerPages" :key="page.id">
            <NuxtLink :to="pagePath(page)">{{ page.title }}</NuxtLink>
          </li>
          <li v-for="link in siteInfo?.legalLinks" :key="link.label">
            <NuxtLink :to="link.href">{{ link.label }}</NuxtLink>
          </li>
          <li>© {{ new Date().getFullYear() }} Jazz à Tours</li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Same on every page (unlike the header, it has no page theme). Everything
// comes from "Informations générales" in the Panel; each item is only shown
// once an editor has filled it in.
const { data: siteInfo } = await useSiteInfo()

const address = computed(() => siteInfo.value?.address ?? null)
const addressLines = computed(() => {
  const a = address.value
  if (!a) return []
  return [
    a.name,
    [a.number, a.street].filter(Boolean).join(' '),
    [a.postalCode, a.city].filter(Boolean).join(' ')
  ].filter((line): line is string => Boolean(line))
})

// The map needs at least a street or a city to geocode; the name alone
// ("Jazz à Tours") would be a guess.
const mapAddress = computed(() => {
  const a = address.value
  if (!a || !(a.street || a.city)) return null
  return addressLines.value.slice(a.name ? 1 : 0).join(', ')
})
</script>

<style lang="scss" scoped>
.v-footer {
  background: var(--color-jat-peach);
  color: var(--color-jat-bordeaux);

  p {
    font-size: 18px;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// Fades in from the footer background, as the section headings of the
// mockup do.
.v-footer__heading {
  padding-block: var(--spacing-4xl) var(--spacing-l);
  background: var(--theme-spaces-gradient);
  color: var(--color-jat-sand);
  font-size: 64px;
  text-transform: uppercase;

  @media (max-width: $breakpoint-mobile) {
    font-size: 40px;
  }
}

.v-footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--spacing-5xl);
  align-items: start;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

.v-footer__map {
  border-radius: 0;
}

.v-footer__title {
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 700;
}

.v-footer__bottom {
  padding-top: var(--spacing-xl);
  border-top: 1px solid currentColor;
  font-size: 14px;
}

.v-footer__accessibility {
  :deep(p) {
    font-size: 16px;
  }
}
</style>
