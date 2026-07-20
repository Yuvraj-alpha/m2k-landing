import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { MediaFrame } from "@/components/common/media-frame";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";
import { getProductMedia } from "@/config/media";
import { confirmedSpecs, productsInOrder } from "@/config/products";

/**
 * The four grades, driven entirely by config/products.ts.
 *
 * Each card leads with the spec a buyer selects on rather than with prose —
 * micron range and stretch are the deciding factors, so they sit above the
 * fold of the card instead of below a paragraph.
 */
export function ProductShowcase() {
  return (
    <section id="products" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
              The range
            </p>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              A grade for every load
            </h2>
          </div>

          <GlassButton asChild variant="ghost" size="sm">
            <Link href="/products">
              All products
              <ArrowRight />
            </Link>
          </GlassButton>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {productsInOrder.map((product) => {
            const media = getProductMedia(product.slug);
            // Lead with the two specs buyers compare across grades.
            const headline = confirmedSpecs(product).filter((spec) =>
              ["Thickness", "Stretchability"].includes(spec.label),
            );

            return (
              <GlassCard
                key={product.slug}
                size="none"
                interactive
                className="overflow-hidden"
              >
                <MediaFrame
                  asset={media}
                  sizes="(min-width: 640px) 45vw, 100vw"
                  className="aspect-video rounded-none border-0 shadow-none"
                />

                <div className="p-6">
                  <h3 className="text-lg font-extrabold">
                    <Link
                      href={`/products/${product.slug}`}
                      className="focus-visible:ring-ring/60 rounded outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mt-1.5 text-sm">
                    {product.tagline}
                  </p>

                  {headline.length > 0 && (
                    <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      {headline.map((spec) => (
                        <div key={spec.label} className="flex gap-2">
                          <dt className="text-muted-foreground">
                            {spec.label}
                          </dt>
                          <dd className="font-medium">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
