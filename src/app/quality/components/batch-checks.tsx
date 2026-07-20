import { Container } from "@/components/common/container";
import { MediaFrame } from "@/components/common/media-frame";
import { SectionHeading } from "@/components/common/section-heading";
import { GlassCard } from "@/components/glass/glass-card";
import { facility } from "@/config/media";

/**
 * What gets checked on every batch.
 *
 * PROVENANCE: M2K's copy states "7-point testing for tensile strength, cling,
 * and micron accuracy". It names three of the seven points and does not
 * enumerate the rest.
 *
 * Only those three are listed here. Inventing four more to fill out the number
 * would be fabricating a test protocol for a real manufacturer — the exact
 * thing a customer might later audit against. The heading is worded to describe
 * the named checks rather than to promise a count.
 *
 * TODO: once M2K supplies the full seven points (and any standard they test
 * to — ASTM D5459 for cling, D882 for tensile are the usual ones), list them
 * all and the section can legitimately be titled "7-point testing".
 */
const NAMED_CHECKS = [
  {
    property: "Tensile strength",
    detail:
      "How much force the web takes before it yields — what stops it snapping mid-wrap.",
  },
  {
    property: "Cling",
    detail:
      "How well the film tacks to itself, so the last wrap holds instead of peeling back on the pallet.",
  },
  {
    property: "Micron accuracy",
    detail:
      "Whether the gauge you ordered is the gauge on the roll, consistently across its width.",
  },
] as const;

export function BatchChecks() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Before dispatch"
              title="Checked on every batch"
              lede="No roll leaves the works untested. Among the properties measured:"
            />

            <dl className="mt-8 space-y-4">
              {NAMED_CHECKS.map((check) => (
                <GlassCard key={check.property} size="md">
                  <dt className="font-heading font-extrabold">
                    {check.property}
                  </dt>
                  <dd className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {check.detail}
                  </dd>
                </GlassCard>
              ))}
            </dl>
          </div>

          <MediaFrame
            asset={facility.windingStation}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-4/5 w-full"
          />
        </div>
      </Container>
    </section>
  );
}
