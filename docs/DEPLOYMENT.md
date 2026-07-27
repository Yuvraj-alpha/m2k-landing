# Deployment Guide

How this site gets from the repo to a public URL, and what has to be true
before it does.

Repo: `git@github.com:Rohan1Saluja/m2k-landing.git` (branch `main`)

---

## The short version

The site is a Next.js 16 app that prerenders to static HTML at build time. All
20 routes are static or SSG — nothing renders per-request. The only server-side
work is the enquiry server action, which runs on demand.

That means it will deploy happily to Vercel, and to anything else that can run
a Node server (`next build && next start`). Vercel is the recommended target:
it is the reference platform for Next 16, and it gives blob storage for the
media in the same account.

---

## First-time setup on Vercel

1. **Import the repo.** Vercel → Add New → Project → import
   `Rohan1Saluja/m2k-landing`. Framework preset auto-detects as Next.js.
   Leave build command, output directory and install command at their
   defaults; this repo does not override them.

2. **Set environment variables** (see the table below) for **Production**,
   **Preview** and **Development**. Missing variables do not fail the build —
   [resend.ts](../src/lib/resend.ts) is deliberately lazy so the site stays
   deployable before email is configured — they fail silently at submit time,
   which is worse. Set them.

3. **Deploy.** First deploy lands on a `*.vercel.app` URL. Use it to smoke-test
   before pointing DNS.

4. **Add the domain.** Project → Settings → Domains → add the production
   domain. Vercel prints the DNS records to add at the registrar. Pick one of
   apex or `www` as canonical and redirect the other; whichever you choose must
   match `siteConfig.url` exactly.

5. **Update `siteConfig.url`** in [src/config/site.ts](../src/config/site.ts)
   and redeploy. Until this matches the live origin, the sitemap, `robots.txt`,
   canonical URLs and every JSON-LD `@id` point at the wrong place.

---

## Environment variables

| Variable | Required | Example | What breaks without it |
|---|---|---|---|
| `RESEND_API_KEY` | Yes, for enquiries | `re_xxxxxxxx` | Form returns "we couldn't send that just now" and logs the enquiry to the server console. Nothing is delivered. |
| `ENQUIRY_FROM` | Recommended | `M2K Website <enquiries@m2kpackpro.in>` | Falls back to the same literal. If the domain is not verified in Resend, sending fails. |
| `ENQUIRY_TO` | Recommended | `admin@m2kpackpro.in` | Falls back to `admin@m2kpackpro.in`. |

Locally, copy [.env.example](../.env.example) to `.env.local` (gitignored) and
fill it in. There are no `NEXT_PUBLIC_*` variables — nothing secret or
configurable reaches the client.

### Resend domain verification

`ENQUIRY_FROM` must be on a domain verified in Resend, or delivery fails
outright. In Resend → Domains → Add Domain, then add the printed SPF and DKIM
records at the DNS provider. Verification usually completes within minutes but
can take up to a few hours to propagate.

Do not skip this and send from a `@gmail.com` address — it will not pass SPF
and the mail will bounce.

---

## Deploying an update

```bash
git add -A
git commit -m "…"
git push
```

Vercel builds every push. `main` goes to production; any other branch gets a
preview URL. Preview deployments share the Preview environment variables, so if
Preview has a real `RESEND_API_KEY`, test submissions from a preview URL will
send real email to the real inbox — use a throwaway `ENQUIRY_TO` in Preview if
that matters.

### Rolling back

Vercel → Deployments → pick the last good one → Promote to Production.
Instant, no rebuild. Prefer this over a revert commit when the site is broken
in production; fix forward afterwards.

---

## Self-hosting instead

```bash
npm ci
npm run build
npm run start      # serves on :3000
```

Put it behind a reverse proxy that terminates TLS. Two things to get right:

- **`x-forwarded-for` must be set by the proxy.** The rate limiter in
  [rate-limit.ts](../src/lib/rate-limit.ts) reads the first entry of that
  header to identify a client. If the proxy does not set it, every visitor
  shares one bucket and the sixth enquiry in ten minutes — from anyone — is
  rejected.
- **Rate-limit state is per process.** It resets on restart and is not shared
  across instances. Fine for one node; if you run several, the effective limit
  multiplies by the instance count.

Image optimisation needs `sharp`, which Next installs automatically on Node 18+.

---

## Post-deploy smoke test

Run this against the deployed URL every time, not against localhost.

- [ ] Home page renders; the liquid backdrop animates
- [ ] All five nav routes load: `/`, `/about`, `/products`, `/quality`, `/contact`
- [ ] All four product pages load from `/products`
- [ ] `/robots.txt` shows the correct `Sitemap:` and `Host:` lines
- [ ] `/sitemap.xml` lists 9 URLs, all on the production origin
- [ ] `/opengraph-image` renders a 1200×630 card
- [ ] A made-up URL like `/nope` renders the custom 404, not a stock one
- [ ] Submit a real enquiry → success toast → it arrives in `ENQUIRY_TO`
- [ ] Submit the form with an invalid email → inline field error, no send
- [ ] Add two products to the enquiry drawer, reload the page → selections
      persist (they are restored by `RfqHydration` after mount)
- [ ] Tap both phone numbers and the WhatsApp FAB **on a real phone**
- [ ] Paste a product URL into WhatsApp → the OG card previews correctly

---

## Things that will bite you

- **`next build` does not run ESLint any more.** Next 16 removed the `eslint`
  config key and the `next lint` command. A build passing says nothing about
  lint. Run `npm run lint` separately, and wire it into CI.
- **`typedRoutes: true` is on.** Every `<Link href>` is typechecked against the
  real route set. Adding a page to `sitemap.ts` before the route exists will
  fail the build — which is the point.
- **`images.remotePatterns` is empty.** Until it lists the blob host, every
  remote `next/image` src is rejected at runtime. See [MEDIA.md](./MEDIA.md).
- **`images.qualities` is `[75, 90]`.** Next 16 requires declared qualities;
  a `quality` prop outside that list is coerced, and a direct hit on the image
  API with an undeclared value returns 400.
- **Redirects from an allowed image host are followed without re-validating
  `remotePatterns`** in Next 16. Keep `pathname` tight if the storage account
  is shared with anything else.
