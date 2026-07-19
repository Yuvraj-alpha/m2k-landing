import type { Metadata } from "next";

import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassPanel } from "@/components/glass/glass-panel";
import { GlassPlate } from "@/components/glass/glass-plate";

/**
 * Design-system reference for the glass material.
 *
 * This is a working surface, not a public page — it exists so the material can
 * be judged with real type and real density before it is committed to across
 * seven routes. Kept out of search results and out of the sitemap.
 *
 * To check the accessibility fallbacks without changing OS settings, use
 * Chrome DevTools → Rendering → "Emulate CSS media feature
 * prefers-reduced-transparency / prefers-reduced-motion".
 */
export const metadata: Metadata = {
  title: "Kitchen Sink",
  robots: { index: false, follow: false },
};

const CARD_VARIANTS = [
  {
    variant: "default",
    label: "default",
    note: "Standard translucent panel. The workhorse for content cards.",
  },
  {
    variant: "raised",
    label: "raised",
    note: "Denser tint, for cards stacked on top of other glass.",
  },
  {
    variant: "frosted",
    label: "frosted",
    note: "Near-opaque with a wider blur. For dense body copy.",
  },
  {
    variant: "inset",
    label: "inset",
    note: "Reads as cut into the surface rather than laid on it.",
  },
] as const;

export default function KitchenSinkPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
          Phase 2 · Design system
        </p>
        <h1 className="mt-3 text-4xl font-extrabold">Liquid glass</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
          M2K manufactures transparent film. Every surface here is a sheet of
          that film stretched over a lit substrate, so the page is read{" "}
          <em>through the product</em>.
        </p>
      </header>

      {/* --- Card variants --- */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold tracking-widest uppercase">
          Surfaces
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {CARD_VARIANTS.map(({ variant, label, note }) => (
            <GlassCard key={label} variant={variant} size="md">
              <p className="font-mono text-xs tracking-wider uppercase">
                {label}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">{note}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* --- Interaction --- */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold tracking-widest uppercase">
          Interaction
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <GlassCard interactive>
            <p className="font-medium">Interactive</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Hover with a mouse: a specular highlight tracks the pointer, and
              the card stretches non-uniformly — scaleX 1.02 against scaleY
              1.005. The asymmetry is the point; it reads as film under tension
              rather than as a bounce.
            </p>
          </GlassCard>

          <GlassCard interactive edgeLight>
            <p className="font-medium">Interactive + edge light</p>
            <p className="text-muted-foreground mt-2 text-sm">
              A directional gradient along the border — light entering the
              material at the top-left bevel and catching again at the bottom
              right. Reads as a thicker sheet.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* --- The contrast rule --- */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold tracking-widest uppercase">
          The contrast rule
        </h2>
        <GlassCard size="lg">
          <p className="font-medium">Headings may sit on bare glass.</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Short, large, high-weight text has enough visual mass to survive a
            variable backdrop.
          </p>

          <GlassPlate className="mt-5 p-5">
            <p className="text-sm leading-relaxed">
              Anything a user has to <em>read</em> goes on a plate. This layer is
              opaque enough that the paragraph&rsquo;s contrast ratio is a
              property of the plate rather than of whatever imagery happens to
              be behind the panel — which is the failure mode that makes most
              glassmorphism illegible in practice. Spec tables, form labels and
              body copy all get this treatment.
            </p>
          </GlassPlate>
        </GlassCard>
      </section>

      {/* --- Buttons --- */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold tracking-widest uppercase">
          Actions
        </h2>
        <GlassCard size="lg">
          <div className="flex flex-wrap items-center gap-3">
            <GlassButton variant="solid" size="lg">
              Request a quote
            </GlassButton>
            <GlassButton variant="glass" size="lg">
              View products
            </GlassButton>
            <GlassButton variant="amber" size="md">
              Download catalogue
            </GlassButton>
            <GlassButton variant="ghost" size="sm">
              Learn more
            </GlassButton>
          </div>
          <p className="text-muted-foreground mt-5 text-sm">
            One solid brand-red action per view. Red is used as a{" "}
            <strong>surface</strong> carrying white text, never as text on the
            substrate — brand red on near-black is only about 3.9:1.
          </p>
        </GlassCard>
      </section>

      {/* --- Panel --- */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold tracking-widest uppercase">
          Panels
        </h2>
        <GlassPanel className="p-8">
          <p className="font-medium">Section band</p>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            A card is an object on the page; a panel is a band of the page.
            Panels are static and stay server components, so wrapping a whole
            section in one costs no client JavaScript.
          </p>
        </GlassPanel>
      </section>

      {/* --- Typography --- */}
      <section>
        <h2 className="mb-5 text-sm font-semibold tracking-widest uppercase">
          Type
        </h2>
        <GlassCard size="lg">
          <h3 className="text-3xl font-extrabold">Archivo, expanded</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Headings load the <code>wdth</code> axis at 112 to echo the wide
            industrial lockup of the M2K logo.
          </p>
          <GlassPlate className="mt-5 p-5">
            <p className="text-sm leading-relaxed">
              Inter carries body copy. Spec tables use tabular figures so that
              micron and width columns align down the page:
            </p>
            <table className="mt-4 w-full text-sm">
              <tbody>
                <tr className="border-border/60 border-b">
                  <td className="text-muted-foreground py-2">Stretchability</td>
                  <td className="py-2 text-right font-medium">350%+</td>
                </tr>
                <tr className="border-border/60 border-b">
                  <td className="text-muted-foreground py-2">Widths</td>
                  <td className="py-2 text-right font-medium">250–1000 mm</td>
                </tr>
                <tr>
                  <td className="text-muted-foreground py-2">Microns</td>
                  <td className="py-2 text-right font-medium">12–80</td>
                </tr>
              </tbody>
            </table>
          </GlassPlate>
        </GlassCard>
      </section>
    </div>
  );
}
