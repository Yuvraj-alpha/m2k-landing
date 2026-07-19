import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/common/container";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassPlate } from "@/components/glass/glass-plate";
import {
  confirmedSpecs,
  getProduct,
  productSlugs,
  productsInOrder,
} from "@/config/products";

/**
 * PHASE 4 — proves the catalogue drives static generation and per-page
 * metadata. Imagery, RFQ selection and related-product logic land in phase 6.
 *
 * Next 16 note: `params` is a Promise in both the page and generateMetadata.
 * Synchronous access was removed, not merely deprecated.
 */

type Props = { params: Promise<{ slug: string }> };

/** Pre-renders every product at build time; unknown slugs 404. */
export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) return {};

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      url: `/products/${product.slug}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const others = productsInOrder.filter((p) => p.slug !== product.slug);

  return (
    <Container className="py-16 sm:py-24">
      <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{product.shortName}</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-balance sm:text-5xl">
          {product.name}
        </h1>
        <p className="text-brand-amber mt-3 text-lg">{product.tagline}</p>
        <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
          {product.description}
        </p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {/* Specifications. `self-start` stops the grid stretching this card to
            match the taller applications/features column, which left a large
            dead gap under the CTA. */}
        <GlassCard size="lg" edgeLight className="lg:col-span-1 lg:self-start">
          <h2 className="text-lg font-extrabold">Specifications</h2>
          <GlassPlate className="mt-4 p-4">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Technical specifications for {product.name}
              </caption>
              <tbody>
                {confirmedSpecs(product).map((spec) => (
                  <tr
                    key={spec.label}
                    className="border-border/50 border-b last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="text-muted-foreground py-2.5 text-left font-normal"
                    >
                      {spec.label}
                    </th>
                    <td className="py-2.5 text-right font-medium">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassPlate>

          <GlassButton asChild variant="solid" size="md" className="mt-5 w-full">
            <Link href="/contact">Request a quote</Link>
          </GlassButton>
        </GlassCard>

        {/* Applications + features */}
        <div className="grid gap-6 lg:col-span-2">
          <GlassCard size="lg">
            <h2 className="text-lg font-extrabold">Applications</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {product.applications.map((item) => (
                <li key={item} className="text-muted-foreground flex gap-2.5 text-sm">
                  <span aria-hidden className="text-brand-lit mt-0.5">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard size="lg">
            <h2 className="text-lg font-extrabold">Why this film</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {product.features.map((item) => (
                <li key={item} className="text-muted-foreground flex gap-2.5 text-sm">
                  <span aria-hidden className="text-brand-amber mt-0.5">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>

      {/* Related */}
      <section className="mt-16">
        <h2 className="text-sm font-semibold tracking-widest uppercase">
          Other grades
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {others.map((other) => (
            <GlassCard key={other.slug} size="md" interactive>
              <h3 className="font-medium">
                <Link
                  href={`/products/${other.slug}`}
                  className="focus-visible:ring-ring/60 rounded outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2"
                >
                  {other.name}
                </Link>
              </h3>
              <p className="text-muted-foreground mt-1.5 text-sm">
                {other.tagline}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>
    </Container>
  );
}
