<template>
  <footer class="v-footer">
    <Newsletter />

    <div class="v-footer__main u-gutter-x">
      <div class="v-footer__columns">
        <section v-if="siteInfo?.openingHours.length || address" class="v-footer__column">
          <h2 class="v-footer__title">Infos pratiques</h2>
          <p v-for="slot in siteInfo?.openingHours" :key="slot.days">→ {{ slot.days }}<br>{{ slot.hours }}</p>
          <p v-if="address" class="v-footer__gap">
            <template v-for="line in addressLines" :key="line">{{ line }}<br></template>
          </p>
        </section>

        <section v-if="siteInfo?.phone || siteInfo?.email || siteInfo?.legalLinks.length" class="v-footer__column">
          <h2 class="v-footer__title">Nous contacter</h2>
          <p v-if="siteInfo?.phone"><a :href="`tel:${siteInfo.phone.replace(/\s/g, '')}`">{{ siteInfo.phone }}</a></p>
          <p v-if="siteInfo?.email"><a :href="`mailto:${siteInfo.email}`">{{ siteInfo.email }}</a></p>
          <ul v-if="siteInfo?.legalLinks.length" class="v-footer__gap">
            <li v-for="link in siteInfo.legalLinks" :key="link.label">
              <NuxtLink :to="link.href" class="v-footer__title">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </section>

        <ul v-if="siteInfo?.socialLinks.length" class="v-footer__column">
          <li v-for="link in siteInfo.socialLinks" :key="link.label">
            <a :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
          </li>
        </ul>

        <section v-if="siteInfo?.vhssReferents.length" class="v-footer__column">
          <h2 class="v-footer__title">Référent·es VHSS</h2>
          <p v-for="referent in siteInfo.vhssReferents" :key="referent.name" class="v-footer__name">
            <a v-if="referent.contact" :href="referent.contact">{{ referent.name }}</a>
            <template v-else>{{ referent.name }}</template>
          </p>
        </section>

        <section v-if="siteInfo?.disabilityReferents.length" class="v-footer__column">
          <h2 class="v-footer__title">{{ siteInfo.disabilityReferents.length > 1 ? 'Référent·es handicap' : 'Référent·e handicap' }}</h2>
          <p v-for="referent in siteInfo.disabilityReferents" :key="referent.name" class="v-footer__name">
            <a v-if="referent.contact" :href="referent.contact">{{ referent.name }}</a>
            <template v-else>{{ referent.name }}</template>
          </p>
        </section>

        <nav v-if="siteInfo?.footerPages.length" class="v-footer__column" aria-label="Pages du pied de page">
          <ul>
            <li v-for="page in siteInfo.footerPages" :key="page.id">
              <NuxtLink :to="pagePath(page)">{{ page.title }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <FooterWordmark />
  </footer>
</template>

<script setup lang="ts">
// Same on every page (unlike the header, it has no page theme): newsletter
// band, then the columns of the mockup. Everything comes from
// « Informations générales » in the Panel; each item only shows once filled.
const { data: siteInfo } = await useSiteInfo()

const address = computed(() => siteInfo.value?.address ?? null)
const addressLines = computed(() => {
  const a = address.value
  if (!a) return []
  return [
    [a.number, a.street].filter(Boolean).join(' '),
    [a.postalCode, a.city].filter(Boolean).join(' ')
  ].filter((line): line is string => Boolean(line))
})
</script>

<style lang="scss" scoped>
// Mockup: bordeaux band (« Couleur Footer »), text in the page background
// color, everything in small bold.
.v-footer {
  @include t-small-bold;
  color: var(--color-background);

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.v-footer__main {
  // No bottom padding: the wordmark below sets the gap (mockup: 112px).
  padding-top: var(--spacing-2xl);
  background: var(--color-footer);
}

.v-footer__columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--spacing-2xl) var(--spacing-3xl);
}

.v-footer__column {
  min-width: rem(140px);
}

// Same small bold as the rest of the footer (overrides the global h2 style).
.v-footer__title {
  @include t-small-bold;
  margin: 0;
  text-transform: none;
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.v-footer__gap {
  margin-top: var(--spacing-l);
}

// Referents in Gaya italic, as in the mockup.
.v-footer__name {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}
</style>
