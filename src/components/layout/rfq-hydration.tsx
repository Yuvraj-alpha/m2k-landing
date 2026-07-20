"use client";

import { useEffect } from "react";

import { useRfqStore } from "@/store/rfq-store";

/**
 * Rehydrates the persisted RFQ list after mount.
 *
 * The store is created with `skipHydration: true`, so it starts empty on both
 * server and client. That makes the first client render match the server HTML
 * exactly; this component then pulls the saved list out of localStorage.
 *
 * Calling `rehydrate()` inside an effect is the correct use of one — it
 * synchronises React with an external system (localStorage). That is exactly
 * the case React's `set-state-in-effect` rule carves out, as opposed to
 * calling a setState during render to derive state.
 *
 * Renders nothing.
 */
export function RfqHydration() {
  useEffect(() => {
    void useRfqStore.persist.rehydrate();
  }, []);

  return null;
}
