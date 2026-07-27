import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og-template";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Sitewide Open Graph card. Used for the home page and any route without one. */
export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${siteConfig.address.locality}, ${siteConfig.address.region}`}
        title="Stretch film, made to hold."
        subtitle="Machine, manual, silage & coloured stretch films from 100% virgin LLDPE."
      />
    ),
    size,
  );
}
