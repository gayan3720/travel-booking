// Simple in-memory rate limiter (fine for single-instance deployments).
// For multi-instance/serverless at scale, swap this for Upstash Redis rate limiting.

const hits = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  key: string,
  { max, windowSeconds }: { max: number; windowSeconds: number }
): Promise<boolean> {
  const now = Date.now();
  const record = hits.get(key);

  if (!record || now > record.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }

  if (record.count >= max) return false;

  record.count += 1;
  return true;
}
