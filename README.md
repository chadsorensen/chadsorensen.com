# chadsorensen.com

Portfolio site for Chad Sorensen, a frontend developer based in Portland, Oregon.

Built with Vue 3 (`<script setup>` + TypeScript) and Vite. No runtime dependencies beyond Vue.

## Development

Requires Node 22.12+ (see `.nvmrc`).

```sh
npm install
npm run dev        # local dev server at http://localhost:5173
npm run build      # type-check and build to dist/
npm run preview    # serve the production build locally
```

## Project structure

```
api/shopper.ts             Vercel function backing /shopper (Upstash Redis)
shared/shopper.ts          types + validation shared by the API and the page
shopper/index.html         /shopper entry (second Vite page)
src/shopper/               Shopper app: ShopperApp.vue, useShopperList.ts, api.ts
src/
  App.vue                  page layout
  components/              one component per section + SiteNav
  composables/             useActiveSection (nav highlighting), useInView (reveal on scroll)
  data/works.ts            portfolio entries — edit this to add/remove projects
  assets/img/              project and profile images
  styles/main.css          tokens, base styles, shared reveal animations
```

### Adding a project

1. Drop a square image (500×500 or larger) in `src/assets/img/`.
2. Import it at the top of `src/data/works.ts` and add an entry to the `works` array.

## Shopper (/shopper)

A shared grocery list. Items are stored in Upstash Redis via `api/shopper.ts` and
protected by a passphrase; the page polls every 5s so everyone sees the same list.

### One-time setup (Vercel dashboard)

1. **Storage → Create → Upstash for Redis** (free tier) and connect it to this project.
   This adds the `KV_REST_API_URL` / `KV_REST_API_TOKEN` env vars automatically.
2. **Settings → Environment Variables**: add `SHOPPER_PASSPHRASE` (Production + Preview).
3. Redeploy.

### Local development

`npm run dev` serves the pages but not the API. To run both:

```sh
npx vercel link
npx vercel env pull .env.local
npx vercel dev
```

## Deployment

Hosted on Vercel, which detects Vite automatically (build command `npm run build`, output `dist`).
Pushes to `master` deploy to production; other branches get preview URLs.
