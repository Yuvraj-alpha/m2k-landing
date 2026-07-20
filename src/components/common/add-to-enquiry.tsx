"use client";

import { Check, Plus } from "lucide-react";

import { GlassButton } from "@/components/glass/glass-button";
import { cn } from "@/lib/utils";
import { selectHasItem, useRfqStore } from "@/store/rfq-store";

/**
 * Toggles a product in and out of the RFQ list.
 *
 * Placed inside product cards whose whole surface is a link. The card's link
 * uses a stretched `::after` overlay, so this button needs `relative z-10` to
 * sit above it — without that the overlay swallows the click and the user
 * navigates instead of adding.
 */
export function AddToEnquiry({
  slug,
  name,
  className,
  size = "sm",
}: {
  slug: string;
  name: string;
  className?: string;
  size?: "sm" | "md";
}) {
  // Subscribes to a boolean, not to the items array, so toggling one card
  // doesn't re-render every other card on the page.
  const selected = useRfqStore(selectHasItem(slug));
  const toggle = useRfqStore((s) => s.toggle);
  const setOpen = useRfqStore((s) => s.setOpen);

  return (
    <GlassButton
      type="button"
      variant={selected ? "amber" : "glass"}
      size={size}
      className={cn("relative z-10", className)}
      // The label states the resulting action, and aria-pressed carries the
      // current state — so a screen reader user isn't left guessing whether
      // "Add" means it is currently absent or currently added.
      aria-pressed={selected}
      aria-label={
        selected ? `Remove ${name} from enquiry` : `Add ${name} to enquiry`
      }
      onClick={() => {
        toggle({ slug, name });
        // Opening the drawer on add gives immediate confirmation that the
        // click landed. Removing shouldn't yank the drawer open.
        if (!selected) setOpen(true);
      }}
    >
      {selected ? <Check /> : <Plus />}
      {selected ? "Added" : "Add to enquiry"}
    </GlassButton>
  );
}
