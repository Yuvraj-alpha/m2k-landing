"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Accessibility preference queries.
 *
 * These gate the *JavaScript* side of the glass system (pointer tracking,
 * autoplaying video). The CSS side is handled independently in glass.css, so
 * the site degrades correctly even before hydration.
 */

/** User has asked for reduced motion. Disables sheen tracking and video. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** User has asked for reduced transparency. Glass collapses to solid panels. */
export function useReducedTransparency(): boolean {
  return useMediaQuery("(prefers-reduced-transparency: reduce)");
}

/**
 * True only for genuine mouse/trackpad pointers. Touch devices report hover
 * via emulation, which would leave the specular highlight stuck where the
 * finger last lifted.
 */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
