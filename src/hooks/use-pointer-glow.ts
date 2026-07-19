"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks the pointer across an element and publishes its position as the
 * `--mx` / `--my` custom properties that `.glass-sheen` reads.
 *
 * Performance notes, because this runs on every card on the page:
 *   • Writes are batched into one rAF callback, so a burst of pointermove
 *     events produces at most one style write per frame.
 *   • Only two custom properties change. They feed a `background` gradient on
 *     a pseudo-element, so the browser repaints that layer without touching
 *     layout — no reflow, and the blurred backdrop underneath is untouched.
 *   • The listener is `passive`; we never call preventDefault.
 *
 * Returns a ref to attach to the element being tracked. The effect is a no-op
 * on touch devices and under prefers-reduced-motion, so no listener is bound
 * at all in those cases.
 */
export function usePointerGlow<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Read the preferences directly rather than via hooks: this must be a
    // one-shot decision about whether to bind a listener, not reactive state.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let frame: number | null = null;
    let next: { x: number; y: number } | null = null;

    const flush = () => {
      frame = null;
      if (!next) return;
      el.style.setProperty("--mx", `${next.x}%`);
      el.style.setProperty("--my", `${next.y}%`);
    };

    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      next = {
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      };
      frame ??= requestAnimationFrame(flush);
    };

    // Recentre on exit so the highlight doesn't stay frozen mid-card while the
    // opacity fades out.
    const handleLeave = () => {
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };

    el.addEventListener("pointermove", handleMove, { passive: true });
    el.addEventListener("pointerleave", handleLeave, { passive: true });

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
