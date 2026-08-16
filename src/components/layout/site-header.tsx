"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlassButton } from "@/components/glass/glass-button";
import { Container } from "@/components/common/container";
import { BrandMark } from "@/components/layout/brand-mark";
import { MobileNav } from "@/components/layout/mobile-nav";
import { siteConfig } from "@/config/site";
import { useScrolled } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

/**
 * Sticky site header.
 *
 * Two states. At the top of the page it is fully transparent, so the hero runs
 * edge to edge behind it. Once scrolled it becomes a glass bar, which is both
 * an affordance (the page has moved) and a legibility fix (nav labels would
 * otherwise sit on arbitrary page content).
 *
 * The blur is only applied in the scrolled state — an always-on
 * `backdrop-filter` across a full-width sticky element is one of the most
 * expensive things you can put on a page, and at scroll position 0 it is
 * blurring a backdrop nobody can see.
 */
export function SiteHeader() {
  const scrolled = useScrolled(12);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass-surface rounded-none border-x-0 border-t-0 shadow-lg"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link
          href="/"
          className="focus-visible:ring-ring/60 rounded-lg outline-none focus-visible:ring-2"
        >
          <BrandMark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 font-medium transition-colors",
                  "focus-visible:ring-ring/60 outline-none focus-visible:ring-2",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {/* Active indicator is a shape, not just a colour change, so
                    it survives greyscale and colour-blind viewing. */}
                {active && (
                  <span
                    aria-hidden
                    className="bg-brand-lit absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <GlassButton
            asChild
            variant="solid"
            size="sm"
            className="max-sm:hidden"
          >
            <Link href="/contact">Request a quote</Link>
          </GlassButton>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
