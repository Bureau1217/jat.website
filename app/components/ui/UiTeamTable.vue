<template>
  <div class="ui-team-table">
    <div class="ui-team-table__table">
      <div v-if="isTeaching" class="ui-team-table__row ui-team-table__row--header" aria-hidden="true">
        <span>{{ t('Enseignant·es') }}</span>
        <span>{{ t('Instruments') }}</span>
        <span>{{ t('Ateliers') }}</span>
      </div>

      <component
        :is="member.profile ? 'details' : 'div'"
        v-for="member in members"
        :key="member.id"
        class="ui-team-table__member"
        :open="member.profile && open ? true : undefined"
      >
        <component :is="member.profile ? 'summary' : 'div'" class="ui-team-table__row">
          <span class="ui-team-table__name">{{ member.title }}</span>
          <span class="ui-team-table__lines">
            <span v-for="(line, index) in detailLines(member)" :key="index">{{ line }}</span>
          </span>
          <span class="ui-team-table__lines">
            <template v-if="isTeaching">
              <NuxtLink v-for="course in member.courses" :key="course.id" :to="pagePath(course)">{{ course.title }}</NuxtLink>
              <span v-if="!member.courses.length">/</span>
            </template>
            <template v-else>
              <a v-if="member.phone" :href="`tel:${member.phone.replace(/\s/g, '')}`" class="ui-team-table__contact">{{ member.phone }}</a>
              <a v-if="member.email" :href="`mailto:${member.email}`" class="ui-team-table__contact">{{ member.phone ? member.email : t('contacter') }}</a>
            </template>
          </span>
        </component>

        <div v-if="member.profile" class="ui-team-table__profile">
          <div class="ui-team-table__profile-side u-flex u-flex--column u-gap-2xl">
            <div class="ui-team-table__photo">
              <UiImage v-if="member.photo" :file="member.photo" cover />
            </div>
            <div v-for="list in profileLists(member.profile)" :key="list.label" class="u-flex u-flex--column u-gap-xs">
              <h4 class="ui-team-table__label">{{ t(list.label) }}</h4>
              <UiRichText :html="list.html" class="ui-team-table__light" />
            </div>
            <div v-if="links(member).length" class="u-flex u-flex--column u-gap-xs">
              <h4 class="ui-team-table__label">{{ t('Liens') }}</h4>
              <ul class="u-flex u-flex--column u-gap-xs">
                <li v-for="link in links(member)" :key="link.url">
                  <a :href="link.url" target="_blank" rel="noopener" class="ui-team-table__link">{{ link.label }}</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="ui-team-table__profile-main u-flex u-flex--column u-gap-2xl">
            <div v-if="member.profile.bio" class="u-flex u-flex--column u-gap-xs">
              <h4 class="ui-team-table__label">{{ t('Parcours') }}</h4>
              <UiRichText :html="member.profile.bio" wide class="ui-team-table__light" />
            </div>
            <iframe
              v-for="video in videos(member.profile)"
              :key="video"
              :src="video"
              class="ui-team-table__video"
              :title="t('Vidéo')"
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowfullscreen
            />
            <button type="button" class="ui-team-table__collapse" @click="collapse">{{ t('réduire la fiche') }}</button>
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlTeamMember, KqlTeamMemberProfile } from '~~/shared/types/kql'

/**
 * Team members as a table: name · function or instrument · contact or
 * courses. A member with a "Fiche dépliable" opens under its row (already
 * open with `open`, on the member's own page). Team block, team pages.
 */
const props = defineProps<{
  members: KqlTeamMember[]
  open?: boolean
}>()

const members = computed(() => props.members)

// Teaching staff (instruments filled in): instrument / courses columns.
const isTeaching = computed(() => members.value.some(member => member.instrument))

function detailLines(member: KqlTeamMember): string[] {
  const text = isTeaching.value ? member.instrument : member.role
  return text ? text.split(/\s*,\s*/) : ['/']
}

function profileLists(profile: KqlTeamMemberProfile) {
  return [
    { label: 'Cursus', html: profile.cursus },
    { label: 'Groupe·s', html: profile.bands },
    { label: 'Collaborations', html: profile.collaborations }
  ].filter((list): list is { label: string, html: string } => !!list.html)
}

// The personal website leads the links, as in the mockup.
function links(member: KqlTeamMember) {
  const website = member.websiteUrl ? [{ label: member.title, url: member.websiteUrl }] : []
  return [...website, ...(member.profile?.links ?? [])]
}

function videos(profile: KqlTeamMemberProfile): string[] {
  return profile.videos.map(videoEmbedUrl).filter((url): url is string => !!url)
}

function collapse(event: MouseEvent) {
  const details = (event.currentTarget as HTMLElement).closest('details')
  if (!details) return
  details.open = false
  details.scrollIntoView({ block: 'nearest' })
}
</script>

<style lang="scss" scoped>
// Same ¼ / ¾ grid as the Paragraph block: the table sits in the ¾ column.
.ui-team-table {
  container-type: inline-size;
}

.ui-team-table__table {
  @container (min-width: 900px) {
    margin-left: calc(25% + var(--spacing-xl) * 0.75);
  }
}

.ui-team-table__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  padding-block: var(--spacing-m);
  border-bottom: 1px solid currentColor;
  font-size: 20px;
  line-height: 1.24;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xxs);
    font-size: 18px;
  }
}

summary.ui-team-table__row {
  cursor: pointer;

  &:hover .ui-team-table__name {
    text-decoration: underline;
  }
}

.ui-team-table__row--header,
.ui-team-table__name {
  font-weight: 700;
}

.ui-team-table__row--header {
  @media (max-width: $breakpoint-mobile) {
    display: none;
  }
}

// Members with a profile: the name reads as a link (Gaya, as in the mockup).
details > summary .ui-team-table__name {
  font-family: var(--font-accent);
  font-weight: 400;
}

.ui-team-table__lines {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
}

.ui-team-table__contact,
.ui-team-table__link {
  text-decoration: underline;
}

.ui-team-table__profile {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-xl);
  padding-block: var(--spacing-2xl);
  border-bottom: 1px solid currentColor;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.ui-team-table__photo {
  aspect-ratio: 292 / 250;
  background: var(--color-surface);
  overflow: hidden;

  &:empty {
    display: none;
  }
}

.ui-team-table__label {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 20px;
  line-height: 1.24;
}

// Writer HTML: v-html content, hence :deep().
.ui-team-table__light :deep(p) {
  margin-bottom: 0;
  font-size: 20px;
  line-height: 1.24;
}

.ui-team-table__video {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
}

.ui-team-table__collapse {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font-family: var(--font-accent);
  font-size: 21px;
  cursor: pointer;
}
</style>
