import { ImageResponse } from "next/og";

import { getProduct, productSlugs } from "@/config/products";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Static, generic alt. Per-product alt text would need generateImageMetadata,
// which requires an `id` on every returned item and adds a metadata-id route
// for a one-image-per-page case that doesn't warrant it.
export const alt = "M2K Packpro stretch film";

/** Pre-render one card per product at build time. */
export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

// Next 16: `params` is a Promise in opengraph-image, same as in the page.
type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Stretch film"
        title={product?.name ?? "Stretch Film"}
        subtitle={product?.tagline}
      />
    ),
    size,
  );
}
