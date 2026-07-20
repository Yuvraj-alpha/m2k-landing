import { z } from "zod";

import { productSlugs } from "@/config/products";

/**
 * Validation for the enquiry form.
 *
 * Shared by the client (react-hook-form, for instant feedback) and the server
 * action. The server MUST re-validate with this rather than trusting the
 * client: Next.js server functions are reachable by direct POST, so the form UI
 * is not a security boundary.
 */

/**
 * Indian mobile numbers, with or without +91 / 0 prefix and common separators.
 * Deliberately permissive — a buyer mistyping a space should not be blocked
 * from making an enquiry. The value is normalised, not rejected.
 */
const PHONE_PATTERN = /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/;

export const enquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "That name is too long."),

  company: z
    .string()
    .trim()
    .max(120, "That company name is too long.")
    // Optional: plenty of genuine enquiries come from individuals.
    .default(""),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email address.")
    .email("That doesn't look like a valid email address."),

  phone: z
    .string()
    .trim()
    .min(1, "Please enter a phone number.")
    .transform((value) => value.replace(/[\s-()]/g, ""))
    .refine((value) => PHONE_PATTERN.test(value), {
      message: "Please enter a valid 10-digit Indian mobile number.",
    }),

  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more — at least 10 characters.")
    .max(2000, "Please keep the message under 2000 characters."),

  /** Slugs from the RFQ drawer. Unknown slugs are rejected, not ignored. */
  products: z
    .array(z.enum(productSlugs as unknown as [string, ...string[]]))
    .max(20, "Too many products selected.")
    .default([]),

  /**
   * Honeypot. Hidden from users via CSS, so a non-empty value means a bot
   * filled every field it could find. Named `website` because that is what
   * naive form-filling bots look for.
   */
  website: z.string().max(0, "Rejected.").optional(),
});

/**
 * Two types, because `.default()` makes input and output differ: `company` and
 * `products` are optional going in and guaranteed coming out.
 *
 * react-hook-form must be parameterised with both — `useForm<Input, ctx,
 * Output>` — or the resolver won't typecheck against the field values.
 */
export type EnquiryFormInput = z.input<typeof enquiryFormSchema>;
export type EnquiryFormValues = z.output<typeof enquiryFormSchema>;
