import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";

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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
