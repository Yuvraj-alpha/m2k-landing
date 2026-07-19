"use client";

import { useEffect, useState } from "react";

/**
 * False during SSR and the first client render, true afterwards.
 *
 * Use only for genuinely client-only UI (portals, anything reading
 * `window` during render). Prefer CSS for anything that could otherwise
 * cause a visible pop-in after hydration.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
