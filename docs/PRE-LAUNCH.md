# Pre-Launch Checklist

What is left before this site can go live. Ordered by whether it blocks launch.

**Current state** (verified 2026-07-27): `next build` succeeds, 20 routes prerender,
`npm run lint` is clean. Nothing in the code is broken. What is missing is
*content, configuration and assets* — the site is deployable today, it just
would not be worth deploying yet.

---

## P0 — Blocks launch

### 1. Media: every image and video is missing

**Every `src` in [src/config/media.ts](../src/config/media.ts) is an empty string.**
That is 12 assets: 2 brand, 2 hero, 4 product, 4 facility. The site does not
break — `MediaFrame` renders a designed placeholder for an empty `src` — but a
manufacturer's site with no photograph of the plant or the product is not a
site you launch.

This is the single largest remaining task. Full instructions in
[MEDIA.md](./MEDIA.md).

Blocked on: someone with access to the source folders (`../kamm di photos/`,
`../WEBSITE SAMPLES/ONE/`) doing the compress-and-upload pass, plus a decision
on where the files are hosted.

- [ ] Choose blob host (Vercel Blob is the path of least resistance)
- [ ] Compress and upload the 12 assets
- [ ] Paste URLs into `src/config/media.ts`
- [ ] Add the host to `images.remotePatterns` in [next.config.ts](../next.config.ts)
      — the `remotePatterns` array is currently empty and commented out, so
      `next/image` will reject every remote URL until it is filled in
- [ ] Vectorise the logo to SVG (the source is a raster lockup and will look
      soft in the glass header)

### 2. Confirm the production domain

