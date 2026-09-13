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
    <main className="pt-8">
      <QualityPillars />
      <BatchChecks />
      <CtaBand />
    </main>
  );
}
