import { Mail, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassPanel } from "@/components/glass/glass-panel";
import { siteConfig } from "@/config/site";

/**
 * Closing call to action.
 *
 * Offers three routes deliberately: a quote form for buyers who want a record,
 * a phone number for those who want an answer now, and email for procurement
 * teams who need a paper trail. In this market the phone is used far more than
 * a web form, so it is given equal visual weight rather than being demoted to
 * small print.
 */
export function CtaBand() {
  return (
    <section className="pb-16 sm:pb-24">
      <Container>
        <GlassPanel className="overflow-hidden p-8 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">
              Tell us the load, we&rsquo;ll tell you the film
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Send us your width, micron and monthly volume and we&rsquo;ll come
              back with a specification and a price.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <GlassButton asChild variant="solid" size="lg">
                <Link href="/contact">Request a quote</Link>
              </GlassButton>

              <GlassButton asChild variant="glass" size="lg">
                <a href={`tel:${siteConfig.phones[0]}`}>
                  <Phone />
                  Call the works
                </a>
              </GlassButton>
            </div>

            <p className="text-muted-foreground mt-6 text-sm">
              <Mail className="mr-1.5 inline size-3.5" aria-hidden />
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-foreground focus-visible:ring-ring/60 rounded underline-offset-4 outline-none hover:underline focus-visible:ring-2"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </GlassPanel>
      </Container>
    </section>
  );
}
