/** Vendor remains unconfirmed. Never infer Odoo authority or provision credentials. */
export function odoo() {
  return {
    type: "odoo",
    async deliver() {
      throw Error("Odoo is not configured.");
    },
  };
}
