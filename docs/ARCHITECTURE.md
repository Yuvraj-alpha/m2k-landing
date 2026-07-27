# Architecture

Orientation for anyone picking this codebase up. Read this before making a
change; most surprises here are deliberate and documented in the file that
causes them.

---

## What this is

A marketing site for M2K Packpro Industries, a stretch-film manufacturer in
Ludhiana, Punjab. Next.js 16 App Router, React 19, Tailwind v4, TypeScript.

Every route prerenders to static HTML. The only server-side work at request
time is the enquiry server action. There is no database, no CMS and no auth —
content lives in typed config files.

> **Read the docs in `node_modules/next/dist/docs/` before writing Next code.**
> This is Next 16; several APIs and conventions differ from what you may
> remember. See [the gotchas section](#next-16-specifics-that-bite).

---

## Directory map

```
src/
  app/                   routes (App Router)
    page.tsx             home
    layout.tsx           root layout: fonts, JSON-LD, header/footer, RFQ drawer
    components/          home-page-only sections
    about|quality/       route + its own components/ folder
    contact/
      page.tsx
      actions.ts         "use server" — the enquiry submission
      components/
    products/
      page.tsx           catalogue index
      [slug]/            one page per entry in config/products.ts
    kitchen-sink/        glass design-system reference (noindex, not linked)
    opengraph-image.tsx  sitewide OG card
    robots.ts sitemap.ts not-found.tsx

  components/
    ui/         shadcn primitives — button, dialog, sheet, input, …
    glass/      the liquid-glass material: panel, card, plate, button, backdrop
    layout/     header, footer, mobile nav, RFQ drawer + hydration, brand mark
    common/     container, section-heading, media-frame, json-ld, whatsapp-fab

  config/       ← content lives here
    site.ts     company facts, address, phones, nav, certifications
    products.ts the product catalogue
    media.ts    every image/video URL

  lib/          seo.ts (JSON-LD builders), schemas.ts (zod), resend.ts,
                rate-limit.ts, og-template.tsx, utils.ts
  hooks/        use-media-query, use-pointer-glow, use-preferences, use-scroll-progress
  store/        rfq-store.ts (zustand, persisted)
  styles/       colors.css, glass.css, globals.css
  types/        product.ts, site.ts, enquiry.ts
```

**Convention:** a route's single-use components live in a `components/` folder
*next to the route*. Only genuinely shared components go up to `src/components/`.
Keeps the blast radius of an edit obvious.

---

## The three config files are the content model

There is no CMS. These three files are the editing surface, and everything
downstream derives from them.

### `config/site.ts`
Company facts. Feeds the header, footer, contact page, `metadataBase`, the
sitemap host, and the Organization JSON-LD. One `as const satisfies SiteConfig`
object.

### `config/products.ts`
The catalogue. **Adding a product here creates its route, its sitemap entry,
its OG image and its structured data automatically.** Nothing else needs
editing except the matching photo in `media.ts`.

The `unconfirmed?: boolean` flag on a spec is the important idea:

```ts
{ label: "UV stabilisation", value: "12 months", unconfirmed: true }
```

`confirmedSpecs(product)` filters those out, and **both** the visible spec table
and the Product JSON-LD go through it. So an unverified figure stays visible to
developers in the source, is never published, and the page and its structured
data can never disagree. Do not read `product.specs` directly on a public
surface.

### `config/media.ts`
Every image and video URL. All currently empty — see [MEDIA.md](./MEDIA.md).

---

## The provenance rule

This is the single most important convention in the repo, and it is not a
stylistic preference.

**Nothing appears on this site that M2K has not actually claimed.**

The site speaks for a real manufacturer to buyers who may audit what it says. A
fabricated test standard or an invented certification is a commercial and legal
problem, not a copy problem. So throughout the codebase you will find claims
deliberately withheld, each with a comment explaining what is missing and where
it came from:

- No `aggregateRating`, `review`, `priceRange` or `foundingDate` in the JSON-LD
  ([lib/seo.ts](../src/lib/seo.ts)) — none are sourced.
- No "Since \<year\>" anywhere. The legacy site's "30 years" describes the
  *leadership's* experience, not the company's age
  ([config/site.ts](../src/config/site.ts)).
- The quality page lists 3 named test points, not 7, and is not titled
  "7-point testing" — M2K's copy names three
  ([batch-checks.tsx](../src/app/quality/components/batch-checks.tsx)).
- Contact hours say "please call ahead" rather than inventing "Mon–Sat 9–6".
- Spec figures are transcribed verbatim from the legacy site's tables. A wrong
  micron range here is a wrong order.

When you add copy, either cite a source in a comment or write something that
makes no claim. If you are unsure, hold it back and add it to the open-questions
table in [PRE-LAUNCH.md](./PRE-LAUNCH.md#5-content-m2k-still-has-to-confirm).

---

## The glass design system

The concept: M2K manufactures transparent stretch film, so every surface on the
site is a sheet of that film stretched over a lit substrate. The user reads
*through the product*.

- **[styles/colors.css](../src/styles/colors.css)** — the only place colour is
  defined. Brand hex constants (sampled from the logo, print-matched, do not
  "improve" without sign-off), then semantic tokens for light and dark.
  Components use `bg-background`, `text-muted-foreground`, `bg-brand` — never a
  literal hex.
- **[styles/glass.css](../src/styles/glass.css)** — translucency only, never
  colour. **Design rule: if this entire file were deleted, the site must still
  be fully readable.** That is what makes the `prefers-reduced-transparency`
  fallback safe rather than an afterthought.
- **[LiquidBackdrop](../src/components/glass/liquid-backdrop.tsx)** — rendered
  once in the root layout, fixed to the viewport. It is the light source every
  glass surface refracts. There is exactly one; do not add another.
- **[/kitchen-sink](../src/app/kitchen-sink/page.tsx)** — every glass variant
  with real type and real density. Use it to judge a change to the material.
  Test the accessibility fallbacks via DevTools → Rendering → Emulate CSS media
  feature `prefers-reduced-transparency` / `prefers-reduced-motion`.

---

## The enquiry flow

The commercial point of the site. Two paths converge on it.

**1. The RFQ list** ([store/rfq-store.ts](../src/store/rfq-store.ts)) — a buyer
ticks films on `/products` and on individual product pages, then lands on
`/contact` with the selection intact. B2B buyers rarely enquire about one SKU,
so the store exists to let them build the list first. It is the only genuinely
cross-cutting client state in the site.

Persisted to localStorage with `skipHydration: true` — deliberate. An automatic
rehydrate would make the first client render disagree with the server HTML, so
[RfqHydration](../src/components/layout/rfq-hydration.tsx) triggers it after
mount instead. Drawer visibility is *not* persisted; reopening it on a return
visit would be hostile.

**2. The form** ([enquiry-form.tsx](../src/app/contact/components/enquiry-form.tsx))
→ `submitEnquiry` in [actions.ts](../src/app/contact/actions.ts).

The server action re-validates everything, because **a server function is
reachable by direct POST — the form UI is not a boundary**:

1. Re-parse with the same zod schema. Never trust the client's copy.
2. Honeypot (`website` field), enforced server-side, not just hidden with CSS.
   A trip returns `{ ok: true }` — telling a bot why it failed only helps it.
3. Rate limit by `x-forwarded-for` first entry. Missing header → shared bucket,
   which is strict rather than permissive.
4. Resolve product slugs against the real catalogue. Anything unknown is
   dropped, never echoed into the email body.
5. Send via Resend, `replyTo` the buyer so a reply in the inbox reaches them.

**Failure is designed, not incidental.** [resend.ts](../src/lib/resend.ts)
constructs its client lazily and returns `null` when unconfigured, so a missing
`RESEND_API_KEY` fails one submission instead of failing `next build`. The user
gets the phone number and email address; the operator gets a `console.error`
with the enquiry details so nothing is lost.

The rate limiter is in-memory and per-instance, and says so at the top of the
file. It stops one client hammering one warm instance and nothing more. That is
an accepted trade — the downside of an abusive burst is inbox spam, not data
loss — chosen over adding Redis to a brochure site. If spam becomes real,
replace it with a durable store rather than tuning the constants.

---

## SEO surface

See [SEO.md](./SEO.md) for the full picture. In short: `robots.ts` and
`sitemap.ts` generate from the same config as the routes; `lib/seo.ts` builds
Organization, Product and BreadcrumbList JSON-LD; OG cards are generated at
build time by `next/og` from a shared template.

---

## Next 16 specifics that bite

Documented here because they will not match older muscle memory. The
authoritative reference is `node_modules/next/dist/docs/`.

| Thing | What changed |
|---|---|
| `next lint` | **Removed**, along with the `eslint` key in `next.config.ts`. `next build` no longer lints. Run `npm run lint` yourself; wire it into CI. |
| `images.qualities` | Must be declared explicitly. This repo allows `[75, 90]`; anything else is coerced, and a direct image-API hit with an undeclared value returns 400. |
| `remotePatterns` + redirects | A redirect from an allowed host is followed **without** re-validating the patterns. Keep `pathname` tight. |
| Scroll restoration | Next stopped force-overriding scroll behaviour on navigation. `data-scroll-behavior="smooth"` on `<html>` is what restores scroll-to-top between routes while keeping smooth in-page anchors. Do not remove it. |
| `typedRoutes: true` | Every `<Link href>` is compile-time checked against the real route set. A typo is a build error, by design. |
| OG rendering | `next/og` supports flexbox and a CSS subset only — no grid, no CSS variables, no external fonts unless fetched as buffers. This is why [og-template.tsx](../src/lib/og-template.tsx) restates the palette as literal hex instead of reusing the Tailwind tokens. Keep it self-contained. |

---

## Commands

```bash
npm run dev     # dev server on :3000
npm run build   # production build — does NOT lint
npm run start   # serve the production build
npm run lint    # eslint (run it; nothing else does)
```
