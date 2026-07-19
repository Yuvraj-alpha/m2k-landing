/** A single row in a product's specification table. */
export interface ProductSpec {
  label: string;
  value: string;
  /**
   * Set when the figure is not yet confirmed by M2K. Consumers must not render
   * an unconfirmed spec on a public page — see `confirmedSpecs()` in
   * config/products.ts. Existing to keep known-missing data visible in the
   * codebase rather than silently absent.
   */
  unconfirmed?: boolean;
}

export interface ProductSeo {
  title: string;
  description: string;
  /** Search terms this page is written to serve. Documentation, not markup. */
  keywords: readonly string[];
}

export interface Product {
  /** URL segment. Must match a key in `products` in config/media.ts. */
  slug: string;
  /** Full display name, used as the <h1> and in the product grid. */
  name: string;
  /** Compact label for breadcrumbs, RFQ chips and the footer. */
  shortName: string;
  /** One line, sentence case. Sits under the name in cards. */
  tagline: string;
  /** Two or three sentences. The lede on the product page. */
  description: string;
  specs: readonly ProductSpec[];
  /** Concrete end-uses. Drives the "Applications" block. */
  applications: readonly string[];
  /** Differentiators. Drives the feature list on the product page. */
  features: readonly string[];
  seo: ProductSeo;
  /** Sort order in the catalogue; lower comes first. */
  order: number;
}
