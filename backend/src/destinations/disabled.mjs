/** Preview / not-yet-pointed sites. Never receives traffic: submissionsEnabled is false. */
export function disabled() {
  return {
    type: "disabled",
    async deliver() {
      throw Error("Destination disabled.");
    },
  };
}
