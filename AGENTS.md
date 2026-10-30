# Instructions Claude — front Nuxt (jat.website)

Front Nuxt 4 headless du CMS Kirby jat.cms. Conventions reprises de jav.website.

## Stack

- Nuxt 4 + Vue 3 (`<script setup lang="ts">`), TypeScript strict, SCSS (`sass-embedded`).
- Node : version LTS exacte figée dans `.nvmrc` (lisible par nvm, fnm, vfox).
- Règles du studio : Go Live Kit (`go-live-kit/Nuxt/CLAUDE.md`) — prioritaires. `AGENTS.md` = copie exacte de ce fichier, à garder identique.
- Dernières versions stables, figées dans `package.json` / `package-lock.json`.
- Pas de framework CSS ni de librairie UI : tokens CSS + classes utilitaires maison.

## Données (KQL)

- Le navigateur n'appelle jamais Kirby directement : uniquement les endpoints `server/api/*`, qui utilisent `kqlFetch()` (`server/utils/kql.ts`) avec les identifiants de `runtimeConfig`.
- Les selects KQL réutilisés vivent dans `server/utils/kqlSelects.ts` (`FILE_SELECT`, `EVENT_SELECT`, `PAGE_REF_SELECT`, `BLOCK_SELECT`). Ne pas les dupliquer.
- Tout id de page interpolé dans une requête KQL passe par `sanitizePageId()`.
- Requêter les pages de données par template (`filterBy("intendedTemplate", …)`), jamais par slug.
- Côté serveur, normaliser les valeurs vides Kirby (`""`) en `null` avant de renvoyer au front.
- Les types de retour sont dans `shared/types/kql.ts` (camelCase) ; le contenu brut des blocks dans `shared/types/blocks.ts` (noms de champs Kirby, snake_case).
- Une source de données partagée = un composable `useXxx()` avec un `key` fixe (dédupliqué par Nuxt).

## Blocks

- Un block jat.cms = un fichier `app/components/blocks/<PascalType>.global.vue` (`related-events` → `RelatedEvents.global.vue`, rendu par `components/blocks.vue`).
- Props d'un block : `block: KqlBlock<XxxContent>`, plus `files?: KqlFile[]` et `pages?: KqlPageRefs` s'il résout des refs. Ajouter le type `XxxContent` dans `shared/types/blocks.ts`.
- Blocks imbriqués : `parseKqlBlocks()` puis `<Blocks :blocks :files :pages />`, dans un conteneur `u-nested`.
- Refs : `resolveKqlFile(s)()` pour `file://`, `resolvePageRefs()` / `resolveKirbyLink()` pour `page://` et champs link, `isKirbyTrue()` pour les toggles.
- Un block sans contenu exploitable ne rend rien (`v-if`), plutôt qu'un élément vide ou un lien mort.
- Si un nouveau block ajoute un champ page à résoudre, rien à faire : `fetchPageRefs()` collecte toutes les `page://` automatiquement. Un nouveau champ de page référencée → l'ajouter à `PAGE_REF_SELECT`.

## Composants et styles

