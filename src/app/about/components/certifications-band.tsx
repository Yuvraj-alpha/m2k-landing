import { BadgeCheck } from "lucide-react";

import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { GlassCard } from "@/components/glass/glass-card";
import { siteConfig } from "@/config/site";

/**
 * Registrations and recognitions.
 *
 * Reads from siteConfig.certifications, which currently holds exactly what the
 * legacy site listed: MSME registration, Ministry of MSME, and Make In India.
 *
 * Note these are *registrations*, not quality certifications — there is no ISO
 * claim here because M2K has not published one. If they hold ISO 9001 (common
 * for this sector and a strong buyer signal) it should be added to
 * siteConfig.certifications; see PLAN.md.
 */
export function CertificationsBand() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Credentials"
          title="Registered and recognised"
          lede="Government registrations held by the works."
          align="center"
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-3">
          {siteConfig.certifications.map((cert) => (
            <li key={cert}>
              <GlassCard size="lg" className="h-full text-center">
                <BadgeCheck
                  className="text-brand-amber mx-auto size-8"
                  aria-hidden
                />
                <p className="mt-4 font-medium">{cert}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
