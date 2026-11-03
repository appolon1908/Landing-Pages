/** Process-local protection, keyed only by observed socket IP + trusted site ID. */
export function createRateLimiter({ now = Date.now, maxEntries = 10000 } = {}) {
  const buckets = new Map();
  return {
    take(siteId, ip, { capacity = 10, windowMs = 600000 } = {}) {
      const time = now();
      const key = `${siteId}:${ip}`;
      let bucket = buckets.get(key);
      if (!bucket) {
        if (buckets.size >= maxEntries) {
          for (const [key, item] of buckets)
            if (time - item.updated >= item.windowMs) buckets.delete(key);
          if (buckets.size >= maxEntries)
            return {
              allowed: false,
              retryAfter: Math.max(1, Math.ceil(windowMs / 1000)),
            };
        }
        bucket = { tokens: capacity, updated: time, windowMs };
        buckets.set(key, bucket);
      }
      bucket.tokens = Math.min(
        capacity,
        bucket.tokens +
          (Math.max(0, time - bucket.updated) * capacity) / windowMs,
      );
      bucket.updated = time;
      if (bucket.tokens < 1)
        return {
          allowed: false,
          retryAfter: Math.max(
            1,
            Math.ceil(((1 - bucket.tokens) * windowMs) / capacity / 1000),
          ),
        };
      bucket.tokens -= 1;
      return { allowed: true, retryAfter: 0 };
    },
  };
}
