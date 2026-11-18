<template>
  <div v-if="siteInfo" class="ui-practical-info">
    <div class="ui-practical-info__inner">
      <UiMap v-if="mapAddress" :address="mapAddress" class="ui-practical-info__map" />

      <!-- Left: contact, then hours. Right: transports, then disability. -->
      <div class="ui-practical-info__columns">
        <div class="u-flex u-flex--column u-gap-2xl">
          <section v-if="addressLines.length || siteInfo.email || siteInfo.phone" class="u-flex u-flex--column u-gap-s">
            <h3 class="ui-practical-info__title">{{ t('Informations pratiques') }}</h3>
            <p v-if="addressLines.length">
              <template v-for="line in addressLines" :key="line">{{ line }}<br></template>
            </p>
            <p v-if="siteInfo.email">
              <a :href="`mailto:${siteInfo.email}`">{{ siteInfo.email }}</a>
            </p>
            <p v-if="siteInfo.phone">
              <a :href="`tel:${siteInfo.phone.replace(/\s/g, '')}`">{{ siteInfo.phone }}</a>
            </p>
          </section>

          <section v-if="siteInfo.openingHours.length" class="u-flex u-flex--column u-gap-s">
            <h3 class="ui-practical-info__title">{{ t('Horaires d’ouverture') }}</h3>
            <p v-for="slot in siteInfo.openingHours" :key="slot.days">
              {{ slot.days }}<br>{{ slot.hours }}
            </p>
          </section>
        </div>

        <div class="u-flex u-flex--column u-gap-2xl">
          <section v-if="siteInfo.transports.length" class="u-flex u-flex--column u-gap-s">
            <h3 class="ui-practical-info__title">{{ t('Transports') }}</h3>
            <p v-for="transport in siteInfo.transports" :key="transport.travelTime + transport.lines">
              {{ transport.travelTime }} : {{ transport.lines }}
            </p>
          </section>

          <section v-if="siteInfo.disabilityReferents.length || siteInfo.accessibilityText" class="u-flex u-flex--column u-gap-s">
            <h3 class="ui-practical-info__title">{{ t('Situation de handicap') }}</h3>
            <p v-if="siteInfo.disabilityReferents.length">
              {{ t(siteInfo.disabilityReferents.length > 1 ? 'Personnes référentes' : 'Personne référente') }} :
              <template v-for="referent in siteInfo.disabilityReferents" :key="referent.name">
                <br>
                <a v-if="referent.contact" :href="referent.contact">{{ referent.name }}</a>
                <template v-else>{{ referent.name }}</template>
              </template>
            </p>
            <UiRichText v-if="siteInfo.accessibilityText" :html="siteInfo.accessibilityText" />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Address, contacts, transports, hours, disability info and map, from
 * "Informations générales" — Infos pratiques block, `informations` page.
 */
const { data: siteInfo } = await useSiteInfo()

const addressLines = computed(() => {
  const address = siteInfo.value?.address
  if (!address) return []
  return [
    address.name,
    [address.number, address.street].filter(Boolean).join(' '),
    [address.postalCode, address.city].filter(Boolean).join(' ')
  ].filter((line): line is string => Boolean(line))
})

// The map needs at least a street or a city to geocode; the name alone
// ("Jazz à Tours") would be a guess.
const mapAddress = computed(() => {
  const address = siteInfo.value?.address
  if (!address || !(address.street || address.city)) return null
  return addressLines.value.slice(address.name ? 1 : 0).join(', ')
})
</script>

<style lang="scss" scoped>
// Map on the left, the information on the right (home page mockup).
.ui-practical-info__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4xl);
  align-items: start;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}

.ui-practical-info__columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-2xl) var(--spacing-4xl);

  p {
    font-size: 20px;
    line-height: 1.24;
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.ui-practical-info__title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 20px;
  line-height: 1.24;
}

.ui-practical-info__map {
  width: 100%;
  aspect-ratio: 646 / 326;

  @media (max-width: $breakpoint-mobile) {
    grid-row: 2;
  }
}
</style>
