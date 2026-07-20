import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { GlassCard } from "@/components/glass/glass-card";
import { siteConfig } from "@/config/site";

/** +919878730079 → +91 98787 30079 */
function formatPhone(e164: string): string {
  const match = /^\+91(\d{5})(\d{5})$/.exec(e164);
  return match ? `+91 ${match[1]} ${match[2]}` : e164;
}

/**
 * Direct contact routes, shown alongside the form.
 *
 * The form is not the only way in, and for this market it probably isn't the
 * main one — phone and WhatsApp carry most B2B enquiries in Indian
 * manufacturing. They get equal billing rather than being tucked underneath.
 */
export function ContactDetails() {
  const whatsappMessage = encodeURIComponent(
    `Hello ${siteConfig.shortName}, I'd like to enquire about your stretch films.`,
  );

  return (
    <div className="space-y-5">
      <GlassCard size="lg">
        <h2 className="text-lg font-extrabold">Talk to us directly</h2>

        <ul className="mt-5 space-y-4 text-sm">
          <li className="flex gap-3">
            <Phone className="text-brand-lit mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p className="text-muted-foreground text-xs">Phone</p>
              {siteConfig.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className="hover:text-brand-lit focus-visible:ring-ring/60 block rounded font-medium outline-none focus-visible:ring-2"
                >
                  {formatPhone(phone)}
                </a>
              ))}
            </div>
          </li>

          <li className="flex gap-3">
            <MessageCircle
              className="text-brand-lit mt-0.5 size-4 shrink-0"
              aria-hidden
            />
            <div>
              <p className="text-muted-foreground text-xs">WhatsApp</p>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-lit focus-visible:ring-ring/60 rounded font-medium outline-none focus-visible:ring-2"
              >
                Message us (opens in a new tab)
              </a>
            </div>
          </li>

          <li className="flex gap-3">
            <Mail className="text-brand-lit mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p className="text-muted-foreground text-xs">Email</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-brand-lit focus-visible:ring-ring/60 rounded font-medium outline-none focus-visible:ring-2"
              >
                {siteConfig.email}
              </a>
            </div>
          </li>
        </ul>
      </GlassCard>

      <GlassCard size="lg">
        <h2 className="text-lg font-extrabold">The works</h2>
        <address className="mt-5 space-y-4 text-sm not-italic">
          <div className="flex gap-3">
            <MapPin
              className="text-brand-lit mt-0.5 size-4 shrink-0"
              aria-hidden
            />
            <span>
              {siteConfig.address.street}
              <br />
              {siteConfig.address.locality}, {siteConfig.address.region}{" "}
              {siteConfig.address.postalCode}
              <br />
              {siteConfig.address.country}
            </span>
          </div>

          <div className="text-muted-foreground flex gap-3">
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
            {/* TODO: confirm actual working hours with M2K before launch.
                Deliberately vague rather than inventing "Mon–Sat 9–6". */}
            <span>Please call ahead to arrange a visit.</span>
          </div>
        </address>
      </GlassCard>
    </div>
  );
}
