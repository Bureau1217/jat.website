# jat.website

Front Nuxt de JAT, alimenté par le CMS Kirby headless [jat.cms](https://github.com/Bureau1217/jat.cms) via [KQL](https://github.com/getkirby/kql).

## Installation

```sh
cp .env.example .env   # puis renseigner les identifiants du user Panel utilisé pour KQL
npm install
npm run dev            # http://localhost:3000 — jat.cms doit tourner (composer start → http://localhost:8000)
```

## Variables

| Variable | Rôle |
|---|---|
| `NUXT_API_URL` | URL du CMS (`http://localhost:8000/` en local) |
| `NUXT_API_AUTH_EMAIL` / `NUXT_API_AUTH_PASSWORD` | user Panel pour l'API KQL (Basic auth), côté serveur uniquement |

## Scripts

- `npm run dev` — serveur de dev
- `npm run build` / `npm run preview` — build de production
- `npm run typecheck` — vérification TypeScript (vue-tsc)

## Structure

```
app/
  pages/[...slug].vue        route unique → PagesDefault (template `default`) ou PagesEvent (template `event`)
  components/
    blocks.vue               rend une liste de blocks Kirby (type "related-events" → BlocksRelatedEvents)
    blocks/*.global.vue      un composant par block jat.cms
    pages/                   un composant par template de page
    ui/                      composants réutilisables (UiButton, UiImage, UiRichText…)
    The*.vue                 éléments uniques (header, footer)
  composables/               sources de données partagées (useFetch dédupliqués par clé)
  utils/                     fonctions pures (résolution des refs file:// / page://, dates…)
  assets/                    SCSS global (tokens, grille, typo)
server/
  api/                       endpoints Nitro appelés par le front (page, nav, events, teams, site-infos)
  utils/                     client KQL, selects partagés, résolution des pages référencées
shared/types/                types partagés app ↔ server (`kql.ts`, `blocks.ts`)
```

Les identifiants KQL ne quittent jamais le serveur : le navigateur appelle uniquement `/api/*`.

### Références `page://` et `file://`

Kirby stocke les pages et fichiers choisis dans les blocks sous forme de références UUID.
`server/utils/fetchPageRefs.ts` collecte toutes les `page://` d'une page (à n'importe quelle profondeur) et les résout en une seule requête KQL (`page.pages`).
Les `file://` sont résolues côté front contre `page.files` (`app/utils/resolveKqlFiles.ts`).
