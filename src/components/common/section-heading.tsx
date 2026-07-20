import { cn } from "@/lib/utils";

/**
 * The eyebrow + heading + lede pattern used at the top of every section.
 *
 * Extracted after the home page repeated it six times. Centralising it also
 * centralises the heading *level*: sections pass `as` so the document outline
 * stays correct (one h1 per page, h2 for sections) rather than each section
 * hardcoding a tag and hoping.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  as?: "h1" | "h2";
  align?: "start" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "max-w-2xl",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "mt-4 font-extrabold text-balance",
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Tag>
      {lede && (
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          {lede}
        </p>
      )}
    </div>
  );
}
