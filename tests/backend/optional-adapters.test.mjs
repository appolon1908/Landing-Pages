import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

test("optional n8n adapter signs exact transport bytes and requires a canonical downstream CRM receipt", async () => {
  const { n8n } = await import("../../backend/src/destinations/n8n.mjs").catch(
    () => ({ n8n: undefined }),
  );
  assert.equal(typeof n8n, "function");
  process.env.LP_TEST_N8N_SIGNING = "fake-signing-value";
  try {
    const destination = n8n(
      {
        type: "n8n",
        url: "https://n8n.example.org/intake",
        authEnv: "LP_TEST_N8N_SIGNING",
        idempotencyContract: "site-key-payload",
      },
      async (_url, init) => {
        assert.equal(
          init.headers["X-Breero-Signature"],
          "sha256=" +
            createHmac("sha256", "fake-signing-value")
              .update(init.body)
              .digest("hex"),
        );
        assert.equal(init.headers.Authorization, undefined);
        return Response.json({ accepted: true, id: "crm-via-workflow" });
      },
    );
    assert.deepEqual(
      await destination.deliver({
        siteId: "fixture",
        idempotencyKey: "same-key",
        payload: {},
        payloadFingerprint: "a".repeat(64),
      }),
      { downstreamStatus: "CRM_ACCEPTED", downstreamId: "crm-via-workflow" },
    );
  } finally {
    delete process.env.LP_TEST_N8N_SIGNING;
  }
});

test("Odoo remains an explicit unconfigured stub and cannot deliver", async () => {
  const { odoo } =
    await import("../../backend/src/destinations/odoo.mjs").catch(() => ({
      odoo: undefined,
    }));
  assert.equal(typeof odoo, "function");
  await assert.rejects(
    () => odoo({ type: "odoo" }).deliver({}),
    /not configured/i,
  );
});
