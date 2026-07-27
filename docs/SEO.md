# SEO Guide

What is implemented, why it is shaped the way it is, and what to verify once
the site is live.

---

## What ships today

| Surface | File | Notes |
|---|---|---|
| Title template + description | [layout.tsx](../src/app/layout.tsx) | `%s \| M2K Packpro Industries` |
| `metadataBase` | `layout.tsx` | Derived from `siteConfig.url` — **must be the real origin** |
| Open Graph + Twitter card | `layout.tsx` | `summary_large_image`, `locale: en_IN` |
| Per-page metadata | each `page.tsx` | Product pages pull from the `seo` block in `products.ts` |
| OG images | `opengraph-image.tsx` × 2 | Generated at build time by `next/og` |
| Organization / LocalBusiness JSON-LD | [lib/seo.ts](../src/lib/seo.ts) | Emitted once, in the root layout |
| Product JSON-LD | `lib/seo.ts` | Per product page |
| BreadcrumbList JSON-LD | `lib/seo.ts` | Per product page |
| `robots.txt` | [app/robots.ts](../src/app/robots.ts) | Open to all; only `/kitchen-sink` disallowed |
| `sitemap.xml` | [app/sitemap.ts](../src/app/sitemap.ts) | 5 static + 4 product URLs, generated from config |
| Custom 404 | [app/not-found.tsx](../src/app/not-found.tsx) | |

Target queries the copy is written to serve: *stretch film manufacturer
Ludhiana*, *LLDPE stretch film India*, *silage film manufacturer*, *machine
grade stretch film supplier*, and the per-product `seo.keywords`.

---

## Structured data

[lib/seo.ts](../src/lib/seo.ts) builds three graphs. The governing idea:

> Structured data is a set of **claims to search engines**, so the same rule
> that governs the visible copy governs this file — nothing asserted here that
> M2K has not published.

Which is why you will not find `aggregateRating`, `review`, `priceRange` or
`foundingDate` anywhere. Inventing any of those is the kind of thing that earns
a manual action, and none are supported by a source. **Do not add them without
real data**, however much a rich-results preview tempts you.

**Organization** is typed `["Organization", "LocalBusiness", "Manufacturer"]`.
Manufacturer is the accurate type; LocalBusiness is what gets the Ludhiana
address into the local pack for "stretch film manufacturer Ludhiana". Both
phone numbers are emitted as `contactPoint` entries so a knowledge panel shows
the pair.

**Product** deliberately has no `Offer`. This site does not sell online and we
do not have prices; an invented `Offer` would be a fabrication. `manufacturer`
points at the Organization by `@id` rather than repeating it, so the graph
stays consistent.

`additionalProperty` is built from `confirmedSpecs(product)` — the *same* gate
the visible spec table uses. That is deliberate: an `unconfirmed` figure can
never leak into structured data, and the page and its markup can never
disagree. If you ever render specs on a public surface, go through
`confirmedSpecs()`, never `product.specs`.

`jsonLdScript()` replaces every `<` with its unicode escape, so a value
containing a literal closing `script` tag cannot break out of the element. Everything here is first-party data, but the guard
costs nothing.

### Types are intentionally loose

The builders return `Record<string, unknown>`. schema.org graphs are
open-ended, and a precise TypeScript type would fight every legitimate addition
for no safety gain. These shapes are validated by Google's Rich Results Test,
not by the compiler — so **run it after any change here**.

---

## Open Graph images

Two generators, one shared template:

- [app/opengraph-image.tsx](../src/app/opengraph-image.tsx) — sitewide card,
  used by the home page and any route without its own.
- [app/products/[slug]/opengraph-image.tsx](../src/app/products/[slug]/opengraph-image.tsx)
  — one per product, generated at build time via `generateStaticParams`.

Both render [lib/og-template.tsx](../src/lib/og-template.tsx) at 1200×630.

**Do not try to reuse the site's Tailwind glass classes in there.** `next/og`
supports flexbox and a small CSS subset only — no grid, no CSS variables, no
external fonts unless you fetch them and pass buffers. The template therefore
restates the brand palette as literal hex and builds the glass look from plain
`rgba` layers. It reads as the same brand without sharing an implementation
that would not run in that renderer. Keep everything it imports pure data.

You never list `openGraph.images` in `metadata` — the file convention fills it
in automatically, for both OG and Twitter.

If you change the brand colours in `colors.css`, the hex constants in
`og-template.tsx` will not follow. Update both.

---

## Sitemap and robots

Both generate from `config/products.ts` and `config/site.ts`, so adding a
product adds its sitemap entry with no separate step.

**There is no `lastModified`, on purpose.** This is a static brochure site with
no per-page change history, and a build-time `new Date()` would report every
page as changed on every deploy — actively misleading, and worse than omitting
the field. Add real timestamps only when there is a real signal (a CMS
`updatedAt`) behind them.

`/kitchen-sink` is excluded from the sitemap, `Disallow`ed in robots.txt, and
carries a `noindex` meta tag. Belt and braces, because it is a working surface
and not a public page.

---

## Post-launch verification

Do these in order, once the production domain is live and `siteConfig.url`
matches it.

1. **Confirm the origin.** Load `/robots.txt` and `/sitemap.xml`. Every URL
   must be on the production origin. If they say `m2kpackpro.in` and the site
   lives at `www.m2kpackpro.in`, stop and fix `siteConfig.url` first — nothing
   below is worth doing until this is right.
2. **Rich Results Test** — https://search.google.com/test/rich-results — run
   against `/` (Organization + LocalBusiness) and one product page (Product +
   BreadcrumbList). Fix any error; warnings about missing optional fields like
   `aggregateRating` are expected and should be ignored, not "fixed".
3. **Schema Markup Validator** — https://validator.schema.org — catches shape
   problems the Google tool passes over.
4. **Google Search Console** — verify the property, submit `/sitemap.xml`,
   check Coverage after a few days for anything unexpectedly excluded.
5. **Bing Webmaster Tools** — same, and it imports from Search Console.
6. **OG preview** — paste a product URL into **WhatsApp** first. On an Indian
   B2B site that is the sharing surface that matters. Then LinkedIn's Post
   Inspector, which also lets you force a re-scrape after a change.
7. **Google Business Profile** for the Ludhiana address. The `LocalBusiness`
   JSON-LD is only half of local SEO; the profile is the other half, and it
   carries more weight.
8. **Lighthouse on mobile** — but only *after* real images are in.
   A score against placeholders tells you nothing.

---

## Ongoing

- Re-run the Rich Results Test after any edit to `lib/seo.ts` or to specs.
- If a product is removed, add a redirect from its old slug to `/products` in
  `next.config.ts`. A 404 on an indexed URL loses the link equity; a 301 keeps
  it.
- Watch Search Console for "Crawled – currently not indexed" on product pages.
  On a thin catalogue that usually means the pages need more distinct copy, not
  more markup.
- Resist adding markup for things the site does not have. Review schema without
  reviews, FAQ schema for questions nobody asked, and fake ratings are all
  manual-action risks that outweigh anything they might win.
