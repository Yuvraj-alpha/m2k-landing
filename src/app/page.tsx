import { siteConfig } from "@/config/site";

/**
 * PHASE 1 PLACEHOLDER — replaced in phase 5 by the composed home page
 * (hero, trust bar, product showcase, why-us, process, CTA).
 *
 * It exists now as a smoke test for the design tokens: it exercises the glass
 * material, the brand palette, and both font families, so phase 1 can be
 * verified visually rather than only by a green build.
 */
export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden p-6">
      {/* The backdrop now lives in the root layout, so it is shared by every
          route rather than re-declared per page. */}
      <section className="glass-surface glass-sheen glass-stretch relative w-full max-w-xl rounded-2xl p-10">
        <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
          Phase 1 · Scaffold complete
        </p>

        <h1 className="mt-4 text-4xl font-extrabold text-balance">
          {siteConfig.name}
        </h1>

        <p className="text-muted-foreground mt-2 text-lg">
          {siteConfig.tagline}
        </p>

        <div className="glass-plate mt-6 rounded-xl p-4">
          <p className="text-sm leading-relaxed">
            Body copy sits on a nested plate rather than on bare glass, so its
            contrast ratio is a property of this surface and not of whatever
            happens to be behind the panel.
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="glass-surface-strong rounded-lg px-3 py-2">
            <dt className="text-muted-foreground text-xs">Location</dt>
            <dd className="font-medium">
              {siteConfig.address.locality}, {siteConfig.address.region}
            </dd>
          </div>
          <div className="glass-surface-strong rounded-lg px-3 py-2">
            <dt className="text-muted-foreground text-xs">Enquiries</dt>
            <dd className="font-medium">{siteConfig.email}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
