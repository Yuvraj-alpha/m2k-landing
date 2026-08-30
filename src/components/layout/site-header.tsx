"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlassButton } from "@/components/glass/glass-button";
import { BrandMark } from "@/components/layout/brand-mark";
import { MobileNav } from "@/components/layout/mobile-nav";
import { siteConfig } from "@/config/site";
import { useScrolled } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

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
      <div
        className="
          grid h-16 w-full
          grid-cols-[1fr_auto_1fr]
          items-center
          px-4 sm:h-20 sm:px-6 lg:px-8
        "
      >
        {/* Logo — extreme left */}
        <div className="justify-self-start">
          <Link
            href="/"
            className="focus-visible:ring-ring/60 rounded-lg outline-none focus-visible:ring-2"
          >
            <BrandMark />
          </Link>
        </div>

        {/* Navigation — exact center of viewport */}
        <nav
          aria-label="Main"
          className="hidden items-center justify-center gap-1 md:flex"
        >
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

        {/* CTA — extreme right */}
        <div className="flex items-center gap-2 justify-self-end">
          <GlassButton
            asChild
            variant="solid"
            size="sm"
            className="max-sm:hidden"
          >
            <Link href="/contact">Book Demo</Link>
          </GlassButton>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
