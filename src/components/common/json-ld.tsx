import { jsonLdScript } from "@/lib/seo";

/**
 * Renders a JSON-LD block.
 *
 * A server component, so the structured data is in the initial HTML where
 * crawlers read it — not injected after hydration. `dangerouslySetInnerHTML` is
 * the documented way to emit JSON-LD in React; the value is escaped by
 * jsonLdScript so it cannot break out of the script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  );
}
