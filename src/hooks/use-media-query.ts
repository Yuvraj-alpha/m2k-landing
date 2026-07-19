"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * Uses `useSyncExternalStore` rather than `useState` + `useEffect` so the value
 * is read during render on the client instead of after a paint — that avoids a
 * frame where an animation runs before we've noticed the user opted out of it.
 *
 * The server snapshot is always `false`. Callers must therefore treat `false`
 * as "unknown, assume the default", which is why every accessibility fallback
 * in glass.css is also expressed in plain CSS. JS here is belt-and-braces.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
