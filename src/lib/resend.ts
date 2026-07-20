import "server-only";

import { Resend } from "resend";

/**
 * Lazily-constructed Resend client.
 *
 * Deliberately not instantiated at module scope: `next build` imports this file
 * while prerendering, and a missing RESEND_API_KEY would then fail the build
 * rather than failing one form submission. A marketing site must stay
 * deployable before the email provider is configured.
 *
 * Returns null when unconfigured; the caller decides what to tell the user.
 */
let client: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client ??= new Resend(key);
  return client;
}

/** Verified sending identity. Must be on a domain verified in Resend. */
export const MAIL_FROM =
  process.env.ENQUIRY_FROM ?? "M2K Website <enquiries@m2kpackpro.in>";

/** Where enquiries land. */
export const MAIL_TO = process.env.ENQUIRY_TO ?? "admin@m2kpackpro.in";
