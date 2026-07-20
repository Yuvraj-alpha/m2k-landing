import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand } from "@/app/components/cta-band";
import { AddToEnquiry } from "@/components/common/add-to-enquiry";
import { Container } from "@/components/common/container";
import { MediaFrame } from "@/components/common/media-frame";
import { SectionHeading } from "@/components/common/section-heading";
import { GlassCard } from "@/components/glass/glass-card";
import { getProductMedia } from "@/config/media";
import { capabilities, confirmedSpecs, productsInOrder } from "@/config/products";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Stretch Film Products",
  description: `Machine grade, manual grade, silage and coloured stretch films manufactured from 100% virgin LLDPE in ${siteConfig.address.locality}, ${siteConfig.address.region}.`,
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Our products"
            title="Stretch films built for the load"
            lede={`Four grades, all extruded from ${capabilities.polymer} at our ${siteConfig.address.locality} works and slit to your width.`}
          />
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {productsInOrder.map((product) => (
              <GlassCard
                key={product.slug}
                size="none"
                interactive
                className="flex flex-col overflow-hidden"
              >
                <MediaFrame
                  asset={getProductMedia(product.slug)}
                  sizes="(min-width: 640px) 45vw, 100vw"
                  className="aspect-video rounded-none border-0 shadow-none"
                />

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-extrabold">
                    {/* The whole card is the target: the link carries the
                        accessible name and its ::after stretches over the card,
                        keeping one focus stop rather than nesting controls. */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="focus-visible:ring-ring/60 rounded outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2"
                    >
                      {product.name}
                    </Link>
                  </h2>

                  <p className="text-muted-foreground mt-1.5 text-sm">
                    {product.tagline}
                  </p>

                  <dl className="mt-5 text-sm">
                    {confirmedSpecs(product).map((spec) => (
                      <div
                        key={spec.label}
                        className="border-border/50 flex justify-between gap-4 border-b py-2 last:border-b-0"
                      >
                        <dt className="text-muted-foreground">{spec.label}</dt>
                        <dd className="font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>

                  {/* mt-auto pins this to the bottom so the buttons line up
                      across cards of differing spec-table heights. */}
                  <div className="mt-auto pt-5">
                    <AddToEnquiry slug={product.slug} name={product.name} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
