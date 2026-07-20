import type { Metadata } from "next";

import { ContactDetails } from "@/app/contact/components/contact-details";
import { EnquiryForm } from "@/app/contact/components/enquiry-form";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact & Enquiries",
  description: `Request a stretch film quote from M2K Packpro Industries, ${siteConfig.address.locality}. Call ${siteConfig.phones[0]}, WhatsApp, or send an enquiry.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Tell us the load"
            lede="Send your width, micron and monthly volume and we'll come back with a specification and a price — usually within one working day."
          />
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <EnquiryForm />
            <ContactDetails />
          </div>
        </Container>
      </section>
    </>
  );
}
