import { createHash } from "node:crypto";
import { appendFile } from "node:fs/promises";

/**
 * In-memory idempotency store with an optional append-only JSONL journal.
 * Keys are scoped per site. Same key + same body returns the stored receipt;
 * same key + different body is a conflict. Swap this for a database by
 * implementing the same three methods.
 */
export function createIdempotencyStore({
  journalFile = null,
  ttlMs = 24 * 3600 * 1000,
  now = Date.now,
} = {}) {
  const entries = new Map();
  const hash = (body) => createHash("sha256").update(body).digest("hex");
  function sweep() {
    const t = now();
    for (const [k, v] of entries) if (v.expires < t) entries.delete(k);
  }
  return {
    lookup(siteId, key, body) {
      sweep();
      const hit = entries.get(`${siteId}:${key}`);
      if (!hit) return { status: "new" };
      return hit.hash === hash(body)
        ? { status: "replay", receipt: hit.receipt }
        : { status: "conflict" };
    },
    reserve(siteId, key, body) {
      entries.set(`${siteId}:${key}`, {
        hash: hash(body),
        receipt: null,
        expires: now() + ttlMs,
      });
    },
    async commit(siteId, key, receipt, record) {
      const entry = entries.get(`${siteId}:${key}`);
      if (entry) entry.receipt = receipt;
      if (journalFile)
        await appendFile(journalFile, JSON.stringify(record) + "\n");
    },
    release(siteId, key) {
      entries.delete(`${siteId}:${key}`);
    },
    size: () => entries.size,
  };
}
