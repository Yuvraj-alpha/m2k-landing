import { Layers, Ruler, ShieldCheck } from "lucide-react";

import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassPlate } from "@/components/glass/glass-plate";

/**
 * The three quality pillars.
 *
 * PROVENANCE — important, read before editing.
 *
 * `claim` is M2K's own published copy, transcribed from the legacy site. It is
 * the only thing here asserting something about M2K's process.
 *
 * `context` is general industry explanation of *why that property matters* on a
 * wrapping line. It deliberately makes no assertion about M2K's equipment,
 * procedures or results — it explains the physics a buyer is already weighing.
 * The split exists so a reader (and anyone editing later) can see exactly where
 * the company's claims stop and the background explanation starts.
 */
const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Intensive quality control",
    claim:
      "Every batch undergoes 7-point testing for tensile strength, cling, and micron accuracy before dispatch.",
    context:
      "Gauge that drifts mid-roll changes how much film reaches the load, so a wrapper tuned on Monday is over- or under-wrapping by Thursday. Testing per batch is what keeps a setting valid across deliveries.",
  },
  {
    icon: Ruler,
    title: "Precision finishing",
    claim:
      "Advanced slitting technology ensures flush roll edges, preventing telescoping and ensuring smooth machine runs.",
    context:
      "A roll whose edges aren't flush walks sideways on the mandrel as it unwinds — telescoping. On a high-speed wrapper that means web breaks and a stopped line, which costs far more than the film did.",
  },
  {
    icon: Layers,
    title: "Advanced polymers",
    claim:
      "We use 100% virgin LLDPE resins to achieve products with the highest performance.",
    context:
      "Reprocessed material carries contamination and inconsistent melt behaviour, which shows up as gels, thin spots and premature failure under load. Starting from virgin resin removes that variable.",
  },
] as const;

export function QualityPillars() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="Three things decide whether a film performs"
          lede="Consistent gauge, clean edges, and what the polymer started as."
        />

        <div className="mt-12 space-y-6">
          {PILLARS.map(({ icon: Icon, title, claim, context }) => (
            <GlassCard key={title} size="lg" edgeLight>
              <div className="grid gap-6 md:grid-cols-[auto_1fr_1fr] md:items-start">
                <span className="bg-brand/15 text-brand-lit flex size-12 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="size-6" aria-hidden />
                </span>

                <div>
                  <h3 className="text-xl font-extrabold">{title}</h3>
                  <GlassPlate className="mt-3 p-4">
                    <p className="text-sm leading-relaxed">{claim}</p>
                  </GlassPlate>
                </div>

                <div className="md:pt-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {context}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
