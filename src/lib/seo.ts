import type { Product } from "@/types/product";
import { confirmedSpecs } from "@/config/products";
import { siteConfig } from "@/config/site";

/**
 * JSON-LD builders.
 *
 * Structured data is a set of *claims to search engines*, so the same rule that
 * governs the visible copy governs this file: nothing asserted here that M2K
 * hasn't published. In particular there is no `aggregateRating`, no `review`,
 * no `priceRange` and no `foundingDate` — inventing any of those is exactly the
 * kind of thing that earns a manual action, and none are supported by source.
 *
 * Types are loose (`Record<string, unknown>`) on purpose: schema.org graphs are
 * open-ended, and a precise TS type here would fight every legitimate addition
 * for no safety gain. The shapes are validated by Google's Rich Results test,
 * not by the compiler.
 */

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

/** Organisation + LocalBusiness. Emitted once, in the root layout. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    // Manufacturer is the accurate type; LocalBusiness gives the address the
    // local-pack treatment for "stretch film manufacturer Ludhiana".
    "@type": ["Organization", "LocalBusiness", "Manufacturer"],
    "@id": absolute("/#organization"),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.countryCode,
    },
    // Every listed number, so a knowledge panel shows both lines.
    contactPoint: siteConfig.phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "sales",
      areaServed: siteConfig.address.countryCode,
    })),
    // Registrations M2K actually holds — no ISO claim, because none is sourced.
    knowsAbout: [
      "Stretch film manufacturing",
      "LLDPE film extrusion",
      "Silage film",
      "Pallet wrapping film",
    ],
  };
}

/** Product schema for a single product page. */
export function productJsonLd(product: Product): Record<string, unknown> {
  // Only confirmed specs become additionalProperty — the same gate the visible
  // spec table uses, so structured data and page never disagree.
  const specs = confirmedSpecs(product);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absolute(`/products/${product.slug}#product`),
    name: product.name,
    description: product.seo.description,
    category: "Stretch film",
    // Manufacturer, not seller — this site does not sell online, and claiming
    // an Offer with a price we don't have would be a fabrication.
    manufacturer: { "@id": absolute("/#organization") },
    brand: { "@type": "Brand", name: siteConfig.shortName },
    additionalProperty: specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
  };
}

/** BreadcrumbList for a nested page. `trail` is [label, path] pairs. */
export function breadcrumbJsonLd(
  trail: readonly (readonly [string, string])[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absolute(path),
    })),
  };
}

/**
 * Serialises JSON-LD for a <script> tag.
 *
 * Escapes `<` so a value containing "</script>" can't break out of the tag —
 * the standard XSS guard for inline JSON. Everything here is first-party data,
 * but the guard costs nothing and is correct regardless of source.
 */
export function jsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
