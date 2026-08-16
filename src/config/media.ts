/**
 * media.ts — central source for site image and video URLs.
 *
 * Empty `src` values render placeholders via MediaFrame.
 */

export interface MediaAsset {
  src: string;
  alt: string;
}

export interface VideoAsset {
  src: string;
  poster: string;
  alt: string;
}

export interface SizedMediaAsset extends MediaAsset {
  width: number;
  height: number;
}

// --- Brand ------------------------------------------------------------------

export const brand = {
  logoFull: {
    src: "",
    alt: "M2K Packpro Industries — Experts in Special Film Manufacturing",
    width: 970,
    height: 260,
  },
  logoMark: {
    src: "",
    alt: "M2K Packpro Industries",
    width: 256,
    height: 256,
  },
} satisfies Record<string, SizedMediaAsset>;

// --- Hero -------------------------------------------------------------------

export const hero = {
  video: {
    src: "",
    poster: "",
    alt: "Stretch film extrusion line running at the M2K Packpro facility",
  } satisfies VideoAsset,

  poster: {
    src: "",
    alt: "Cast film line producing transparent stretch film",
  } satisfies MediaAsset,
};

// --- Products ---------------------------------------------------------------

export const products = {
  "machine-grade-stretch-film": {
    card: {
      src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/products/machine-grade.webp",
      alt: "Machine grade stretch film roll",
    },
    page: {
      src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/products/machine-grade.webp",
      alt: "Close-up of a machine grade stretch film roll on the winder",
    },
  },

  "manual-grade-stretch-film": {
    card: {
      src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/products/manual-grade.webp",
      alt: "Manual grade stretch film roll",
    },
    page: {
      src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/products/manual-grade.webp",
      alt: "Hand-grade stretch film roll being applied to a palletised load",
    },
  },

  "silage-film": {
    card: {
      src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/products/silage-film.webp",
      alt: "Silage stretch film",
    },
    page: {
      src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/products/silage-farm.webp",
      alt: "Bale wrapper applying M2K silage film to a fodder bale in the field",
    },
  },

  "coloured-stretch-film": {
    card: {
      src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/products/colored-rolls.webp",
      alt: "Coloured stretch film rolls",
    },
    page: {
      src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/products/color-coded.webp",
      alt: "Coloured stretch film rolls in several tints",
    },
  },
} satisfies Record<
  string,
  {
    card: MediaAsset;
    page: MediaAsset;
  }
>;

// --- Facility ---------------------------------------------------------------

export const facility = {
  plantWide: {
    src: "https://qmsqiabk0m5xt15h.public.blob.vercel-storage.com/home/built-in-ldh.webp",
    alt: "M2K Packpro production floor in Ludhiana, Punjab",
  },

  extrusionLine: {
    src: "",
    alt: "Multi-layer cast extrusion line",
  },

  windingStation: {
    src: "",
    alt: "Automatic winding and slitting station",
  },

  finishedRolls: {
    src: "",
    alt: "Finished stretch film rolls staged for dispatch",
  },
} satisfies Record<string, MediaAsset>;

export function hasMedia(asset: { src: string }): boolean {
  return asset.src.trim().length > 0;
}

export function getProductMedia(
  slug: string,
  location: "card" | "page",
): MediaAsset {
  return (
    products[slug as keyof typeof products]?.[location] ?? {
      src: "",
      alt: "",
    }
  );
}
