"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { RfqItem } from "@/types/enquiry";

/**
 * The request-for-quote list.
 *
 * This is the one piece of genuinely cross-cutting client state in the site,
 * and the reason a store exists at all: a buyer ticks films on /products and on
 * individual product pages, then lands on /contact expecting the selection to
 * still be there. Local state can't span unrelated routes; lifting it to a
 * layout would put it above every server component on the page.
 *
 * B2B buyers rarely enquire about a single SKU — "machine grade at 23 micron
 * and silage at 25" is the normal shape of an enquiry — so the whole point is
 * to let them build that list before writing a message.
 *
 * HYDRATION: `skipHydration` is deliberate. Persisted state lives in
 * localStorage, which the server cannot see, so an automatic rehydrate would
 * make the first client render disagree with the server HTML. Instead
 * <RfqHydration /> triggers rehydration after mount — see that component.
 */
interface RfqState {
  items: RfqItem[];
  /** Drawer visibility. Not persisted — reopening on next visit is hostile. */
  isOpen: boolean;

  add: (item: RfqItem) => void;
  remove: (slug: string) => void;
  toggle: (item: RfqItem) => void;
  setNote: (slug: string, note: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

export const useRfqStore = create<RfqState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      add: (item) =>
        set((state) =>
          // Adding twice is a no-op rather than a duplicate row.
          state.items.some((i) => i.slug === item.slug)
            ? state
            : { items: [...state.items, item] },
        ),

      remove: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),

      toggle: (item) =>
        set((state) =>
          state.items.some((i) => i.slug === item.slug)
            ? { items: state.items.filter((i) => i.slug !== item.slug) }
            : { items: [...state.items, item] },
        ),

      setNote: (slug, note) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug ? { ...i, note } : i,
          ),
        })),

      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "m2k-rfq",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      // Only the list survives a reload. `isOpen` is session UI.
      partialize: (state) => ({ items: state.items }) as RfqState,
      version: 1,
    },
  ),
);

/**
 * Selector for "is this product already in the list".
 *
 * Exported as a factory so components subscribe to a boolean rather than to the
 * whole `items` array — otherwise every card on /products re-renders whenever
 * any one of them is toggled.
 */
export const selectHasItem = (slug: string) => (state: RfqState) =>
  state.items.some((i) => i.slug === slug);
