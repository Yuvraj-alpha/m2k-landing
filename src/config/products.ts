import type { Product, ProductSpec } from "@/types/product";

/**
 * The product catalogue — the single source of truth for /products,
 * /products/[slug], the sitemap, and the Product JSON-LD.
 *
 * Adding a product here creates its route, its sitemap entry and its structured
 * data automatically. Nothing else needs editing.
 *
 * ---------------------------------------------------------------------------
 * PROVENANCE — read before editing.
 *
 * Every `specs` figure below is transcribed verbatim from the legacy site's
 * spec tables (WEBSITE SAMPLES/ONE/index.html). Those are the only hard numbers
 * we have from M2K, and they must not be embellished: a stretch-film buyer
 * selects on micron range and stretch percentage, so a wrong figure here is a
 * wrong order.
 *
 * `applications` and `features` are written from general industry knowledge of
 * what these film grades are used for. They are deliberately generic and make
 * no claim M2K has not made — no certifications, no test standards, no
 * performance guarantees beyond the transcribed numbers.
 *
 * MISSING DATA that B2B buyers will ask for and M2K should supply:
 *   • Core diameter (typically 2" / 3")
 *   • Roll length and roll weight per grade
 *   • Whether silage film is available in colours other than white
 *   • UV stabilisation period for silage film — the legacy site says
 *     "12-month UV stabilized"; carried below but flagged for confirmation
 *   • Any test standard the "7-point testing" claim refers to
 * ------------------------------------------------------------------------- */

