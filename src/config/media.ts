/**
 * media.ts — every image and video URL on the site, in one place.
 *
 * HOW TO USE THIS FILE
 * Upload the source file named in each `SOURCE:` comment to blob storage, then
 * paste its public URL as the value. Nothing else needs to change; components
 * import from here, never from a literal URL.
 *
 * Source files live in the repo parent, outside `landing-page/`, so the 635MB of raw
 * phone photos and video never enter the build:
 *   ../kamm di photos/          <- the usable shoot
 *   ../WEBSITE SAMPLES/ONE/     <- assets from the legacy static site
 *
 * BEFORE UPLOADING — findings from auditing the source folders:
 *   • `IMG20260711182143.jpg` and `IMG20260711182143(1).jpg` are byte-identical.
 *     Same for the three copies of `VID20260711182117.mp4`. Upload one of each.
 *   • Photos are 5-9MB straight off a phone. Resize to max 2400px wide and
 *     convert to WebP/AVIF before upload, or every page will be image-bound.
 *   • Videos are 17-49MB. Compress to ~4MB 1080p H.264 MP4 for web loops.
 *   • `../faltu photos/` is excluded entirely, per the folder name.
 *
 * Any empty string renders a neutral placeholder instead of a broken image,
 * so the site stays deployable while URLs are still being filled in.
 */

export interface MediaAsset {
  /** Public blob-storage URL. Empty string = not yet uploaded. */
  src: string;
  /** Descriptive alt text. Required — this is a real accessibility surface. */
  alt: string;
  /** Intrinsic dimensions, used to reserve layout space and avoid CLS. */
  width: number;
  height: number;
}

export interface VideoAsset {
  src: string;
  /** Poster frame. Shown before playback and to reduced-motion users. */
  poster: string;
  alt: string;
}

// --- Brand ------------------------------------------------------------------

export const brand = {
  /**
   * SOURCE: ../WEBSITE SAMPLES/ONE/logo_image.png
   * NOTE: the source is a raster of the full horizontal lockup. It will look
   * soft in the glass header — worth vectorising to SVG before launch.
   */
  logoFull: {
    src: "",
    alt: "M2K Packpro Industries — Experts in Special Film Manufacturing",
    width: 970,
    height: 260,
  },
  /** SOURCE: crop the roundel mark out of logo_image.png (square, ~256px). */
  logoMark: {
    src: "",
    alt: "M2K Packpro Industries",
    width: 256,
    height: 256,
  },
} satisfies Record<string, MediaAsset>;

// --- Hero -------------------------------------------------------------------

export const hero = {
  /**
   * SOURCE: ../kamm di photos/VID20260713103311.mp4  (compress to ~4MB)
   * Extrusion line running. Plays muted/looped on desktop only, and never
   * under prefers-reduced-motion.
   */
  video: {
    src: "",
    poster: "",
    alt: "Stretch film extrusion line running at the M2K Packpro facility",
  } satisfies VideoAsset,

  /**
   * SOURCE: ../WEBSITE SAMPLES/ONE/factory_main.jpg
   * Poster frame and the no-JS / reduced-motion fallback for the hero.
   */
  poster: {
    src: "",
    alt: "Cast film line producing transparent stretch film",
    width: 1920,
    height: 1080,
  } satisfies MediaAsset,
};

// --- Products ---------------------------------------------------------------
// Keys must match the product `slug` values in config/products.ts.

export const products = {
  /**
   * SOURCE: ../kamm di photos/MACHINE CLOSEUP.jpg
   * CAUTION: only 51KB and slightly soft. Fine as a low-opacity texture, too
   * low-resolution for a full-bleed product hero. A reshoot would help.
   */
  "machine-grade-stretch-film": {
    src: "",
    alt: "Close-up of a machine grade stretch film roll on the winder",
    width: 960,
    height: 1280,
  },
  /**
   * SOURCE: ../kamm di photos/SILAGE FILM APPLICATION.jpg
   * The strongest image in the set — a real bale wrapper in the field. This
   * should carry the silage product page.
   */
  "silage-film": {
    src: "",
    alt: "Bale wrapper applying M2K silage film to a fodder bale in the field",
    width: 2000,
    height: 900,
  },
  /** SOURCE: ../kamm di photos/MANUAL GRADE.jpg */
  "manual-grade-stretch-film": {
    src: "",
    alt: "Hand-grade stretch film roll being applied to a palletised load",
    width: 1600,
    height: 1200,
  },
  /** SOURCE: ../WEBSITE SAMPLES/ONE/coloured_film.jpg */
  "coloured-stretch-film": {
    src: "",
    alt: "Coloured stretch film rolls in several tints",
    width: 1600,
    height: 1200,
  },
} satisfies Record<string, MediaAsset>;

// --- Facility ---------------------------------------------------------------

export const facility = {
  /** SOURCE: ../kamm di photos/IMG20260711181901.jpg */
  plantWide: {
    src: "",
    alt: "M2K Packpro production floor in Ludhiana, Punjab",
    width: 2400,
    height: 1800,
  },
  /** SOURCE: ../kamm di photos/IMG20260711181904.jpg */
  extrusionLine: {
    src: "",
    alt: "Multi-layer cast extrusion line",
    width: 2400,
    height: 1800,
  },
  /** SOURCE: ../kamm di photos/IMG20260711182139.jpg */
  windingStation: {
    src: "",
    alt: "Automatic winding and slitting station",
    width: 2400,
    height: 1800,
  },
  /**
   * SOURCE: ../kamm di photos/IMG20260711182143.jpg
   * (ignore the `(1)` duplicate — identical bytes)
   */
  finishedRolls: {
    src: "",
    alt: "Finished stretch film rolls staged for dispatch",
    width: 2400,
    height: 1800,
  },
} satisfies Record<string, MediaAsset>;

/** True when an asset has a URL. Use to fall back to a placeholder surface. */
export function hasMedia(asset: { src: string }): boolean {
  return asset.src.trim().length > 0;
}

/**
 * Media for a product, by slug.
 *
 * Returns an empty-but-valid asset rather than throwing when a slug has no
 * entry yet. Adding a product to config/products.ts should never be able to
 * crash a page just because its photo hasn't been uploaded — MediaFrame renders
 * a designed placeholder for an empty `src`.
 */
export function getProductMedia(slug: string): MediaAsset {
  const known: Record<string, MediaAsset> = products;
  return (
    known[slug] ?? {
      src: "",
      alt: "",
      width: 1600,
      height: 900,
    }
  );
}
