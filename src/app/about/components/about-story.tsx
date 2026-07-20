import { Container } from "@/components/common/container";
import { MediaFrame } from "@/components/common/media-frame";
import { SectionHeading } from "@/components/common/section-heading";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassPlate } from "@/components/glass/glass-plate";
import { facility } from "@/config/media";
import { siteConfig } from "@/config/site";

/**
 * The company story.
 *
 * PROVENANCE: paraphrased from the legacy site's About section, which is the
 * only first-party copy available. That source says, in full: a Ludhiana-based
 * manufacturing house specialising in stretch films; core values of integrity,
 * reliability and superior quality; leadership with 30 years in plastic
 * packaging; delivery with transparency and honesty; latest technologies,
 * expert personnel and rigid testing.
 *
 * Everything below stays inside those bounds. No headcount, no capacity, no
 * client list, no founding date — M2K has published none of those, and a
 * manufacturer's About page is exactly where an invented figure would be
 * quoted back at them.
 */
export function AboutStory() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title={`A stretch film works in ${siteConfig.address.locality}`}
              lede="We make one thing, and we make it properly."
            />

            <GlassPlate className="mt-8 space-y-4 p-6">
              <p className="leading-relaxed">
                M2K Packpro Industries is a manufacturing house based in{" "}
                <strong>
                  {siteConfig.address.locality}, {siteConfig.address.region}
                </strong>
                , specialising in stretch films. The company is built on three
                things: integrity, reliability, and superior quality.
              </p>
              <p className="leading-relaxed">
                Behind it is a leadership team with{" "}
                {siteConfig.experienceYears} years in plastic packaging. That
                experience is the reason we can talk to a customer about gauge,
                cling and load containment rather than just price — and the
                reason we deliver with transparency and honesty.
              </p>
              <p className="leading-relaxed">
                We believe in current technology, expert personnel, and rigid
                testing on every batch. A stretch film either holds the load
                through the journey or it doesn&rsquo;t, and the only way to
                know is to test it before it leaves the works.
              </p>
            </GlassPlate>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:mt-14">
            <MediaFrame
              asset={facility.plantWide}
              sizes="(min-width: 1024px) 25vw, 45vw"
              className="aspect-4/5"
            />
            <MediaFrame
              asset={facility.extrusionLine}
              sizes="(min-width: 1024px) 25vw, 45vw"
              className="aspect-4/5 sm:mt-10"
            />
          </div>
        </div>

        {/* Values. The three words are M2K's own; the gloss under each explains
            what it means in practice without adding a new claim. */}
        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {[
            {
              value: "Integrity",
              gloss:
                "The film you receive is the specification you agreed. No substitutions on gauge or grade.",
            },
            {
              value: "Reliability",
              gloss:
                "Consistent rolls, run after run, so your wrapper settings don't change with the delivery.",
            },
            {
              value: "Superior quality",
              gloss:
                "Virgin polymer and batch testing, because the cheapest film is rarely the cheapest per pallet.",
            },
          ].map((item) => (
            <GlassCard key={item.value} size="lg" edgeLight>
              <h3 className="font-heading text-xl font-extrabold">
                {item.value}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {item.gloss}
              </p>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
