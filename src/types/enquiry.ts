/**
 * A product added to the request-for-quote list.
 *
 * `slug` is a plain string rather than the `ProductSlug` union on purpose. The
 * union only survives on the `products` const array — reading through the
 * `Product` interface (as every list rendering does) widens it back to string,
 * so threading the union through here would mean casts at every call site for
 * safety that isn't real.
 *
 * The genuine boundary is the server: `enquiryFormSchema` validates submitted
 * slugs against the actual catalogue with a Zod enum, and the action drops
 * anything that doesn't resolve. Persisted client state is untrusted input
 * regardless of how it is typed — a user can edit localStorage.
 */
export interface RfqItem {
  slug: string;
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
