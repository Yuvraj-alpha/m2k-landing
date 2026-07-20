import "server-only";

/**
 * Minimal fixed-window rate limiter for the enquiry action.
 *
 * DELIBERATE LIMITATIONS — read before relying on this.
 *
 * State lives in module memory, so it is per-instance and resets on deploy or
 * cold start. On serverless it is therefore best-effort: it stops a single
 * client hammering one warm instance, and nothing more. It is not a defence
 * against a distributed flood.
 *
 * That is an accepted trade for this site — the downside of an abusive burst is
 * spam in one inbox, not data loss — and it avoids adding Redis to a brochure
 * site. If enquiry spam becomes a real problem, replace this with a durable
 * store (Upstash) rather than tuning the numbers here.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterMs: number;
} {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep so the map can't grow unbounded on a long-lived
    // instance. Cheap because it only runs when a new window opens.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= MAX_PER_WINDOW) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
