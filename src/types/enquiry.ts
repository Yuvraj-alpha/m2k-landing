import type { ProductSlug } from "@/config/products";

/** A product added to the request-for-quote list. */
export interface RfqItem {
  slug: ProductSlug;
  name: string;
  /** Optional buyer notes — required micron, width, monthly volume. */
  note?: string;
}

/** Shape of the contact/enquiry form after validation. */
export interface EnquiryInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  /** Slugs carried over from the RFQ drawer, if any. */
  products: readonly string[];
}

/**
 * Result of the enquiry server action.
 *
 * A discriminated union rather than `{ ok, error? }` so the client cannot read
 * `fieldErrors` off a success, and cannot forget to handle the failure case.
 */
export type EnquiryResult =
  | { ok: true }
  | {
      ok: false;
      /** Message safe to show the user. Never leaks provider internals. */
      message: string;
      /** Per-field messages keyed by form field name. */
      fieldErrors?: Partial<Record<keyof EnquiryInput, string[]>>;
    };
