import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { BrandMark } from "@/components/layout/brand-mark";
import { siteConfig } from "@/config/site";

/**
 * Site footer. A server component — it is entirely static content.
 *
 * The address block is marked up as a real <address> with microformat-ish
 * structure because this is a local manufacturer whose primary search intent is
 * "stretch film manufacturer Ludhiana". Phase 8 adds matching LocalBusiness
 * JSON-LD; keeping the visible markup semantic means the two agree.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="glass-surface mt-24 rounded-none border-x-0 border-b-0">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Identity */}
          <div className="lg:col-span-1">
            <BrandMark />
            <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
              {siteConfig.tagline}. Manufacturing stretch films from 100% virgin
              LLDPE in {siteConfig.address.locality}, {siteConfig.address.region}.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-xs font-semibold tracking-[0.18em] uppercase">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5">
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
          <div>
            <h2 className="text-xs font-semibold tracking-[0.18em] uppercase">
              Contact
            </h2>
            <address className="mt-4 space-y-3 text-sm not-italic">
              <div className="text-muted-foreground flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.locality}, {siteConfig.address.region}{" "}
                  {siteConfig.address.postalCode}
                </span>
              </div>

              <div className="flex gap-2.5">
                <Phone
                  className="text-muted-foreground mt-0.5 size-4 shrink-0"
                  aria-hidden
                />
                <span className="flex flex-col gap-1">
                  {siteConfig.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/60 rounded outline-none transition-colors focus-visible:ring-2"
                    >
                      {/* Displayed grouped for readability; the href stays E.164. */}
                      {formatPhone(phone)}
                    </a>
                  ))}
                </span>
              </div>

              <div className="flex gap-2.5">
                <Mail
                  className="text-muted-foreground mt-0.5 size-4 shrink-0"
                  aria-hidden
                />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/60 rounded outline-none transition-colors focus-visible:ring-2"
                >
                  {siteConfig.email}
                </a>
              </div>
            </address>
          </div>

          {/* Credentials */}
          <div>
            <h2 className="text-xs font-semibold tracking-[0.18em] uppercase">
              Credentials
            </h2>
            <ul className="text-muted-foreground mt-4 space-y-2.5 text-sm">
              {siteConfig.certifications.map((cert) => (
                <li key={cert} className="flex gap-2.5">
                  <span aria-hidden className="text-brand-amber">
                    ✓
                  </span>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-12 border-t border-white/10 pt-6 text-xs">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

/** +919878730079 → +91 98787 30079 */
function formatPhone(e164: string): string {
  const match = /^\+91(\d{5})(\d{5})$/.exec(e164);
  return match ? `+91 ${match[1]} ${match[2]}` : e164;
}
