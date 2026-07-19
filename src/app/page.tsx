import Link from "next/link";

import { Container } from "@/components/common/container";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassPlate } from "@/components/glass/glass-plate";
import { siteConfig } from "@/config/site";

/**
 * PHASE 3 PLACEHOLDER — replaced in phase 5 by the composed home page
 * (hero, trust bar, product showcase, why-us, process, CTA).
 *
 * For now it renders enough vertical content to exercise the shell: the
 * header's scrolled state, the sticky footer, and the skip link.
 */
export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[80svh] items-center">
        <Container>
          <div className="max-w-2xl">
            <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
              {siteConfig.address.locality}, {siteConfig.address.region} ·{" "}
              {siteConfig.experienceYears} years in packaging
            </p>

            <h1 className="mt-5 text-5xl font-extrabold text-balance sm:text-6xl">
              {siteConfig.name}
            </h1>

            <p className="text-muted-foreground mt-5 text-xl">
              {siteConfig.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <GlassButton asChild variant="solid" size="lg">
                <Link href="/contact">Request a quote</Link>
              </GlassButton>
              <GlassButton asChild variant="glass" size="lg">
                <Link href="/products">View products</Link>
              </GlassButton>
            </div>
          </div>
        </Container>
      </section>

      <Container className="pb-16">
        <GlassCard size="lg" edgeLight>
          <h2 className="text-2xl font-extrabold">Shell under construction</h2>
          <GlassPlate className="mt-5 p-5">
            <p className="text-sm leading-relaxed">
              Header, footer, mobile navigation and the WhatsApp affordance are
              in place. Scroll to watch the header transition from transparent
              to glass, and press <kbd>Tab</kbd> from the top of the page to
              reach the skip link. Page content arrives in phase 5.
            </p>
          </GlassPlate>
        </GlassCard>
      </Container>
    </>
  );
}
