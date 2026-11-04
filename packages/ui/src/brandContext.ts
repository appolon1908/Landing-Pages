/** The server removes supplied BREERO icons first; this also covers Vite previews. */
export function applyBrandContext(brandName: string): void {
  if (brandName.trim().toLowerCase() === "breero") return;
  document
    .querySelectorAll("link[data-breero-icon]")
    .forEach((icon) => icon.remove());
}
