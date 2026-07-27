import { siteConfig } from "@/config/site";

/**
 * Shared 1200×630 Open Graph card.
 *
 * Rendered by `next/og`, which supports only flexbox and a subset of CSS — no
 * grid, no external fonts unless fetched and passed as buffers, no CSS
 * variables. So this deliberately does NOT reuse the site's Tailwind glass
 * classes or design tokens: it restates the palette as literal hex and builds
 * the "glass" look with plain rgba layers. It reads as the same brand without
 * sharing an implementation that would not run in this renderer.
 *
 * Keep it self-contained: anything imported here must be pure data.
 */

const RED = "#b21f24";
const AMBER = "#fdb813";
const INK = "#08080a";

export function OgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: INK,
        color: "white",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Backdrop glow, echoing the site's lit substrate. */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -150,
          width: 700,
          height: 700,
          borderRadius: 9999,
          background: RED,
          opacity: 0.35,
          filter: "blur(120px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -220,
          right: -140,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background: AMBER,
          opacity: 0.18,
          filter: "blur(120px)",
        }}
      />

      {/* Brand line */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontSize: 42, fontWeight: 800, color: "#e8484e" }}>
          M2K
        </span>
        <span
          style={{
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Packpro
        </span>
      </div>

      {/* Headline block */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: AMBER,
          }}
        >
          {eyebrow}
        </span>
        <span style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.75)",
              maxWidth: 900,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          color: "rgba(255,255,255,0.65)",
        }}
      >
        <span>
          {siteConfig.address.locality}, {siteConfig.address.region}
        </span>
        <span>{siteConfig.url.replace("https://", "")}</span>
      </div>
    </div>
  );
}

/** Standard OG dimensions and type. Re-exported by each image route. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
