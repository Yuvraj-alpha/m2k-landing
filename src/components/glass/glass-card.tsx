"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { usePointerGlow } from "@/hooks/use-pointer-glow";
import { cn } from "@/lib/utils";

/**
 * The primary glass surface.
 *
 * This is a client component because the specular highlight needs pointer
 * position. That boundary is cheap: `children` are passed through as an already
 * server-rendered React node, so wrapping server content in a GlassCard does
 * *not* pull that content into the client bundle.
 */
const glassCard = cva("relative isolate", {
  variants: {
    variant: {
      /** Standard translucent panel. The default for content cards. */
      default: "glass-surface",
      /** Denser tint. For cards that sit on top of other glass. */
      raised: "glass-surface glass-surface-strong",
      /** Frosted, near-opaque. For surfaces carrying dense body copy. */
      frosted: "glass-surface-strong backdrop-blur-[var(--blur-glass-lg)]",
      /** Recessed — reads as cut *into* the surface rather than laid on it. */
      inset:
        "bg-black/20 dark:bg-black/30 shadow-[inset_0_2px_8px_rgb(0_0_0/0.35)] border border-white/5",
    },
    size: {
      sm: "rounded-xl p-4",
      md: "rounded-2xl p-6",
      lg: "rounded-2xl p-8 md:p-10",
      none: "",
    },
    /**
     * Adds hover response: the specular sheen and the stretch transform.
     * Use for cards that are links or buttons — not for static content, where
     * movement on hover is just noise.
     */
    interactive: {
      true: "glass-sheen glass-stretch cursor-pointer",
      false: "",
    },
    /**
     * Directional gradient edge — light entering the material along the top-
     * left bevel. Use on hero-level surfaces that should read as thicker glass.
     */
    edgeLight: {
      true: "glass-edge-light",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    interactive: false,
    edgeLight: false,
  },
});

export interface GlassCardProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof glassCard> {}

export function GlassCard({
  className,
  variant,
  size,
  interactive,
  edgeLight,
  ...props
}: GlassCardProps) {
  const glowRef = usePointerGlow<HTMLDivElement>();

  return (
    <div
      // The hook no-ops on touch and under reduced motion, so attaching the
      // ref unconditionally costs nothing when the sheen isn't wanted.
      ref={interactive ? glowRef : undefined}
      className={cn(
        glassCard({ variant, size, interactive, edgeLight }),
        className,
      )}
      {...props}
    />
  );
}

export { glassCard };
