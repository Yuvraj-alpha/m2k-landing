import type { Metadata } from "next";

import { CtaBand } from "@/app/components/cta-band";
import { BatchChecks } from "@/app/quality/components/batch-checks";
import { QualityPillars } from "@/app/quality/components/quality-pillars";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Quality & Manufacturing",
  description: `Batch testing, precision slitting and 100% virgin LLDPE — how M2K Packpro Industries controls stretch film quality at our ${siteConfig.address.locality} works.`,
  alternates: { canonical: "/quality" },
};

export default function QualityPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Quality"
            title="A film either holds the load, or it doesn't"
            lede="Stretch film is bought on price and judged on downtime. Everything below is about making sure the second one never becomes your problem."
          />
        </Container>
      </section>

      <QualityPillars />
      <BatchChecks />
      <CtaBand />
    </>
  );
}
