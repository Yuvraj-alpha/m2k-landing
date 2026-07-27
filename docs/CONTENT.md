# Content Guide

How to change what the site says, without breaking anything and without
publishing a claim M2K cannot stand behind.

You do not need to understand React to do most of what is on this page. Three
files hold nearly all the content.

---

## The rule that governs every edit

**Do not put anything on this site that M2K has not actually said.**

This site speaks for a real manufacturer to buyers who may hold it to what it
says. An invented certification, a made-up test standard, or a spec figure
someone guessed at is a commercial problem — a wrong micron range is a wrong
order.

So, when you add copy:

- If it is a **fact or a number**, it must come from M2K. Put the source in a
  comment next to it.
- If it is **descriptive** (what a film grade is generally used for), keep it
  generic enough that it makes no specific claim.
- If you are **not sure**, hold it back. Add it to the open-questions table in
  [PRE-LAUNCH.md](./PRE-LAUNCH.md#5-content-m2k-still-has-to-confirm) instead of
  guessing.

You will find this rule already applied throughout the code, with comments
explaining what was deliberately withheld and why. Do not "fix" those omissions
without an answer from M2K.

---

## Where things live

| To change… | Edit |
|---|---|
| Phone, email, address, WhatsApp number | [src/config/site.ts](../src/config/site.ts) |
| Company name, tagline, meta description | [src/config/site.ts](../src/config/site.ts) |
| Navigation menu | `nav` in [src/config/site.ts](../src/config/site.ts) |
| Certifications listed | `certifications` in [src/config/site.ts](../src/config/site.ts) |
| Product names, specs, applications, features | [src/config/products.ts](../src/config/products.ts) |
| Product page SEO title/description | `seo` block on each product |
| Any image or video | [src/config/media.ts](../src/config/media.ts) — see [MEDIA.md](./MEDIA.md) |
| Home page section copy | `src/app/components/*.tsx` |
| About page copy | `src/app/about/components/*.tsx` |
| Quality page copy | `src/app/quality/components/*.tsx` |
| Contact page copy | `src/app/contact/components/*.tsx` |

After any edit: run `npm run lint && npm run build`. Both must pass.

---

## Common edits

### Change a phone number

`phones` in `site.ts` is an array in E.164 format, no spaces:

```ts
phones: ["+919878730079", "+919878177717"],
```

The first entry is the one quoted in error messages when the enquiry form
fails. Both appear in the contact details and in the Organization JSON-LD.

`whatsapp` is separate and has **no `+`** — it is a wa.me path segment:

```ts
whatsapp: "919878730079",
```

Display formatting (`+91 98787 30079`) is applied in code. Store the raw value.

### Change a product's specs

```ts
specs: [
  { label: "Stretchability", value: "350%+" },
  { label: "Widths", value: "250 mm – 1000 mm" },
  { label: "Thickness", value: "12 – 80 micron" },
],
```

These figures are transcribed verbatim from the legacy site's spec tables —
the only hard numbers we have from M2K. Change one only with a new source.

**If a figure is not confirmed yet**, add it with the flag rather than leaving
it out entirely:

```ts
{ label: "UV stabilisation", value: "12 months", unconfirmed: true },
```

An `unconfirmed` spec is hidden from the visible table **and** from the
structured data, but stays visible in the source so the gap is not forgotten.
When M2K confirms it, delete the flag — that is the whole change.

### Add a new product

1. Add an object to the `products` array in
   [products.ts](../src/config/products.ts). Copy an existing entry as the
   shape; TypeScript will tell you if a field is missing.
   - `slug` becomes the URL: `/products/<slug>`. Lower-case, hyphenated.
   - `order` sets its position in the catalogue; lower comes first.
   - Fill in the `seo` block — `title`, `description`, `keywords`.
2. Add a matching entry to `products` in
   [media.ts](../src/config/media.ts). **The key must be exactly the same
   string as the slug**, or the page silently falls back to a placeholder.
3. Run `npm run build`.

That is it. The route, the sitemap entry, the OG image and the Product JSON-LD
are all generated from that one object.

### Remove a product

Delete it from `products.ts`. Everything derived disappears with it.

One thing to handle manually: if the page has been live and indexed, its URL
now 404s. Add a redirect in `next.config.ts` pointing the old slug at
`/products` so inbound links and search results do not dead-end.

### Change the navigation

```ts
nav: [
  { label: "Home", href: "/" },
  …
],
```

`typedRoutes` is on, so `href` is compile-time checked against the real route
set. A link to a page that does not exist fails the build rather than shipping
broken.

### Add a new page

1. Create `src/app/<route>/page.tsx`.
2. Export a `metadata` object with at least `title` and `description` — the
   root layout supplies the `%s | M2K Packpro Industries` template.
3. Add it to `staticRoutes` in [sitemap.ts](../src/app/sitemap.ts).
4. Add it to `nav` in `site.ts` if it belongs in the menu.

Put page-specific components in `src/app/<route>/components/`, not in
`src/components/`.

---

## Writing style used on this site

Observed from the existing copy — match it.

- **Buyer's language, not marketing language.** "Flush, precision-slit edges
  prevent telescoping" beats "premium quality". The audience is a purchase
  manager who knows what telescoping is.
- **Sentence case** for headings and taglines.
- **British spelling** — "unitising", "vectorise", "colour".
- **Specific over superlative.** A number M2K gave you is worth more than any
  adjective.
- **No exclamation marks.** No "leading manufacturer", "world-class",
  "state-of-the-art" — none of it is verifiable and it reads as filler to a
  trade buyer.

---

## What you must not touch without sign-off

- **Brand hex values** in [styles/colors.css](../src/styles/colors.css). They
  are print-matched, sampled from the M2K logo. They are not tones from a scale
  and "improving" them puts the site out of step with printed material.
- **`alt` text** in `media.ts` — unless you are describing a different image.
  It is a real accessibility surface, not a keyword slot.
- **Spec figures**, without a new source from M2K.

---

## Checking your work

```bash
npm run dev     # look at it
npm run lint    # must be clean
npm run build   # must be clean
```

Then, before you consider a copy change done:

- View it on a phone-width viewport, not just a narrow desktop window.
- If you touched anything in `site.ts` or `products.ts`, check `/sitemap.xml`
  and view-source on the affected page to confirm the JSON-LD updated too.
