# Operations Runbook

Troubleshooting for the live site. Symptom → cause → fix.

---

## Enquiries are not arriving

The most important failure mode on the site — every hour it goes unnoticed is
lost business. Work through these in order.

### 1. Is Resend configured?

Check the host's environment for `RESEND_API_KEY`. If it is missing or empty,
[getResend()](../src/lib/resend.ts) returns `null` and **nothing is sent**.

The tell in the logs:

```
[enquiry] RESEND_API_KEY is not set — enquiry was not delivered.
```

That line includes the name, email and products from the submission, so
enquiries received during an outage are recoverable from the logs — go back
through them and contact those buyers manually.

The user saw: *"We couldn't send that just now. Please email … or call …"*.

**Fix:** set the variable, redeploy.

### 2. Did Resend reject the message?

```
[enquiry] Resend rejected the message { … }
```

Almost always the sending identity. `ENQUIRY_FROM` must be on a domain verified
in Resend — check Resend → Domains shows **Verified**, not Pending. DNS changes
at the registrar can take hours to propagate, and a domain that was verified
can fall out of verification if the SPF or DKIM records are edited.

**Fix:** re-verify the domain, or temporarily point `ENQUIRY_FROM` at a
verified one.

### 3. Is it being rate-limited?

The user saw *"You've sent several enquiries already. Please try again in about
N minutes"*. Limit is **5 submissions per IP per 10 minutes**
([rate-limit.ts](../src/lib/rate-limit.ts)).

Two ways this fires when it should not:

- **The proxy is not setting `x-forwarded-for`.** Then every visitor falls into
  the shared `"unknown"` bucket and the sixth enquiry *from anyone* in ten
  minutes is rejected. Check the header reaches the app.
- **Genuine shared IP** — a large office behind one NAT. Rare, but real.

**Fix:** correct the proxy config, or raise `MAX_PER_WINDOW`. Note the limiter
is in-memory: a redeploy resets it immediately, which is a legitimate way to
unblock someone urgently.

### 4. Unexpected failure

```
[enquiry] Unexpected failure sending enquiry
```

A thrown exception rather than a rejection — network, timeout, Resend outage.
Check https://resend.com/status. Nothing to fix in the app; the enquiry details
are in the log line above.

### 5. Nothing in the logs at all

The submission never reached the server. Either the form failed client-side
validation (inline field errors, no request sent), or the honeypot tripped.

**The honeypot returns `{ ok: true }` on purpose** — the user sees a success
toast and nothing is sent. This is correct behaviour for a bot; telling it why
it failed only helps it adapt. But it means a *human* who somehow filled the
hidden `website` field gets a silent black hole. If a real customer reports
"I submitted and heard nothing" and there is no log line, suspect a password
manager or an aggressive autofill extension filling every field on the page.

---

## Images are broken or missing

**Everything shows a designed glass placeholder:** expected. The `src` values in
[config/media.ts](../src/config/media.ts) are still empty. See
[MEDIA.md](./MEDIA.md).

**One image is a placeholder, the rest work:** that asset's `src` is empty, or —
for a product photo — the key in `media.ts` does not exactly match the product
`slug` in `products.ts`. `getProductMedia()` returns an empty fallback for an
unknown slug rather than throwing, so a typo fails silently.

**Server error / broken image icon on a remote URL:** the host is not listed in
`images.remotePatterns` in [next.config.ts](../next.config.ts). `next/image`
rejects any remote host it does not recognise.

**Image API returns 400:** a `quality` prop outside the declared
`images.qualities` list (`[75, 90]`). Next 16 requires qualities to be declared
explicitly.

**Layout jumps as images load:** the `width`/`height` in `media.ts` do not match
the file's real intrinsic dimensions. Those numbers exist to reserve space and
prevent layout shift — correct them to the actual pixel size of the uploaded
file.

---

## The build fails

| Error | Cause |
|---|---|
| Type error on a `<Link href>` | `typedRoutes` is on and the route does not exist. Either create the page or fix the href. This includes hrefs added to `sitemap.ts`. |
| Type error in `products.ts` / `site.ts` | A missing or misspelled field. These are `satisfies`-checked against `src/types/`. |
| Something about `next lint` | It does not exist in Next 16 and `next build` does not lint. Use `npm run lint`. |

A clean build says **nothing** about lint. Run both.

---

## The site looks wrong

**Everything is flat / no translucency:** the OS has
`prefers-reduced-transparency` on. That is a designed fallback — 
[glass.css](../src/styles/glass.css) only ever adds translucency on top of an
already-legible solid surface, so the site stays fully readable. Not a bug.

**Nothing animates:** `prefers-reduced-motion`. Also designed. The hero video
does not play under it either.

**A toast renders light on a dark page:** known issue. `sonner.tsx` calls
`useTheme()` but no `ThemeProvider` is mounted, so it falls back to `"system"`.
See [PRE-LAUNCH.md item 8](./PRE-LAUNCH.md#8-theme-provider-is-missing).

**Scroll position carries over between pages:** something removed
`data-scroll-behavior="smooth"` from `<html>` in
[layout.tsx](../src/app/layout.tsx). Next 16 no longer force-overrides scroll
behaviour on navigation; that attribute is what restores it.

To reproduce the accessibility fallbacks without changing OS settings:
DevTools → Rendering → Emulate CSS media feature.

---

## The enquiry drawer lost its contents

Selections persist in localStorage and are restored **after mount** by
[RfqHydration](../src/components/layout/rfq-hydration.tsx) — the store uses
`skipHydration: true` so the first client render matches the server HTML.

So a brief empty flash on load is expected. Permanently empty means either
localStorage is blocked (private browsing, strict privacy extension) or
`<RfqHydration />` was removed from the root layout.

Drawer *visibility* is deliberately not persisted — it should not reopen on a
return visit.

---

## Routine tasks

| Task | Where | Guide |
|---|---|---|
| Change a phone number or address | `src/config/site.ts` | [CONTENT.md](./CONTENT.md#change-a-phone-number) |
| Add or remove a product | `src/config/products.ts` | [CONTENT.md](./CONTENT.md#add-a-new-product) |
| Update a spec figure | `src/config/products.ts` | [CONTENT.md](./CONTENT.md#change-a-products-specs) |
| Swap an image | `src/config/media.ts` | [MEDIA.md](./MEDIA.md) |
| Change where enquiries go | `ENQUIRY_TO` env var | [DEPLOYMENT.md](./DEPLOYMENT.md#environment-variables) |
| Deploy | `git push` to `main` | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| Roll back a bad deploy | Vercel → Deployments → Promote | [DEPLOYMENT.md](./DEPLOYMENT.md#rolling-back) |

---

## Emergency: the site is down or badly broken

1. **Roll back first, diagnose second.** Vercel → Deployments → last known good
   → Promote to Production. Instant, no rebuild.
2. Check https://www.vercel-status.com and https://resend.com/status before
   assuming it is the code.
3. If the site is up but enquiries are down, put the phone number in front of
   people — that path does not depend on anything in this app.

Reproduce locally against the production build, not the dev server:

```bash
npm ci && npm run build && npm run start
```

Dev and production differ in ways that matter here — image optimisation, static
generation and server-action behaviour among them.
