import { cn } from "@/lib/utils";

/**
 * The contrast guarantee for text on glass.
 *
 * This exists because glassmorphism's characteristic failure is unreadable
 * body copy: a 6%-tint panel inherits whatever contrast the imagery behind it
 * happens to have, which is to say none that can be relied on.
 *
 * Wrapping a run of copy in a GlassPlate puts an opaque-enough layer directly
 * beneath it, so the text's contrast ratio becomes a property of this plate
 * rather than of the backdrop. Under prefers-reduced-transparency it collapses
 * to nothing, because the parent card is already solid by then.
 *
 * Rule of thumb: headings and short labels may sit on bare glass. Anything a
 * user has to *read* — paragraphs, spec tables, form labels — goes on a plate.
 */
export function GlassPlate({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("glass-plate rounded-xl", className)} {...props} />;
}
