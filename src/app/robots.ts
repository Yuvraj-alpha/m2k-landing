import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * robots.txt.
 *
 * Open to all crawlers — this is a marketing site that wants to be found. The
 * only disallowed path is the design-system working surface, which also carries
 * a noindex meta tag; belt and braces.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/kitchen-sink",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
