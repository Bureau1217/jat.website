# Instructions Claude — front Nuxt (jat.website)

Front Nuxt 4 headless du CMS Kirby jat.cms. Conventions reprises de jav.website.

## Stack

- Nuxt 4 + Vue 3 (`<script setup lang="ts">`), TypeScript strict, SCSS (`sass-embedded`).
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

- Un block jat.cms = un fichier `app/components/blocks/<PascalType>.global.vue` (`columns-2` → `Columns2.global.vue`, rendu par `components/blocks.vue`).
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
- Breakpoint : `$breakpoint-mobile` (injecté automatiquement, `assets/_params.scss`).
- Typo des balises nues dans `assets/typo.scss` ; ne surcharger localement que si le design diffère.
- Factoriser dans un `Ui*` dès qu'un rendu apparaît dans deux blocks (ex. `UiEventCard`, `UiGallery`, `UiAsideBox`).

## Code

- Noms de variables, fonctions, composants et commentaires en anglais ; textes visibles en français.
- Typer les props (`defineProps<{…}>()`), les retours de fonctions utilitaires et les réponses `useFetch<T>`.
- Commentaires : expliquer le pourquoi (contrainte Kirby, choix de design), pas le quoi.
- Secrets dans `.env` (non versionné) ; maintenir `.env.example` à jour.

## Vérification avant livraison

- `npm run typecheck` et `npm run build` doivent passer.
- Vérifier le rendu contre le CMS local (`composer start` dans jat.cms).
