import Link from "next/link";

import { Container } from "@/components/common/container";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";

/**
 * 404. A styled dead-end that routes the user back to the two pages they most
 * likely wanted — products, or a way to reach a human.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60svh] items-center justify-center py-24">
      <GlassCard size="lg" edgeLight className="max-w-lg text-center">
        <p className="text-brand-amber font-mono text-xs tracking-[0.2em] uppercase">
          404
        </p>
        <h1 className="mt-4 text-3xl font-extrabold">Page not found</h1>
        <p className="text-muted-foreground mt-3">
          That page doesn&rsquo;t exist — it may have moved. Here&rsquo;s the way
          back.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <GlassButton asChild variant="solid" size="md">
            <Link href="/products">View products</Link>
          </GlassButton>
          <GlassButton asChild variant="glass" size="md">
            <Link href="/">Home</Link>
          </GlassButton>
        </div>
      </GlassCard>
    </Container>
  );
}
