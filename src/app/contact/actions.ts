"use server";

import { headers } from "next/headers";

import { getProduct } from "@/config/products";
import { siteConfig } from "@/config/site";
import { checkRateLimit } from "@/lib/rate-limit";
import { MAIL_FROM, MAIL_TO, getResend } from "@/lib/resend";
import { enquiryFormSchema } from "@/lib/schemas";
import type { EnquiryResult } from "@/types/enquiry";

/**
 * Handles an enquiry submission.
 *
 * SECURITY NOTE: a Next.js server function is reachable by direct POST — the
 * form UI is not a boundary. Everything below therefore re-validates on the
 * server regardless of what the client already checked:
 *   • the payload is re-parsed with the same Zod schema
 *   • product slugs are re-checked against the real catalogue
 *   • the honeypot is enforced here, not just hidden with CSS
 *   • the request is rate-limited by IP
 */
export async function submitEnquiry(
  raw: unknown,
): Promise<EnquiryResult> {
  // 1. Validate. Never trust the client's copy of the schema.
  const parsed = enquiryFormSchema.safeParse(raw);

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // 2. Honeypot. A bot that fills every field it finds trips this. Answer as
  // though it succeeded — telling a bot why it failed only helps it adapt.
  if (data.website) {
    return { ok: true };
  }

  // 3. Rate limit by client IP. `x-forwarded-for` is set by the platform proxy;
  // its first entry is the client. Falls back to a shared bucket when absent,
  // which is strict rather than permissive.
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  const { allowed, retryAfterMs } = checkRateLimit(ip);
  if (!allowed) {
    const minutes = Math.max(1, Math.ceil(retryAfterMs / 60_000));
    return {
      ok: false,
      message: `You've sent several enquiries already. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}, or call us on ${formatPhone(siteConfig.phones[0]!)}.`,
    };
  }

  // 4. Resolve slugs to real product names for the email body. Anything not in
  // the catalogue is dropped rather than echoed into the message.
  const selected = data.products
    .map((slug) => getProduct(slug)?.name)
    .filter((name): name is string => Boolean(name));

  // 5. Send.
  const resend = getResend();

  if (!resend) {
    // Unconfigured rather than broken. Log for the operator and give the user
    // a route that actually works instead of a dead end.
    console.error(
      "[enquiry] RESEND_API_KEY is not set — enquiry was not delivered.",
      { name: data.name, email: data.email, products: selected },
    );
    return {
      ok: false,
      message: `We couldn't send that just now. Please email ${siteConfig.email} or call ${formatPhone(siteConfig.phones[0]!)} and we'll pick it up straight away.`,
    };
  }

  try {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO,
      // So a reply in the inbox goes to the buyer, not to the site.
      replyTo: data.email,
      subject: `Enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
      text: buildEmailBody(data, selected),
    });

    if (error) {
      console.error("[enquiry] Resend rejected the message", error);
      return {
        ok: false,
        message: `We couldn't send that just now. Please email ${siteConfig.email} and we'll pick it up straight away.`,
      };
    }

    return { ok: true };
  } catch (cause) {
    console.error("[enquiry] Unexpected failure sending enquiry", cause);
    return {
      ok: false,
      message: `Something went wrong at our end. Please email ${siteConfig.email} or call ${formatPhone(siteConfig.phones[0]!)}.`,
    };
  }
}

/** Plain text, so the enquiry is readable in any mail client. */
function buildEmailBody(
  data: { name: string; company: string; email: string; phone: string; message: string },
  products: string[],
): string {
  return [
    `Name:     ${data.name}`,
    data.company ? `Company:  ${data.company}` : null,
    `Email:    ${data.email}`,
    `Phone:    ${data.phone}`,
    products.length ? `\nProducts of interest:\n${products.map((p) => `  - ${p}`).join("\n")}` : null,
    `\nMessage:\n${data.message}`,
    `\n—\nSent from the enquiry form at ${siteConfig.url}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** +919878730079 → +91 98787 30079 */
function formatPhone(e164: string): string {
  const match = /^\+91(\d{5})(\d{5})$/.exec(e164);
  return match ? `+91 ${match[1]} ${match[2]}` : e164;
}
