import {
  businessDetails,
  documentLinks,
  getPolicyDocument,
} from "../packages/compliance/pages.ts";

export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

/** Same document model as Vue; usable by public reviewers with JavaScript disabled. */
export function renderPolicyBody(site, route) {
  const doc = getPolicyDocument(site, route);
  if (!doc) throw Error("Document unavailable.");
  const es = route.locale === "es";
  const b = businessDetails(site, route.locale);
  const links = documentLinks(site, route.locale)
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`,
    )
    .join("");
  const contact = [
    b.email
      ? `<a href="mailto:${escapeHtml(b.email)}">${escapeHtml(b.email)}</a>`
      : "",
    b.phone
      ? `<a href="${escapeHtml(b.phoneHref)}">${escapeHtml(b.phone)}</a>`
      : "",
    b.address ? `<span>${escapeHtml(b.address)}</span>` : "",
  ]
    .filter(Boolean)
    .join("");
  return `<a href="#main" class="skip-link">${es ? "Ir al contenido" : "Skip to content"}</a>
<div class="preview-notice">${es ? "Sitio de vista previa. Las solicitudes no se envían." : "Preview site. Requests are not being sent."}</div>
<header class="site-header shell"><a class="brand" href="/">${escapeHtml(site.brand.name)}</a><nav aria-label="${es ? "Navegación" : "Main"}"><a href="/${es ? "en" : "es"}/${route.document}" lang="${es ? "en" : "es"}">${es ? "English" : "Español"}</a></nav></header>
<main id="main"><article class="shell policy-page"><p class="eyebrow">${escapeHtml(doc.businessName)}</p><h1>${escapeHtml(doc.title)}</h1><p class="small-print">${es ? "Versión" : "Version"} ${escapeHtml(doc.version)} · ${escapeHtml(doc.updatedOn)}</p>${doc.draft ? `<p class="policy-draft">${es ? "Borrador de vista previa. Requiere revisión del negocio antes de un registro o uso activo." : "Preview draft. Business review is required before registration or live use."}</p>` : ""}${doc.sections.map((s) => `<section class="policy-section"><h2>${escapeHtml(s.heading)}</h2><p>${escapeHtml(s.body)}</p></section>`).join("")}</article></main>
<footer class="shell business-footer"><strong>${escapeHtml(site.brand.name)}</strong><p>${escapeHtml(b.legalLine)}</p><p>${escapeHtml(b.description)}</p>${contact ? `<address>${contact}</address>` : ""}<nav class="policy-links" aria-label="${es ? "Información y políticas" : "Business information and policies"}">${links}</nav><p class="small-print">${es ? "Vista previa. No se envían solicitudes ni mensajes." : "Preview. Requests and messages are not sent."}</p></footer>`;
}
