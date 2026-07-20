"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { submitEnquiry } from "@/app/contact/actions";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  enquiryFormSchema,
  type EnquiryFormInput,
  type EnquiryFormValues,
} from "@/lib/schemas";
import { useRfqStore } from "@/store/rfq-store";

/**
 * The enquiry form.
 *
 * Validation runs twice by design: react-hook-form + Zod on the client for
 * immediate feedback, and the same schema again inside the server action
 * because a server function is reachable by direct POST.
 *
 * Products selected in the RFQ drawer are read from the store and submitted
 * with the message, so a buyer who ticked three films doesn't have to describe
 * them again in prose.
 */
/**
 * Field styling for controls sitting on glass.
 *
 * shadcn's default input border is `oklch(1 0 0 / 15%)`, tuned for a solid
 * card. On a translucent surface it measured ~1:1 against the card behind it —
 * the fields were effectively invisible, failing WCAG 1.4.11 (non-text
 * contrast, 3:1) and, more practically, leaving people unable to see where to
 * type.
 *
 * Note `dark:bg-black/30`, not `bg-black/30`. shadcn's input already sets
 * `dark:bg-input/30`, and an unprefixed utility loses to a `dark:`-prefixed one
 * in the cascade — the first attempt at this fix silently did nothing, which
 * only showed up by reading the computed style rather than the class list.
 */
const FIELD_ON_GLASS =
  "border-white/65 dark:bg-black/45 placeholder:text-muted-foreground/70";

/**
 * Inputs also get an explicit height. shadcn's default is `h-8` (32px), which
 * suits dense application UI but is under the 44px WCAG 2.2 target minimum —
 * wrong for a public enquiry form filled in on a phone.
 */
const INPUT_ON_GLASS = `${FIELD_ON_GLASS} h-11`;

export function EnquiryForm() {
  const items = useRfqStore((s) => s.items);
  const removeItem = useRfqStore((s) => s.remove);
  const clearItems = useRfqStore((s) => s.clear);

  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    | { status: "idle" }
    | { status: "sent" }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    // Input / context / Output. See the note on EnquiryFormInput in schemas.ts.
  } = useForm<EnquiryFormInput, unknown, EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      products: [],
      website: "",
    },
  });

  const onSubmit = (values: EnquiryFormValues) => {
    startTransition(async () => {
      const response = await submitEnquiry({
        ...values,
        // Read at submit time rather than from form state, so the drawer stays
        // the single source of truth for the selection.
        products: items.map((i) => i.slug),
      });

      if (response.ok) {
        setResult({ status: "sent" });
        reset();
        clearItems();
        return;
      }

      // Surface server-side field errors on the matching inputs.
      if (response.fieldErrors) {
        for (const [field, messages] of Object.entries(response.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof EnquiryFormValues, {
              message: messages[0],
            });
          }
        }
      }
      setResult({ status: "error", message: response.message });
    });
  };

  if (result.status === "sent") {
    return (
      <GlassCard size="lg" edgeLight>
        {/* Announced to screen readers when it replaces the form. */}
        <div role="status">
          <h2 className="text-2xl font-extrabold">Enquiry sent</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Thank you — we&rsquo;ve got it. We&rsquo;ll come back to you with a
            specification and a price, usually within one working day.
          </p>
          <GlassButton
            variant="glass"
            size="md"
            className="mt-6"
            onClick={() => setResult({ status: "idle" })}
          >
            Send another enquiry
          </GlassButton>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard size="lg" edgeLight>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Selected products, carried over from the RFQ drawer. */}
        {items.length > 0 && (
          <div>
            <p className="text-sm font-medium">
              Products you&rsquo;re asking about
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item.slug}>
                  <span className="glass-surface flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3 text-xs font-medium">
                    {item.name}
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      aria-label={`Remove ${item.name}`}
                      className="hover:bg-white/10 focus-visible:ring-ring/60 rounded-full p-1 outline-none focus-visible:ring-2"
                    >
                      <X className="size-3" aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="name"
            label="Your name"
            required
            error={errors.name?.message}
          >
            {(a11y) => (
              <Input
                id="name"
                autoComplete="name"
                className={INPUT_ON_GLASS}
                {...a11y}
                {...register("name")}
              />
            )}
          </Field>

          <Field id="company" label="Company" error={errors.company?.message}>
            {(a11y) => (
              <Input
                id="company"
                autoComplete="organization"
                className={INPUT_ON_GLASS}
                {...a11y}
                {...register("company")}
              />
            )}
          </Field>

          <Field
            id="email"
            label="Email"
            required
            error={errors.email?.message}
          >
            {(a11y) => (
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className={INPUT_ON_GLASS}
                {...a11y}
                {...register("email")}
              />
            )}
          </Field>

          <Field
            id="phone"
            label="Phone"
            required
            error={errors.phone?.message}
          >
            {(a11y) => (
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={INPUT_ON_GLASS}
                {...a11y}
                {...register("phone")}
              />
            )}
          </Field>
        </div>

        <Field
          id="message"
          label="What do you need?"
          required
          hint="Width, micron and monthly volume help us quote accurately."
          error={errors.message?.message}
        >
          {(a11y) => (
            <Textarea
              id="message"
              rows={5}
              className={FIELD_ON_GLASS}
              {...a11y}
              {...register("message")}
            />
          )}
        </Field>

        {/* Honeypot. Hidden from people, visible to naive bots. Not `display:
            none` — some bots skip those — and removed from the tab order and
            the accessibility tree. */}
        <div
          aria-hidden
          className="absolute left-[-9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        {result.status === "error" && (
          <p
            role="alert"
            className="border-destructive/40 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm"
          >
            {result.message}
          </p>
        )}

        <GlassButton
          type="submit"
          variant="solid"
          size="lg"
          disabled={pending}
          className="w-full sm:w-auto"
        >
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          {pending ? "Sending…" : "Send enquiry"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}

/**
 * Label + control + hint + error, correctly associated for assistive tech.
 *
 * `children` is a render prop rather than a node so the control receives the
 * generated `aria-describedby` directly. An earlier version walked the DOM in a
 * ref callback to attach it — that fought react-hook-form's own ref and would
 * have broken silently the first time the markup changed.
 */
function Field({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: (props: {
    "aria-describedby": string | undefined;
    "aria-invalid": boolean;
  }) => React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && (
          <span className="text-brand-lit ml-0.5" aria-hidden>
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </Label>

      {hint && (
        <p id={hintId} className="text-muted-foreground mt-1 text-xs">
          {hint}
        </p>
      )}

      <div className="mt-2">
        {children({
          "aria-describedby": describedBy,
          "aria-invalid": Boolean(error),
        })}
      </div>

      {error && (
        <p id={errorId} className="text-destructive mt-1.5 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
