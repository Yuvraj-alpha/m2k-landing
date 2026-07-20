"use client";

import { ClipboardList, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GlassButton } from "@/components/glass/glass-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRfqStore } from "@/store/rfq-store";

/**
 * The RFQ list: a floating counter plus a slide-over of selected products.
 *
 * The counter only appears once something is selected, so it costs nothing
 * visually until it is relevant. It sits above the WhatsApp button rather than
 * competing with it for the bottom-right corner.
 */
export function RfqDrawer() {
  const items = useRfqStore((s) => s.items);
  const isOpen = useRfqStore((s) => s.isOpen);
  const setOpen = useRfqStore((s) => s.setOpen);
  const remove = useRfqStore((s) => s.remove);
  const clear = useRfqStore((s) => s.clear);
  const router = useRouter();

  // Nothing selected: render nothing at all. Before hydration `items` is empty,
  // so server and first client render agree — see RfqHydration.
  if (items.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass-surface-strong focus-visible:ring-ring/70 fixed right-5 bottom-24 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium shadow-lg outline-none focus-visible:ring-2"
      >
        <ClipboardList className="size-4" aria-hidden />
        <span>Enquiry</span>
        <span className="bg-brand flex size-5 items-center justify-center rounded-full text-xs font-semibold text-white">
          {items.length}
        </span>
      </button>

      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="glass-surface-strong flex w-[min(24rem,90vw)] flex-col border-l backdrop-blur-2xl"
        >
          <SheetHeader className="border-border/60 border-b">
            <SheetTitle>Your enquiry</SheetTitle>
          </SheetHeader>

          <ul className="flex-1 space-y-2 overflow-y-auto p-4">
            {items.map((item) => (
              <li
                key={item.slug}
                className="glass-surface flex items-center justify-between gap-3 rounded-lg p-3"
              >
                <span className="text-sm font-medium">{item.name}</span>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  aria-label={`Remove ${item.name} from enquiry`}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/60 rounded p-1 outline-none focus-visible:ring-2"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          <div className="space-y-3 border-t border-white/10 p-4">
            <GlassButton
              variant="solid"
              size="md"
              className="w-full"
              onClick={() => {
                setOpen(false);
                router.push("/contact");
              }}
            >
              Continue to enquiry
            </GlassButton>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={clear}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/60 rounded underline-offset-4 outline-none hover:underline focus-visible:ring-2"
              >
                Clear all
              </button>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/60 rounded underline-offset-4 outline-none hover:underline focus-visible:ring-2"
              >
                Add more products
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