- Préfixes : `The*` (unique dans l'app), `Ui*` (réutilisable, `components/ui/`), `Pages*` (template de page), `Blocks*` (block Kirby).
- Classes BEM préfixées : `.v-block-<type>__element--modifier` pour les blocks, `.v-<nom>` pour pages/The*, `.ui-<nom>` pour les Ui*.
- `<style lang="scss" scoped>` ; `:deep()` uniquement pour du HTML injecté (`v-html`).
- Mise en page via les utilitaires de `assets/grid.scss` (`u-flex`, `u-flex--column`, `u-gap-*`, `u-gutter-x`, `u-block`, `u-nested`) ; le CSS scoped ne garde que le spécifique.
- Couleurs, espacements, rayons : uniquement les variables de `assets/main.scss` (`--color-*`, `--spacing-*`, `--radius-*`), jamais de valeur en dur répétée.
- Responsive : les composants réutilisables (`Ui*`, blocks) dépendent de la largeur de **leur conteneur** (`container-type: inline-size` sur la racine, mixins `container-wide` / `container-narrow` / `grid-columns` de `assets/_params.scss`), jamais de la fenêtre. `@media` + `$breakpoint-mobile` seulement pour ce qui concerne la page entière (navigation, footer, templates de page).
- Typo : un mixin par style de la maquette (`t-display`, `t-h1`… `t-small-bold`, `assets/_params.scss`, injecté partout). Dans un composant, `@include t-xxx;` — jamais de `font-size` en dur. Balises nues et classes `.t-*` dans `assets/typo.scss`.
- Tailles en `rem()` (fixe), `fluid(min, max)` (de 375 px à 1440 px, valeur max = maquette) ou `scaled(px)` (fixe jusqu’à 1440 px) — fonctions de `assets/_params.scss`. Au-delà de 1440 px, `fluid()` et `scaled()` grandissent avec l’écran (maquette agrandie) jusqu’à 2560 px. Pas de `max-width` en dur sur le texte : la largeur vient des colonnes de la grille.
- Grille de la maquette : 4 colonnes (`@include grid-columns`, `UiTwoColumns` ¼ + ¾, `UiThreeColumns` ¼ + ½ + ¼), marges `--gutter`, espacements `--space-stack` / `--space-bar` / `--space-section`.
- Images : toujours `UiImage` (srcset des tailles générées par Kirby, `app/utils/imageAttrs.ts` ↔ `FILE_SELECT`), avec `sizes` = largeur réelle affichée, `eager` pour l'image en haut de page.
- SEO : `usePageSeo(page)` (titre, description, canonical, Open Graph) depuis l'onglet « SEO » du Panel avec des valeurs de repli ; `/sitemap.xml` (`server/routes/sitemap.xml.ts`) ; `NUXT_PUBLIC_SITE_URL` en production.
- Couleurs : couleurs de base `--color-*` = variables Figma (mêmes noms) ; fonds nommés `--degrade-*` (color styles Figma, mêmes noms) / `--aplat-*` = listes de stops construites à partir des `--color-*`, peintes par le mixin `fill-background(header|hero|bar)` (sens « Inverser le dégradé » via `--theme-<rôle>-direction`). Thème de page (`u-theme--<theme>` → `--theme-*` : navigation, bandeaux, barres, texte, ancres, fond) déduit de la rubrique dans l'URL (`utils/pageTheme.ts`), pas réglable dans le Panel ; surchargé via `fillStyle()` par la page (fond de la navigation seulement), la section (bandeau, barres) et la sous-section (barre). Liste des fonds dans `utils/fills.ts` = select `fields/fill.yml` de jat.cms. Couleur de texte d'un block (citation) : `colorValue()`, liste `utils/colors.ts` = select `fields/text_color.yml`. Fond de page : `--color-background` partout, dégradé « AGENDA - BACKGROUND » pour le thème Actualités / Agenda (`page-bg` dans `$page-themes`) — fixé dans le code, pas dans le Panel.
- Blocs imbriqués (accordéon, colonnes) : `provideNestedBlocks()` côté conteneur, `useIsNested()` côté block pour basculer en rendu « dans une colonne ».
- Factoriser dans un `Ui*` dès qu'un rendu apparaît dans deux blocks (ex. `UiEventCard`, `UiGallery`, `UiAsideBox`, `UiAsideGallery`, `UiThreeColumns`).

## Code

- Noms de variables, fonctions, composants et commentaires en anglais ; textes visibles en français.
- Typer les props (`defineProps<{…}>()`), les retours de fonctions utilitaires et les réponses `useFetch<T>`.
- Commentaires : expliquer le pourquoi (contrainte Kirby, choix de design), pas le quoi.
- Secrets et variables d’environnement uniquement dans `.env` (non versionné, pas de `.env.example`).

## Vérification avant livraison

- `npm run typecheck` et `npm run build` doivent passer.
- Vérifier le rendu contre le CMS local (`composer start` dans jat.cms).
