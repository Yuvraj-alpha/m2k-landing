"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold` pixels.
 *
 * Separate from useScrollProgress because the header only needs a boolean —
 * subscribing it to a continuously-changing float would re-render the header
 * on every frame of every scroll.
 */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      // setState with an unchanged boolean bails out, so this stays cheap.
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      frame ??= requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}

/**
 * Document scroll progress, 0 → 1.
 *
 * Drives the header's scrolled state and the reading-progress rule. rAF-batched
 * for the same reason as use-pointer-glow: scroll events fire far faster than
 * the compositor can paint.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      // Short pages aren't scrollable; report 0 rather than dividing by zero.
      setProgress(scrollable <= 0 ? 0 : window.scrollY / scrollable);
    };

    const handleScroll = () => {
      frame ??= requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}
