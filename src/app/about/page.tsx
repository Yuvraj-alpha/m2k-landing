import type { Metadata } from "next";

import { AboutStory } from "@/app/about/components/about-story";
import { CertificationsBand } from "@/app/about/components/certifications-band";
import { CtaBand } from "@/app/components/cta-band";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `M2K Packpro Industries is a stretch film manufacturer in ${siteConfig.address.locality}, ${siteConfig.address.region}, backed by ${siteConfig.experienceYears} years of leadership experience in plastic packaging.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="About M2K Packpro"
            title="Experts in special film manufacturing"
            lede={`A manufacturing house in ${siteConfig.address.locality}, ${siteConfig.address.region}, making stretch films from 100% virgin LLDPE.`}
          />
        </Container>
      </section>

      <AboutStory />
      <CertificationsBand />
      <CtaBand />
    </>
  );
}