[src/config/site.ts:17](../src/config/site.ts#L17) assumes `https://m2kpackpro.in`.
That value is not cosmetic — it feeds `metadataBase`, every canonical URL, the
sitemap, `robots.txt`, the `host` directive, and every `@id` in the JSON-LD
graph. Getting it wrong after launch means search engines index the wrong
origin.

- [ ] Confirm the exact production origin with M2K, including whether it is
      `www.` or apex
- [ ] Update `siteConfig.url` and remove the TODO
- [ ] Verify `/sitemap.xml` and `/robots.txt` render the right host after deploy

### 3. Email delivery is unconfigured

The enquiry form is fully built and validated, but `RESEND_API_KEY` is unset,
so [src/lib/resend.ts](../src/lib/resend.ts) returns `null` and every
submission falls back to "please email or call us instead". Enquiries are
logged to the server console and **not delivered**.

- [ ] Create the Resend account and API key
- [ ] Verify the sending domain in Resend (SPF + DKIM DNS records) — an
      unverified domain means mail is rejected, not just spam-foldered
- [ ] Set `RESEND_API_KEY`, `ENQUIRY_FROM`, `ENQUIRY_TO` in the host's
      environment for **both** Production and Preview
- [ ] Send a real test enquiry against the deployed site and confirm it lands

See [DEPLOYMENT.md](./DEPLOYMENT.md#environment-variables).

### 4. Icons and manifest

[public/](../public/) is empty. There is a `src/app/favicon.ico`, so browser
tabs work, but there is no `apple-icon`, no `icon.svg`, and no web app
manifest. On iOS "Add to Home Screen" the site gets a screenshot instead of a
mark.

- [ ] Add `src/app/apple-icon.png` (180×180)
- [ ] Add `src/app/icon.svg` once the logo is vectorised
- [ ] Add `src/app/manifest.ts` with `name`, `short_name`, `theme_color`
      (`#08080a` to match the `viewport.themeColor` dark entry), and icons

---

## P1 — Should be done before launch

### 5. Content M2K still has to confirm

The codebase was written under a strict rule: **no claim appears on the site
that M2K has not made.** Several places are deliberately vague or omitted as a
result, each marked with a TODO. Each of these is an improvement waiting on one
answer from the client.

| # | Question for M2K | Where it lands | Currently |
|---|---|---|---|
| a | Actual working / visiting hours | [contact-details.tsx:99](../src/app/contact/components/contact-details.tsx#L99) | "Please call ahead to arrange a visit." |
| b | Company incorporation year | [site.ts:23](../src/config/site.ts#L23) | No "Since" claim anywhere; only "30 years" of *leadership* experience |
| c | The full 7 points of "7-point testing", and the standard tested to (ASTM D5459 for cling, D882 for tensile are the usual ones) | [batch-checks.tsx:19](../src/app/quality/components/batch-checks.tsx#L19) | Only the 3 named points are listed; section is not titled "7-point testing" |
| d | Is silage film really 12-month UV stabilised? | [products.ts:89](../src/config/products.ts#L89) | Carried as `unconfirmed: true`, so it is hidden from the spec table *and* from the Product JSON-LD |
| e | Core diameter per grade (2" / 3") | `products.ts` specs | Absent |
| f | Roll length and roll weight per grade | `products.ts` specs | Absent |
| g | Is silage film available in colours other than white? | `products.ts` | Absent |

(e) and (f) matter commercially — a stretch-film buyer quotes on them. See
[CONTENT.md](./CONTENT.md) for how to add each answer once you have it.

- [ ] Send this table to M2K as a single list of questions
- [ ] Apply the answers; delete the corresponding TODOs

### 6. Privacy policy

The enquiry form collects name, company, email, phone and a free-text message.
That is personal data under India's DPDP Act, and there is currently no privacy
notice anywhere on the site. There is also no `/privacy` route.

- [ ] Write a short privacy notice: what is collected, why, who it goes to
      (Resend as processor), how long it is kept, how to request deletion
- [ ] Add `src/app/privacy/page.tsx` and link it in the footer
- [ ] Add it to [sitemap.ts](../src/app/sitemap.ts)
- [ ] Add a one-line consent note under the form's submit button

This is not legal advice — have M2K's side confirm the retention and contact
details before publishing.

### 7. Analytics

Nothing is wired. There is no way to know whether the site works commercially —
which is the only reason it exists.

- [ ] Pick one: Vercel Analytics (zero-config, privacy-friendly, no cookie
      banner needed) or Plausible. Avoid GA4 unless M2K specifically wants it,
      because it drags a consent banner in with it
- [ ] Track the enquiry submit as a conversion event
- [ ] Track WhatsApp FAB clicks — on an Indian B2B site that is likely the
      highest-volume contact path, and it is currently invisible

### 8. Theme provider is missing

[src/components/ui/sonner.tsx](../src/components/ui/sonner.tsx) calls
`useTheme()` from `next-themes`, but no `ThemeProvider` is mounted anywhere and
`<html>` hard-codes `className="dark"` in
[layout.tsx:68](../src/app/layout.tsx#L68). The hook falls back to `"system"`,
so a toast can render light-themed on a light-OS machine while the site around
it is dark.

Two valid fixes — pick one, do not leave it as is:

- **Simplest:** hard-code `theme="dark"` on the `<Toaster>` and drop the
  `useTheme` call. Correct as long as the site stays dark-only.
- **Fuller:** mount `ThemeProvider` in the layout with `attribute="class"`
  `defaultTheme="dark"`, and add the toggle the layout comment anticipates.

- [ ] Resolve, and remove the "a toggle can swap this later" comment if the
      answer is "dark-only, permanently"

### 9. Decide the fate of `/kitchen-sink`

[src/app/kitchen-sink/page.tsx](../src/app/kitchen-sink/page.tsx) is the glass
design-system reference. It is `noindex` and `Disallow`ed in robots.txt, so it
will not be found — but it *is* publicly reachable and it ships in the bundle.

- [ ] Either keep it (it is genuinely useful for future design work — this is
      the recommendation) or delete the route before launch. If keeping, note
      it in the handover so nobody is surprised by it.

---

## P2 — First week after launch

- [ ] Submit the sitemap in Google Search Console and Bing Webmaster Tools
- [ ] Run Google's Rich Results Test against `/` and one product page to
      validate the JSON-LD in the wild — see [SEO.md](./SEO.md#post-launch-verification)
- [ ] Verify the OG cards render correctly by pasting a product URL into
      WhatsApp and LinkedIn (WhatsApp is the one that matters here)
- [ ] Lighthouse pass on mobile *after* real images are in — the current score
      is meaningless with placeholders
- [ ] Set up Google Business Profile for the Ludhiana address; the
      `LocalBusiness` JSON-LD is only half the local-SEO story
- [ ] Watch the enquiry inbox for spam. The rate limiter
      ([rate-limit.ts](../src/lib/rate-limit.ts)) is in-memory and per-instance
      by design — if spam becomes real, swap in Upstash rather than tuning the
      numbers

---

## Nice to have, not urgent

- **CI.** `next build` no longer runs ESLint in Next 16, so nothing enforces
  lint except a human remembering. A GitHub Action running
  `npm run lint && npm run build` on PRs would close that gap.
- **Tests.** There are none. The highest-value first test is the enquiry action:
  schema rejection, honeypot, rate limit, and the unconfigured-Resend path.
- **`shadcn` is in `dependencies`.** It is a CLI, used at authoring time only.
  Moving it to `devDependencies` trims the production install.
- **Real `lastModified` in the sitemap** if the content ever gets a change
  history. Deliberately omitted today — see the note in `sitemap.ts`.

---

## Launch sign-off

Do not deploy to the production domain until every line below is true.

- [ ] `npm run lint` clean
- [ ] `npm run build` clean
- [ ] `siteConfig.url` is the real production origin
- [ ] All 12 media assets have URLs, and `remotePatterns` allows their host
- [ ] A test enquiry submitted on the deployed site arrived in the real inbox
- [ ] `/robots.txt` and `/sitemap.xml` load and show the correct host
- [ ] Every page checked on a real phone, not just a narrow desktop window
- [ ] Both phone numbers and the WhatsApp link tested by tapping them on mobile
- [ ] Privacy notice published and linked
- [ ] Analytics recording pageviews