export const products = [
  {
    slug: "machine-grade-stretch-film",
    name: "Machine Grade Stretch Film",
    shortName: "Machine Grade",
    tagline: "For high-speed automatic wrapping lines",
    description:
      "Engineered for automatic and semi-automatic pallet wrappers, machine grade film is drawn on the line so a thinner gauge does the work of a heavier one. Consistent gauge and flush roll edges keep high-speed wrappers running without breaks or telescoping.",
    specs: [
      { label: "Stretchability", value: "350%+" },
      { label: "Widths", value: "250 mm – 1000 mm" },
      { label: "Thickness", value: "12 – 80 micron" },
    ],
    applications: [
      "Automatic and semi-automatic pallet wrapping",
      "High-throughput distribution and warehousing",
      "Unitising palletised loads for transit",
      "Export consignments requiring load stability",
    ],
    features: [
      "Pre-stretch performance reduces film consumption per pallet",
      "Consistent gauge across the roll width",
      "Flush, precision-slit edges prevent telescoping",
      "Produced from 100% virgin LLDPE",
    ],
    seo: {
      title: "Machine Grade Stretch Film Manufacturer",
      description:
        "Machine grade LLDPE stretch film with 350%+ stretch, 12–80 micron, 250–1000 mm widths. Manufactured in Ludhiana, Punjab by M2K Packpro Industries.",
      keywords: [
        "machine grade stretch film",
        "pallet wrapping film manufacturer",
        "LLDPE stretch film India",
        "automatic wrapper film",
      ],
    },
    order: 1,
  },
  {
    slug: "silage-film",
    name: "Silage Film",
    shortName: "Silage Film",
    tagline: "UV-stabilised bale wrap for fodder preservation",
    // NOTE: says the film *is* UV stabilised (sourced from the legacy site)
    // without stating for how long. The duration is a performance guarantee
    // and is held back as `unconfirmed` in the spec table below — the prose
    // must not smuggle it back in.
    description:
      "Silage film seals harvested fodder into an anaerobic environment so it ferments rather than spoils. The film is UV stabilised for outdoor storage, and tacks to itself to hold the seal through handling and stacking.",
    specs: [
      { label: "Stretchability", value: "350%+" },
      { label: "Widths", value: "250 mm – 1000 mm" },
      { label: "Thickness", value: "20 – 40 micron" },
      // Legacy site states "12-month UV stabilized crop protection". Carried
      // through, but a UV rating is a performance guarantee — confirm before
      // publishing.
      { label: "UV stabilisation", value: "12 months", unconfirmed: true },
    ],
    applications: [
      "Round and square bale wrapping",
      "Green fodder and maize silage preservation",
      "Dairy and livestock feed storage",
      "Outdoor bale stacking through the season",
    ],
    features: [
      "UV stabilised for outdoor storage",
      "High cling holds the seal through handling",
      "Puncture resistance suited to field conditions",
      "Airtight wrap supports consistent fermentation",
    ],
    seo: {
      title: "Silage Film Manufacturer | Bale Wrap Film",
      description:
        "UV-stabilised silage bale wrap film, 20–40 micron, 250–1000 mm widths, 350%+ stretch. Manufactured in Ludhiana, Punjab by M2K Packpro Industries.",
      keywords: [
        "silage film manufacturer",
        "bale wrap film India",
        "silage wrap Punjab",
        "fodder preservation film",
      ],
    },
    order: 2,
  },
  {
    slug: "manual-grade-stretch-film",
    name: "Manual Grade Stretch Film",
    shortName: "Manual Grade",
    tagline: "Hand-applied film for everyday wrapping",
    description:
      "Hand grade film is wound for manual application, where the operator supplies the tension rather than a powered pre-stretch unit. Lower stretch than machine grade by design, so loads can be wrapped by hand without fighting the roll.",
    specs: [
      { label: "Stretchability", value: "150%+" },
      { label: "Widths", value: "50 mm – 1000 mm" },
      { label: "Thickness", value: "12 – 80 micron" },
    ],
    applications: [
      "Manual pallet and load wrapping",
      "Bundling irregular or odd-sized goods",
      "Furniture and appliance protection in transit",
      "Low-volume dispatch and job-lot packing",
    ],
    features: [
      "Tuned for comfortable hand application",
      "Narrow widths available for bundling",
      "Clings without adhesive residue",
      "Produced from 100% virgin LLDPE",
    ],
    seo: {
      title: "Manual Grade Stretch Film Manufacturer | Hand Wrap Film",
      description:
        "Hand grade LLDPE stretch film, 150%+ stretch, 12–80 micron, widths from 50 mm. Manufactured in Ludhiana, Punjab by M2K Packpro Industries.",
      keywords: [
        "manual grade stretch film",
        "hand wrap film manufacturer",
        "hand grade stretch film India",
        "bundling film Punjab",
      ],
    },
    order: 3,
  },
  {
    slug: "coloured-stretch-film",
    name: "Coloured Stretch Film",
    shortName: "Coloured Film",
    tagline: "Tinted film for sorting, security and branding",
    description:
      "Colour turns a wrapped pallet into a signal — routing loads by destination, marking batches, or obscuring contents from view. Produced to requirement across the standard width and gauge range.",
    specs: [
      { label: "Available colours", value: "As per requirement" },
      { label: "Widths", value: "50 mm – 1000 mm" },
      { label: "Thickness", value: "12 – 80 micron" },
    ],
    applications: [
      "Colour-coding loads by destination or customer",
      "Batch and shift identification in production",
      "Opaque wrapping to obscure high-value goods",
      "Brand-matched pallet presentation",
    ],
    features: [
      "Colours matched to customer requirement",
      "Opaque options for load security",
      "Same width and gauge range as clear film",
      "Consistent tint across the production run",
    ],
    seo: {
      title: "Coloured Stretch Film Manufacturer | Tinted Pallet Wrap",
      description:
        "Coloured LLDPE stretch film made to requirement, 12–80 micron, 50–1000 mm widths. Manufactured in Ludhiana, Punjab by M2K Packpro Industries.",
      keywords: [
        "coloured stretch film",
        "black stretch film manufacturer",
        "tinted pallet wrap India",
        "colour coded stretch film",
      ],
    },
    order: 4,
  },
] as const satisfies readonly Product[];

/** Union of every valid product slug — `"machine-grade-stretch-film" | …` */
export type ProductSlug = (typeof products)[number]["slug"];

/** Catalogue in display order. */
export const productsInOrder: readonly Product[] = [...products].sort(
  (a, b) => a.order - b.order,
);

export const productSlugs: readonly ProductSlug[] = products.map((p) => p.slug);

/**
 * Look up a product by slug. Returns undefined for unknown slugs so route
 * handlers can call `notFound()` rather than rendering a broken page.
 */
export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Specs safe to publish — drops anything still awaiting confirmation from M2K.
 * Public pages must use this rather than `product.specs` directly, so an
 * unverified figure can never reach a customer.
 */
export function confirmedSpecs(product: Product): readonly ProductSpec[] {
  return product.specs.filter((spec) => !spec.unconfirmed);
}
