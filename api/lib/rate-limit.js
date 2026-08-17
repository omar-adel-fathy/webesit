import { log } from "./log.js";

const buckets = new Map();

export function rateLimit(key, max, windowMs) {
  const now = Date.now();
  for (const [bucketKey, entry] of buckets) {
    if (entry.resetAt <= now) {
      buckets.delete(bucketKey);
    }
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= max) {
    log.warn(`Rate limit exceeded for ${key}`);
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}