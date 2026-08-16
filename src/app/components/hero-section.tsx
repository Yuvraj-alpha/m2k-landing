import Link from "next/link";

import { Container } from "@/components/common/container";
import { MediaFrame } from "@/components/common/media-frame";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";
import { hero } from "@/config/media";
import { capabilities } from "@/config/products";
import { siteConfig } from "@/config/site";

/**
 * Home hero.
 *
 * The headline leads with what M2K *makes* rather than with the company name —
 * a buyer arriving from "stretch film manufacturer Ludhiana" needs to confirm
 * they're in the right place within one line. The company name is in the header,
 * the title tag and the footer; it doesn't need to be the <h1>.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
              {siteConfig.address.locality}, {siteConfig.address.region}
            </p>

            <h1 className="mt-5 text-5xl font-extrabold text-balance sm:text-6xl lg:text-7xl">
              Stretch film,
              <br />
              <span className="text-brand-lit">made to hold.</span>
            </h1>

            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
              Machine grade, manual grade, silage and coloured stretch films —
              extruded from {capabilities.polymer} at our{" "}
              {siteConfig.address.locality} works, and slit to your width.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <GlassButton asChild variant="solid" size="lg">
                <Link href="/contact">Request a quote</Link>
              </GlassButton>
              <GlassButton asChild variant="glass" size="lg">
                <Link href="/products">See the range</Link>
              </GlassButton>
            </div>
          </div>

          {/* Visual. Falls back to a designed glass panel until the hero photo
              is uploaded — see components/common/media-frame.tsx. */}
          <MediaFrame
            asset={hero.poster}
            eager
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-4/3 w-full lg:aspect-square"
          >
            {/* Capability figures, laid over the image. These are the numbers a
                buyer is actually scanning for. */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <GlassCard
                variant="raised"
                size="sm"
                className="backdrop-blur-xl"
              >
                <dl className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Widths", value: capabilities.widthRange },
                    { label: "Thickness", value: capabilities.thicknessRange },
                    { label: "Stretch", value: capabilities.maxStretch },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-muted-foreground text-[0.65rem] tracking-wider uppercase">
                        {stat.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </GlassCard>
            </div>
          </MediaFrame>
        </div>
      </Container>
    </section>
  );
}
