import { cn } from "@/lib/utils";

/**
 * The lit substrate every glass surface refracts.
 *
 * Deliberately a *server* component with zero JavaScript: the drift is CSS
 * keyframes (see glass.css), so this costs nothing to hydrate and the motion
 * runs on the compositor rather than the main thread.
 *
 * Fixed and full-bleed, sitting behind all content at -z-10. It is decorative,
 * so it is hidden from assistive tech entirely.
 *
 * Colour comes from the brand tokens at low alpha. The point is not to be seen
 * as red and amber shapes — it is to give the glass something with *structure*
 * to bend, so the panels read as material rather than as grey boxes.
 */
export function LiquidBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Brand red, upper left — the dominant light source.
          Alphas here are contrast-critical, not just aesthetic: they set the
          brightest background any text can land on. Raising them means
          re-measuring --muted-foreground. See colors.css. */}
      <div className="liquid-blob liquid-blob-a bg-brand/45 -top-40 -left-32 size-144" />

      {/* Amber, lower right — the warm counterpoint from the catalogue.
          Held down at /22 because amber is the brightest hue in the palette
          and was the worst-performing background in contrast testing. */}
      <div className="liquid-blob liquid-blob-b bg-brand-amber/22 -right-40 -bottom-48 size-128" />

      {/* Cool steel, centre-right — stops the two warm blobs blending into a
          single orange wash, and puts light behind mid-page content. */}
      <div className="liquid-blob liquid-blob-c top-1/4 left-1/2 size-120 bg-slate-300/22" />

      {/* Fourth blob, lower left. The backdrop is fixed, so this is about
          filling a dark quadrant of the viewport rather than about page
          length — the first pass left the lower left with no light at all. */}
      <div className="liquid-blob liquid-blob-a bg-brand/35 bottom-1/4 -left-24 size-120 [animation-delay:-19s]" />

      {/* Vignette. Only darkens the extreme edges now — the earlier
          background/80 wash at the bottom was crushing the blobs and taking
          the refraction with them. */}
      <div className="via-background/0 to-background/50 absolute inset-0 bg-radial from-transparent" />
    </div>
  );
}
