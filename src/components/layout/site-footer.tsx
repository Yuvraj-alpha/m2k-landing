import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { BrandMark } from "@/components/layout/brand-mark";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="glass-surface mt-24 rounded-none border-x-0 border-b-0">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12 xl:gap-x-10">
          {/* Brand / identity */}
          <div className="sm:col-span-2 lg:col-span-5 xl:col-span-5">
            <div className="w-fit max-w-full">
              <BrandMark />
            </div>

            <p className="text-muted-foreground mt-5 max-w-md text-sm leading-6">
              {siteConfig.tagline}. Manufacturing stretch films from 100% virgin
              LLDPE in {siteConfig.address.locality},{" "}
              {siteConfig.address.region}.
            </p>
          </div>

          {/* Company */}
          <div className="lg:col-span-2 xl:col-span-2">
            <FooterHeading>Company</FooterHeading>

            <ul className="mt-5 space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/60 rounded text-sm outline-none transition-colors focus-visible:ring-2"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 xl:col-span-3">
            <FooterHeading>Contact</FooterHeading>

            <address className="mt-5 space-y-4 text-sm not-italic">
              <div className="text-muted-foreground flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />

                <span className="leading-6">
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.locality}, {siteConfig.address.region}{" "}
                  {siteConfig.address.postalCode}
                </span>
              </div>

              <div className="text-muted-foreground flex items-start gap-3">
                <Phone
                  className="mt-0.5 size-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />

                <div className="flex flex-col gap-1.5">
                  {siteConfig.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      className="hover:text-foreground focus-visible:ring-ring/60 w-fit rounded outline-none transition-colors focus-visible:ring-2"
                    >
                      {formatPhone(phone)}
                    </a>
                  ))}
                </div>
              </div>

              <div className="text-muted-foreground flex items-start gap-3">
                <Mail
                  className="mt-0.5 size-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden
                />

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-foreground focus-visible:ring-ring/60 break-all rounded outline-none transition-colors focus-visible:ring-2"
                >
                  {siteConfig.email}
                </a>
              </div>
            </address>
          </div>

          {/* Credentials */}
          <div className="lg:col-span-2 xl:col-span-2">
            <FooterHeading>Credentials</FooterHeading>

            <ul className="text-muted-foreground mt-5 space-y-3 text-sm">
              {siteConfig.certifications.map((cert) => (
                <li key={cert} className="flex items-start gap-2.5 leading-5">
                  <span aria-hidden className="text-brand-amber mt-px shrink-0">
                    ✓
                  </span>

                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="text-muted-foreground mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <p className="text-muted-foreground/70">
            Stretch Film Manufacturer · Ludhiana, Punjab
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-foreground/90 text-xs font-semibold tracking-[0.18em] uppercase">
      {children}
    </h2>
  );
}

/** +919878730079 → +91 98787 30079 */
function formatPhone(e164: string): string {
  const match = /^\+91(\d{5})(\d{5})$/.exec(e164);
  return match ? `+91 ${match[1]} ${match[2]}` : e164;
}
