import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { GlassCard } from "@/components/glass/glass-card";
import { confirmedSpecs, productsInOrder } from "@/config/products";
import { siteConfig } from "@/config/site";

/**
 * PHASE 4 — renders from config/products.ts to prove the data model drives
 * routing, ordering and spec display. Full treatment (filtering, imagery,
 * RFQ selection) lands in phase 6.
 */
export const metadata: Metadata = {
  title: "Stretch Film Products",
  description: `Machine grade, manual grade, silage and coloured stretch films manufactured from 100% virgin LLDPE in ${siteConfig.address.locality}, ${siteConfig.address.region}.`,
};

export default function ProductsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <header className="max-w-2xl">
        <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
          Our products
        </p>
        <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
          Stretch films built for the load
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Four grades, all extruded from 100% virgin LLDPE at our{" "}
          {siteConfig.address.locality} works.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {productsInOrder.map((product) => (
          <GlassCard
            key={product.slug}
            size="lg"
            interactive
            className="flex flex-col"
          >
            <h2 className="text-xl font-extrabold">
              {/* The whole card is the target: the link carries the accessible
                  name and its ::after stretches over the card. Keeps one clear
                  focus stop instead of nesting interactive elements. */}
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
          </GlassCard>
        ))}
      </div>
    </Container>
  );
}
