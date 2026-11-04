import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";

// Offline derivative only: retain the supplied original and its handoff hash.
const base = new URL("../packages/ui/src/assets/", import.meta.url);
const manifestUrl = new URL("manifest.json", base);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
const original = manifest.brand.find((item) => item.key === "logo");
const input = await readFile(new URL(original.file, base));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
if (digest(input) !== original.sha256)
  throw Error("Supplied logo has changed.");
const browser = await chromium.launch(
  process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {},
);
try {
  const page = await browser.newPage();
  await page.route("**/*", (route) => route.abort());
  const result = await page.evaluate(async (data) => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 528; // Three device pixels per 176px desktop logo.
    canvas.height = Math.round(
      (canvas.width * image.naturalHeight) / image.naturalWidth,
    );
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return {
      data: canvas.toDataURL("image/png").split(",")[1],
      dimensions: `${canvas.width}x${canvas.height}`,
    };
  }, input.toString("base64"));
  const bytes = Buffer.from(result.data, "base64");
  if (bytes.length > 64 * 1024)
    throw Error("Header logo exceeds its 64KiB budget.");
  const derived = {
    key: "headerLogo",
    file: "brand/BREERO-logo-header.png",
    derivedFrom: original.file,
    sourceSha256: original.sha256,
    bytes: bytes.length,
    dimensions: result.dimensions,
    sha256: digest(bytes),
  };
  await writeFile(new URL(derived.file, base), bytes);
  manifest.derived = [derived];
  await writeFile(manifestUrl, JSON.stringify(manifest, null, 2) + "\n");
  console.log(JSON.stringify(derived));
} finally {
  await browser.close();
}
