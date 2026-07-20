import { Container } from "@/components/common/container";
import { siteConfig } from "@/config/site";

/**
 * Credibility strip directly under the hero.
 *
 * Every item is sourced: the polymer claim and MSME registration come from the
 * legacy site, the location from the company address, and the experience figure
 * is M2K's own "30 years in plastic packaging" — stated as experience, not as a
 * founding date. Nothing here is invented.
 */
const SIGNALS = [
  // Value and label must not restate each other — an earlier pass read
  // "100% virgin LLDPE / Virgin resin only", which is the same fact twice.
  // "no regrind" was considered here and dropped: it is implied by "100%
  // virgin", but it is a separate, stronger claim in this industry and M2K
  // has not made it. Stick to their wording.
  { value: "100% virgin", label: "LLDPE resin" },
  { value: `${siteConfig.experienceYears} years`, label: "In plastic packaging" },
  { value: "4 grades", label: "Machine, manual, silage, coloured" },
  { value: "MSME", label: "Registered, Govt. of India" },
] as const;

export function TrustBar() {
  return (
    <section aria-label="At a glance" className="pb-16 sm:pb-24">
      <Container>
        <dl className="glass-surface grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4">
          {SIGNALS.map((signal) => (
            <div
              key={signal.label}
              className="flex flex-col items-center px-4 py-6 text-center"
            >
              <dt className="sr-only">{signal.label}</dt>
              <dd>
                <span className="font-heading block text-lg font-extrabold sm:text-xl">
                  {signal.value}
                </span>
                <span
                  aria-hidden
                  className="text-muted-foreground mt-1 block text-xs"
                >
                  {signal.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
