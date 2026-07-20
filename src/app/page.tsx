import type { Metadata } from "next";

import { AboutTeaser } from "@/app/components/about-teaser";
import { CtaBand } from "@/app/components/cta-band";
import { HeroSection } from "@/app/components/hero-section";
import { ProductShowcase } from "@/app/components/product-showcase";
import { TrustBar } from "@/app/components/trust-bar";
import { WhyUsGrid } from "@/app/components/why-us-grid";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  // The root layout's title template appends the company name, so this stays
  // short and leads with the search intent rather than the brand.
  title: "Stretch Film Manufacturer in Ludhiana, Punjab",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ProductShowcase />
      <WhyUsGrid />
      <AboutTeaser />
      <CtaBand />
    </>
  );
}
