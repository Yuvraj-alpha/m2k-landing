"use client";

import { Menu, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { GlassButton } from "@/components/glass/glass-button";
import { BrandMark } from "@/components/layout/brand-mark";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Slide-over navigation for small screens.
 *
 * State is local rather than in the Zustand store: it has exactly one consumer
 * and no cross-component coordination, so a store would be indirection without
 * benefit. The store earns its place in phase 7, where the RFQ drawer is driven
 * from product cards on unrelated routes.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Radix keeps the sheet mounted across a client-side navigation, so it has
  // to be closed explicitly or it sits on top of the page just navigated to.
  //
  // Done on the links themselves rather than in an effect keyed on `pathname`.
  // The effect version is the common idiom but it sets state during an effect,
  // which schedules a second render pass on every navigation — React's
  // `set-state-in-effect` rule flags it, correctly. Closing in the event
  // handler is both cheaper and more direct: the click *is* the reason to close.

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <GlassButton
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu />
        </GlassButton>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="glass-surface-strong w-[min(20rem,85vw)] border-l backdrop-blur-2xl"
      >
        <SheetHeader className="border-border/60 border-b">
          {/* Radix requires a title for the dialog's accessible name. */}
          <SheetTitle className="text-left">
            <BrandMark />
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Main" className="flex flex-col gap-1 p-4">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  // 48px rows — comfortably above the 44px touch minimum.
                  "flex h-12 items-center rounded-lg px-3 text-base font-medium transition-colors",
                  "focus-visible:ring-ring/60 outline-none focus-visible:ring-2",
                  active
                    ? "bg-brand/15 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 p-4">
          <GlassButton asChild variant="solid" size="md" className="w-full">
            <a href={`tel:${siteConfig.phones[0]}`}>
              <Phone />
              Call the works
            </a>
          </GlassButton>
          <p className="text-muted-foreground mt-3 text-center text-xs">
            {siteConfig.address.locality}, {siteConfig.address.region}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
