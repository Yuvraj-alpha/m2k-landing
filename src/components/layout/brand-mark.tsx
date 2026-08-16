import Image from "next/image";

import { brand, hasMedia } from "@/config/media";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The M2K wordmark.
 *
 * Falls back to a typographic lockup when no logo has been uploaded yet, so the
 * header is presentable before media lands in config/media.ts — and so a
 * missing URL never renders a broken image.
 *
 * The fallback is not a stopgap to be embarrassed about: the supplied logo is a
 * 970px raster that will look soft against glass at any size. Until it is
 * vectorised, set type is genuinely the sharper option.
 */
export function BrandMark({ className }: { className?: string }) {
  if (hasMedia(brand.logoFull)) {
    return (
      <Image
        src={brand.logoFull.src}
        alt={brand.logoFull.alt}
        width={brand.logoFull.width}
        height={brand.logoFull.height}
        // Above the fold in the header — load it eagerly. (Next 16 deprecated
        // `priority` in favour of these explicit hints.)
        loading="eager"
        fetchPriority="high"
        className={cn("h-9 w-auto sm:h-24", className)}
      />
    );
  }

  return (
    <span
      className={cn("flex items-baseline gap-1.5 leading-none", className)}
      // The visual lockup is decorative; expose one clean name to screen
      // readers instead of three disconnected text fragments.
      aria-label={siteConfig.name}
    >
      <span aria-hidden className="font-heading text-2xl font-extrabold">
        {/* Brand red as a foreground here is safe: at 24px/800 weight this is
            large-scale text, which WCAG holds to 3:1 rather than 4.5:1. */}
        <span className="text-brand-lit">M2K</span>
      </span>
      <span
        aria-hidden
        className="font-heading hidden text-xs font-semibold tracking-[0.18em] uppercase sm:inline"
      >
        Packpro
      </span>
    </span>
  );
}
