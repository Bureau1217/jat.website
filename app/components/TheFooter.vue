<template>
  <footer class="v-footer u-block u-flex u-flex--column u-gap-3xl">
    <div class="v-footer__columns">
      <div v-if="address" class="v-footer__col u-flex u-flex--column">
        <span v-if="address.name" class="v-footer__strong">{{ address.name }}</span>
        <span v-if="addressLine1">{{ addressLine1 }}</span>
        <span v-if="addressLine2">{{ addressLine2 }}</span>
      </div>

      <div v-if="siteInfo?.email || siteInfo?.phone" class="v-footer__col u-flex u-flex--column">
        <a v-if="siteInfo.email" :href="`mailto:${siteInfo.email}`">{{ siteInfo.email }}</a>
        <a v-if="siteInfo.phone" :href="`tel:${siteInfo.phone.replace(/\s/g, '')}`">{{ siteInfo.phone }}</a>
      </div>

      <dl v-if="siteInfo?.openingHours.length" class="v-footer__col v-footer__hours u-flex u-flex--column">
        <div v-for="slot in siteInfo.openingHours" :key="slot.days">
          <dt class="v-footer__strong">{{ slot.days }}</dt>
          <dd>{{ slot.hours }}</dd>
        </div>
      </dl>

      <nav v-if="siteInfo?.footerPages.length" class="v-footer__col u-flex u-flex--column" aria-label="Navigation du pied de page">
        <NuxtLink v-for="page in siteInfo.footerPages" :key="page.id" :to="pagePath(page)">{{ page.title }}</NuxtLink>
      </nav>
    </div>

    <div class="v-footer__bottom u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
      <ul v-if="siteInfo?.socialLinks.length" class="u-flex u-gap-l u-flex--wrap">
        <li v-for="link in siteInfo.socialLinks" :key="link.label">
          <a :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
        </li>
      </ul>
      <ul class="u-flex u-gap-l u-flex--wrap">
        <li v-for="link in siteInfo?.legalLinks" :key="link.label">
          <NuxtLink :to="link.href">{{ link.label }}</NuxtLink>
        </li>
        <li>© {{ new Date().getFullYear() }} JAT</li>
      </ul>
    </div>

    <UiRichText v-if="siteInfo?.accessibilityText" :html="siteInfo.accessibilityText" class="v-footer__accessibility" />
  </footer>
</template>

<script setup lang="ts">
// Everything here comes from "Informations générales" in the Panel; each
// item is only shown once an editor has filled it in.
const { data: siteInfo } = await useSiteInfo()

const address = computed(() => siteInfo.value?.address ?? null)
const addressLine1 = computed(() => {
  const a = address.value
  return a ? [a.street, a.number].filter(Boolean).join(' ') : ''
})
const addressLine2 = computed(() => {
  const a = address.value
  return a ? [a.postalCode, a.city].filter(Boolean).join(' ') : ''
})
</script>

<style lang="scss" scoped>
.v-footer {
  background: var(--color-text);
  color: var(--color-background);
  font-size: 16px;
  line-height: 1.6;

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.v-footer__columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-2xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.v-footer__strong {
  font-weight: 700;
}

.v-footer__hours {
  margin: 0;

  dd {
    margin: 0;
  }
}

.v-footer__accessibility {
  opacity: 0.7;

  :deep(p) {
    font-size: 13px;
  }
}
</style>
