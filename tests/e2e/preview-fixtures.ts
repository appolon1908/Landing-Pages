import {
  test as base,
  expect,
  type BrowserContext,
  type Page,
} from "@playwright/test";
export async function installPreviewGuard(context: BrowserContext) {
  const attemptedWrites: string[] = [];
  const externalRequests: string[] = [];
  const errors: string[] = [];
  const watchPage = (page: Page) => {
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
  };
  context.pages().forEach(watchPage);
  context.on("page", watchPage);
  // A regression must fail without creating a real request or provider effect.
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      attemptedWrites.push(`${request.method()} ${request.url()}`);
      await route.abort();
    } else if (!["127.0.0.1", "localhost"].includes(url.hostname)) {
      externalRequests.push(request.url());
      await route.abort();
    } else await route.continue();
  });
  return () => {
    expect(
      attemptedWrites,
      "Preview must attempt zero writes, including POST",
    ).toEqual([]);
    expect(externalRequests, "Preview must be self-contained").toEqual([]);
    expect(errors, "No uncaught browser or console errors").toEqual([]);
  };
}
export const test = base.extend<{ previewGuard: void }>({
  previewGuard: [
    async ({ context }, use) => {
      const assertSafe = await installPreviewGuard(context);
      await use();
      assertSafe();
    },
    { auto: true },
  ],
});
export { expect };
