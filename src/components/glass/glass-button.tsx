"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { usePointerGlow } from "@/hooks/use-pointer-glow";
import { cn } from "@/lib/utils";

/**
 * Marketing-scale call to action in glass.
 *
 * Deliberately separate from `components/ui/button.tsx` rather than another
 * variant of it. The shadcn button is tuned for dense application UI (its
 * default height is 32px); these are page-level CTAs that need a 44px+ touch
 * target and their own material treatment. Keeping them apart means neither
 * has to compromise, and shadcn updates won't fight our overrides.
 */
const glassButton = cva(
  [
    "relative isolate inline-flex shrink-0 items-center justify-center gap-2",
    "font-medium whitespace-nowrap transition-all outline-none select-none",
    // Focus ring is on --ring (brand red-lit) and offset from the substrate so
    // it stays visible against both glass and solid surfaces.
    "focus-visible:ring-ring/60 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        /** Translucent. The default — sits on the page as another glass object. */
        glass: "glass-surface glass-sheen hover:brightness-125",
        /**
         * Solid brand red with white text. Used for the single primary action
         * per view. Note this is a *surface* carrying white text, never brand
         * red as text — red on the dark substrate is only ~3.9:1.
         */
        solid: [
          "bg-brand text-white",
          "shadow-[0_8px_24px_-8px_var(--m2k-red)]",
          "hover:bg-brand-lit hover:shadow-[0_10px_32px_-8px_var(--m2k-red-lit)]",
        ],
        /** Amber. For secondary emphasis — certifications, catalogue links. */
        amber: "bg-brand-amber text-black hover:brightness-110",
        /** Bare. For tertiary actions where a surface would be too loud. */
        ghost: "hover:bg-white/10 hover:text-foreground",
      },
      size: {
        // 36px — inline/tertiary only, below the 44px touch guideline.
        sm: "h-9 rounded-lg px-4 text-sm",
        // 44px — meets the WCAG 2.2 target-size minimum.
        md: "h-11 rounded-xl px-6 text-sm",
        // 52px — page-level CTAs.
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: { variant: "glass", size: "md" },
  },
);

export interface GlassButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof glassButton> {
  /** Render as the child element — for wrapping `next/link`. */
  asChild?: boolean;
}

export function GlassButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: GlassButtonProps) {
  const glowRef = usePointerGlow<HTMLButtonElement>();
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      // Sheen only exists on the glass variant; the solid ones read their
      // hover state from colour instead.
      ref={variant === "glass" || variant == null ? glowRef : undefined}
      data-slot="glass-button"
      className={cn(glassButton({ variant, size }), className)}
      {...props}
    />
  );
}

export { glassButton };
