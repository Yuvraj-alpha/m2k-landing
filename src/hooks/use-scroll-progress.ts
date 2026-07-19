"use client";

import { useEffect, useState } from "react";

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
