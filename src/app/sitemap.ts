import type { MetadataRoute } from "next";

import { productsInOrder } from "@/config/products";
import { siteConfig } from "@/config/site";

/**
 * Sitemap, generated from the route set.
 *
 * Product URLs derive from config/products.ts, so adding a product adds its
 * sitemap entry automatically — the same single source of truth that drives the
 * routes and the JSON-LD.
 *
 * No `lastModified`: this is a static brochure site with no per-page change
 * history, and a build-time `new Date()` would report every page as "changed"
 * on every deploy, which is worse than omitting it. Add real timestamps only
 * when there's a real signal (e.g. a CMS updatedAt) to back them.
 *
 * /kitchen-sink is intentionally excluded — it is a noindex working surface.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/products"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/quality"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = productsInOrder.map(
    (product) => ({
      url: url(`/products/${product.slug}`),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...productRoutes];
}
