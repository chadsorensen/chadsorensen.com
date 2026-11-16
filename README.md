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

## Deployment

Hosted on Vercel, which detects Vite automatically (build command `npm run build`, output `dist`).
Pushes to `master` deploy to production; other branches get preview URLs.
