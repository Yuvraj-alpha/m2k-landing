import { Layers, Ruler, ShieldCheck } from "lucide-react";

import { Container } from "@/components/common/container";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassPlate } from "@/components/glass/glass-plate";

/**
 * "Why choose us", carried over from the legacy site.
 *
 * PROVENANCE: all three claims below are M2K's own published copy, transcribed
 * from WEBSITE SAMPLES/ONE/index.html. They are reproduced rather than
 * rewritten, so nothing new is being asserted on the company's behalf.
 *
 * The "7-point testing" figure is specific enough to be checkable, and no test
 * standard is named. It is flagged in PLAN.md for M2K to confirm before launch.
 */
const REASONS = [
  {
    icon: ShieldCheck,
    title: "Intensive quality control",
    body: "Every batch undergoes 7-point testing for tensile strength, cling, and micron accuracy before dispatch.",
  },
  {
    icon: Ruler,
    title: "Precision finishing",
    body: "Advanced slitting technology ensures flush roll edges, preventing telescoping and ensuring smooth machine runs.",
  },
  {
    icon: Layers,
    title: "Advanced polymers",
    body: "We use 100% virgin LLDPE resins to achieve products with the highest performance.",
  },
] as const;

export function WhyUsGrid() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="max-w-xl">
          <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
            Why M2K
          </p>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            The roll runs, or it doesn&rsquo;t
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            A film that snaps on a high-speed wrapper costs more in downtime than
            it ever saved on price.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, body }) => (
            <GlassCard key={title} size="lg" edgeLight>
              <span className="bg-brand/15 text-brand-lit flex size-11 items-center justify-center rounded-xl">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
              {/* Body copy on a plate — the contrast rule from phase 2. */}
              <GlassPlate className="mt-3 p-4">
                <p className="text-sm leading-relaxed">{body}</p>
              </GlassPlate>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
