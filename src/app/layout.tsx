import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";

import { WhatsAppFab } from "@/components/common/whatsapp-fab";
import { LiquidBackdrop } from "@/components/glass/liquid-backdrop";
import { RfqDrawer } from "@/components/layout/rfq-drawer";
import { RfqHydration } from "@/components/layout/rfq-hydration";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";

/* Display face. The `wdth` axis is loaded so headings can be set in the
   expanded cut that echoes the M2K logo lockup (see globals.css). */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // Dark is the site's primary art direction; a toggle can swap this later.
      className={`dark ${archivo.variable} ${inter.variable} h-full antialiased`}
      // Next 16 stopped force-overriding scroll behaviour on navigation. This
      // attribute is what restores scroll-to-top between routes while keeping
      // `scroll-behavior: smooth` for in-page anchor links.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* Decorative, rendered once for the whole document: this is the light
            source every glass surface refracts. Fixed to the viewport, so it
            lights content continuously as the page scrolls. */}
        <LiquidBackdrop />

        {/* First focusable element on the page. The header has several links
            before the content starts, so keyboard users need a way past them. */}
        <a
          href="#main"
          className="focus:glass-surface-strong sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:not-sr-only focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <SiteHeader />

        {/* The single <main> landmark for the whole site — pages render their
            sections directly rather than nesting another <main>, which would
            be invalid and would give screen readers two "main" regions.
            flex-1 pins the footer to the bottom on short pages. */}
        <main id="main" className="flex-1">
          {children}
        </main>

        <SiteFooter />

        {/* RfqHydration restores the persisted enquiry list after mount; the
            store deliberately starts empty so SSR and first client render
            agree. RfqDrawer renders nothing until something is selected. */}
        <RfqHydration />
        <RfqDrawer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
