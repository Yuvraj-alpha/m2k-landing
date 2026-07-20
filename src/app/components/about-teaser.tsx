import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { MediaFrame } from "@/components/common/media-frame";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassPlate } from "@/components/glass/glass-plate";
import { facility } from "@/config/media";
import { siteConfig } from "@/config/site";

/**
 * About section, paraphrased from the legacy site's own copy.
 *
 * The source states: a Ludhiana-based manufacturing house specialising in
 * stretch films; core values of integrity, reliability and superior quality;
 * leadership with 30 years in plastic packaging; latest technologies, expert
 * personnel and rigid testing. Nothing beyond that is claimed here.
 */
export function AboutTeaser() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <MediaFrame
            asset={facility.plantWide}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-4/3 w-full"
          />

          <GlassCard size="lg">
            <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
              About us
            </p>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Built in {siteConfig.address.locality}
            </h2>

            <GlassPlate className="mt-5 space-y-4 p-5">
              <p className="text-sm leading-relaxed">
                We are a manufacturing house in{" "}
                <strong>
                  {siteConfig.address.locality}, {siteConfig.address.region}
                </strong>
                , specialising in stretch films — built on integrity,
                reliability and superior quality.
              </p>
              <p className="text-sm leading-relaxed">
                Our leadership brings {siteConfig.experienceYears} years in
                plastic packaging, and we deliver on it with transparency and
                honesty: current technology, expert personnel, and rigid testing
                on every batch.
              </p>
            </GlassPlate>

            <GlassButton asChild variant="glass" size="md" className="mt-6">
              <Link href="/about">
                More about the works
                <ArrowRight />
              </Link>
            </GlassButton>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
