# M2K Packpro Industries — website

Marketing site for a stretch-film manufacturer in Ludhiana, Punjab. Next.js 16
(App Router), React 19, Tailwind v4, TypeScript.

**Not yet launched.** See [docs/PRE-LAUNCH.md](./docs/PRE-LAUNCH.md) for what
is outstanding.

## Quick start

```bash
npm install
cp .env.example .env.local     # optional — the site runs without it
npm run dev                    # http://localhost:3000
```

The enquiry form needs `RESEND_API_KEY` to actually deliver mail. Without it
the site still builds and runs; submissions log to the console and the user is
shown the phone number instead.

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build — does NOT run eslint
npm run start    # serve the production build
npm run lint     # eslint (Next 16 removed `next lint`; run this yourself)
```

## Routes

`/` · `/about` · `/products` · `/products/[slug]` (4) · `/quality` · `/contact`
plus `/robots.txt`, `/sitemap.xml`, generated OG images, and `/kitchen-sink`
(the glass design-system reference — noindex, not linked from anywhere).

## Where the content lives

There is no CMS. Three typed config files drive the site:

- [src/config/site.ts](src/config/site.ts) — company facts, address, phones, nav
- [src/config/products.ts](src/config/products.ts) — the catalogue; adding an
  entry creates its route, sitemap entry, OG image and structured data
- [src/config/media.ts](src/config/media.ts) — every image and video URL

## Documentation

| Doc | For |
|---|---|
| [PRE-LAUNCH.md](./docs/PRE-LAUNCH.md) | What is left before deployment |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | How the codebase is organised |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Hosting, env vars, DNS, rollback |
| [MEDIA.md](./docs/MEDIA.md) | Preparing and wiring up images and video |
| [CONTENT.md](./docs/CONTENT.md) | Editing copy, specs and contact details |
| [SEO.md](./docs/SEO.md) | Structured data, OG cards, post-launch checks |
| [RUNBOOK.md](./docs/RUNBOOK.md) | Symptom → cause → fix for the live site |

Contributing conventions are in [AGENTS.md](./AGENTS.md).

## Two things to know before changing anything

1. **The provenance rule** — nothing goes on this site that M2K has not
   actually claimed. Several omissions in the copy are deliberate and
   commented. Details in
   [ARCHITECTURE.md](./docs/ARCHITECTURE.md#the-provenance-rule).
2. **This is Next 16**, and it differs from older versions in ways that will
   catch you out. Read `node_modules/next/dist/docs/` first; the common traps
   are tabulated in
   [ARCHITECTURE.md](./docs/ARCHITECTURE.md#next-16-specifics-that-bite).
