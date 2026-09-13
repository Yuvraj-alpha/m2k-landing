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
      data-scrolled={scrolled ? "true" : "false"}
      className={cn("site-header", scrolled && "glass-header")}
    >
      <div
        className="
          site-header__content
          grid h-20 w-full
          grid-cols-[1fr_auto]
          items-center
          px-4
          sm:h-28 3xl:h-32 sm:px-6
          md:grid-cols-[1fr_auto_1fr]
          lg:px-8
        "
      >
        <div className="justify-self-start">
          <Link
            href="/"
            className="focus-visible:ring-ring/60 rounded-lg outline-none focus-visible:ring-2"
          >
            <BrandMark className="h-16 sm:h-20 lg:h-24 xl:h-28 3xl:h-32 mt-2" />
          </Link>
        </div>

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
                  "relative rounded-lg px-4 py-2 text-lg font-medium transition-colors",
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
                    className="bg-brand-lit absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <GlassButton
            asChild
            variant="solid"
            size="md"
            className="max-sm:hidden text-base"
          >
            <Link href="/contact">Request a Quote</Link>
          </GlassButton>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
