import { cn } from "@/lib/utils";

/**
 * Horizontal rhythm for the whole site.
 *
 * Every page section uses this so gutters stay identical across routes. The
 * `max-w-6xl` ceiling keeps spec tables and body copy at a readable measure on
 * wide monitors rather than letting lines run to 2000px.
 */
export function Container({
  className,
  size = "default",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  /** `narrow` for prose-heavy pages, `wide` for full product grids. */
  size?: "narrow" | "default" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className,
      )}
      {...props}
    />
  );
}
