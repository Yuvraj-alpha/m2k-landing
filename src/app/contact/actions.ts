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
 * SECURITY NOTE: a Next.js Server Action can be called directly, so all
 * validation and anti-abuse checks are performed again on the server.
 */
export async function submitEnquiry(raw: unknown): Promise<EnquiryResult> {
  // 1. Validate the incoming payload.
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

  // 2. Honeypot.
  // Bots commonly fill every input they encounter. Return a fake success so
  // they aren't told that the honeypot detected them.
  if (data.website) {
    console.warn("[enquiry] Honeypot triggered", {
      website: data.website,
    });

    return { ok: true };
  }

  // 3. Rate-limit by client IP.
  const headerList = await headers();

  const forwardedFor = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");

  const ip = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "unknown";

  const { allowed, retryAfterMs } = checkRateLimit(ip);

  if (!allowed) {
    const minutes = Math.max(1, Math.ceil(retryAfterMs / 60_000));

    return {
      ok: false,
      message: `You've sent several enquiries already. Please try again in about ${minutes} minute${
        minutes === 1 ? "" : "s"
      }, or call us on ${formatPhone(siteConfig.phones[0]!)}.`,
    };
  }

  // 4. Resolve product slugs against the real catalogue.
  // Never echo arbitrary product values supplied by the client.
  const selected = data.products
    .map((slug) => getProduct(slug)?.name)
    .filter((name): name is string => Boolean(name));

  // 5. Initialise Resend.
  const resend = getResend();

  if (!resend) {
    console.error(
      "[enquiry] RESEND_API_KEY is not configured — enquiry was not delivered.",
      {
        name: data.name,
        email: data.email,
        products: selected,
      },
    );

    return {
      ok: false,
      message: `We couldn't send that just now. Please email ${
        siteConfig.email
      } or call ${formatPhone(
        siteConfig.phones[0]!,
      )} and we'll pick it up straight away.`,
    };
  }

  // 6. Send enquiry.
  try {
    console.info("[enquiry] Sending enquiry via Resend", {
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: data.email,
    });

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO,

      // Replying to the received email will reply directly to the customer.
      replyTo: data.email,

      subject: `Enquiry from ${data.name}${
        data.company ? ` (${data.company})` : ""
      }`,

      text: buildEmailBody(data, selected),
    });

    console.info("[enquiry] Resend response", {
      emailId: result.data?.id ?? null,
      error: result.error ?? null,
    });

    if (result.error) {
      console.error("[enquiry] Resend rejected the message", result.error);

      return {
        ok: false,
        message: `We couldn't send that just now. Please email ${siteConfig.email} and we'll pick it up straight away.`,
      };
    }

    if (!result.data?.id) {
      console.error(
        "[enquiry] Resend returned neither an error nor an email ID.",
      );

      return {
        ok: false,
        message: `We couldn't send that just now. Please email ${siteConfig.email} and we'll pick it up straight away.`,
      };
    }

    console.info("[enquiry] Enquiry accepted by Resend", {
      emailId: result.data.id,
    });

    return { ok: true };
  } catch (cause) {
    console.error("[enquiry] Unexpected failure sending enquiry", cause);

    return {
      ok: false,
      message: `Something went wrong at our end. Please email ${
        siteConfig.email
      } or call ${formatPhone(siteConfig.phones[0]!)}.`,
    };
  }
}

/**
 * Plain-text email body so the enquiry works reliably across mail clients.
 */
function buildEmailBody(
  data: {
    name: string;
    company: string;
    email: string;
    phone: string;
    message: string;
  },
  products: string[],
): string {
  return [
    `Name:     ${data.name}`,

    data.company ? `Company:  ${data.company}` : null,

    `Email:    ${data.email}`,
    `Phone:    ${data.phone}`,

    products.length
      ? [
          "",
          "Products of interest:",
          ...products.map((product) => `  - ${product}`),
        ].join("\n")
      : null,

    ["", "Message:", data.message].join("\n"),

    ["", "—", `Sent from the enquiry form at ${siteConfig.url}`].join("\n"),
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

/**
 * +919878730079 → +91 98787 30079
 */
function formatPhone(e164: string): string {
  const match = /^\+91(\d{5})(\d{5})$/.exec(e164);

  return match ? `+91 ${match[1]} ${match[2]}` : e164;
}
