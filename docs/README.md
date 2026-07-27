# Documentation

Everything about building, deploying and maintaining the M2K Packpro site.

## Start here

| If you… | Read |
|---|---|
| Need to know what is left before launch | **[PRE-LAUNCH.md](./PRE-LAUNCH.md)** |
| Are new to this codebase | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Are shipping it to a real domain | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| Are uploading the photos and video | [MEDIA.md](./MEDIA.md) |
| Are changing copy, specs or contact details | [CONTENT.md](./CONTENT.md) |
| Are working on search visibility | [SEO.md](./SEO.md) |
| Are fixing something that is broken right now | [RUNBOOK.md](./RUNBOOK.md) |

## The one-paragraph summary

The site is code-complete and builds clean: 20 static routes, no lint errors,
a working enquiry pipeline, full structured data, generated OG cards, sitemap
and robots. What it does not have is **images** (all 12 URLs in
`config/media.ts` are empty), **email credentials** (`RESEND_API_KEY` unset,
so enquiries log but do not deliver), a **confirmed production domain**, and
**seven answers from M2K** about hours, incorporation year, test protocol and
missing spec figures. Those four things are the whole remaining launch scope.

## Two conventions worth knowing before you touch anything

**The provenance rule.** Nothing appears on this site that M2K has not actually
claimed. Where a claim was withheld, there is a comment saying so and why.
Those omissions are decisions, not oversights — see
[ARCHITECTURE.md](./ARCHITECTURE.md#the-provenance-rule).

**This is not the Next.js you remember.** Next 16 removed `next lint`, requires
declared image qualities, and changed scroll-restoration behaviour, among
others. Read `node_modules/next/dist/docs/` before writing Next code, and see
[the gotchas table](./ARCHITECTURE.md#next-16-specifics-that-bite).
