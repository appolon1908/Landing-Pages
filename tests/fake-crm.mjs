import assert from "node:assert/strict";
import { webhook } from "../backend/src/destinations/webhook.mjs";

// The only CRM here is this in-process fake; no network or provider calls.
export function installFakeCrm(registry, host, onSubmission = () => {}) {
  const records = new Map();
  registry.forHost(host).destination = webhook(
    {
      type: "webhook",
      url: "https://fake-crm.invalid/intake",
      idempotencyContract: "site-key-payload",
    },
    async (_url, init) => {
      const submission = JSON.parse(init.body);
      const key = init.headers["Idempotency-Key"];
      let record = records.get(key);
      if (record)
        assert.equal(record.fingerprint, submission.payloadFingerprint);
      else {
        await onSubmission(submission);
        record = {
          id: `crm-${records.size + 1}`,
          fingerprint: submission.payloadFingerprint,
        };
        records.set(key, record);
      }
      return Response.json({ accepted: true, id: record.id });
    },
  );
  return records;
}
