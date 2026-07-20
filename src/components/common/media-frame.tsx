import Image from "next/image";

import { hasMedia, type MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

/**
 * Renders an image from the media manifest, or a designed placeholder when no
 * URL has been supplied yet.
 *
 * The placeholder matters: config/media.ts ships with every `src` empty until
 * the blob URLs are pasted in, and a bare `<Image src="">` would either throw
 * or render a broken-image icon. Instead the frame degrades to a glass panel
 * with a subtle sheen — it reads as an intentional surface rather than as a
 * missing asset, so the site is presentable at every stage of the handover.
 */
export function MediaFrame({
  asset,
  className,
  sizes = "100vw",
  eager = false,
  children,
}: {
  asset: MediaAsset;
  className?: string;
  /** Responsive sizes hint. Always set this — it governs which file is served. */
  sizes?: string;
  /** True only for above-the-fold imagery. */
  eager?: boolean;
  /** Overlay content, e.g. a caption or gradient scrim. */
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass-surface relative overflow-hidden rounded-2xl",
        className,
      )}
    >
      {hasMedia(asset) ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          // Next 16 deprecated `priority`; these are the explicit equivalents.
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="object-cover"
        />
      ) : (
        /* Placeholder. aria-hidden because it carries no information — the
           surrounding copy already says what the section is about.

           Tuned to read as a deliberate brand surface rather than a missing
           asset: with most of config/media.ts still empty, these occupy a large
           share of the page, and flat grey boxes made the whole site look
           broken. Layered brand light plus specular banding suggests a roll of
           film catching the light. */
        <div aria-hidden className="absolute inset-0 bg-black/20">
          {/* Brand light entering top-left, amber counterpoint bottom-right —
              same lighting logic as the page backdrop, so placeholders sit in
              the same world as the glass around them.

              Colours are written out with color-mix rather than composed from
              `from-*` utilities: those set `--tw-gradient-from`, which only
              resolves when a Tailwind gradient utility is also on the element.
              Mixing the two idioms silently renders transparent. */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_15%_10%,color-mix(in_oklab,var(--m2k-red)_45%,transparent),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_85%_90%,color-mix(in_oklab,var(--m2k-amber)_25%,transparent),transparent_55%)]" />

          {/* Specular banding: wide soft highlight bands, as on wound film. */}
          <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(108deg,transparent_0_38px,rgb(255_255_255/0.13)_38px_44px,transparent_44px_92px)]" />
          {/* Finer strand lines over the top. */}
          <div className="absolute inset-0 opacity-[0.09] [background-image:repeating-linear-gradient(108deg,white_0_1px,transparent_1px_9px)]" />

          {/* Vignette, so the frame has depth rather than reading as flat fill. */}
          <div className="absolute inset-0 bg-[radial-gradient(85%_85%_at_50%_45%,transparent_35%,rgb(0_0_0/0.55)_100%)]" />
        </div>
      )}
      {children}
    </div>
  );
}
