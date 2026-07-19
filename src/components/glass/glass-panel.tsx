import { cn } from "@/lib/utils";

/**
 * A full-width section wrapper in glass.
 *
 * Distinct from GlassCard in intent: a card is an *object* on the page, a panel
 * is a *band* of the page. Panels are static (no hover response) and stay
 * server components — they wrap whole sections, so pulling them client-side
 * would be a real cost for no interaction.
 */
export function GlassPanel({
  className,
  bleed = false,
  ...props
}: React.ComponentPropsWithoutRef<"section"> & {
  /** Full-bleed: square off the corners and drop the side borders. */
  bleed?: boolean;
}) {
  return (
    <section
      className={cn(
        "glass-surface relative",
        bleed ? "rounded-none border-x-0" : "rounded-3xl",
        className,
      )}
      {...props}
    />
  );
}
