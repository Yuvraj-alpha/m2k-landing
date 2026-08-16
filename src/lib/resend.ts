import "server-only";

import { Resend } from "resend";

let client: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.error("[resend] RESEND_API_KEY is missing");

    return null;
  }

  client ??= new Resend(key);

  return client;
}

export const MAIL_FROM =
  process.env.ENQUIRY_FROM ?? "M2K Website <admin@m2kpackpro.in>";

export const MAIL_TO = process.env.ENQUIRY_TO ?? "admin@m2kpackpro.in";
