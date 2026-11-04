# Voice and CTA review glossary

Status: DRAFT. Use service-specific language from the approved page manifest. The copy is a proposed preview, not evidence of available staff, lead volume or a service booking.

| Meaning              | ES                        | EN                   | FR                         |
| -------------------- | ------------------------- | -------------------- | -------------------------- |
| Customer request     | solicitud de servicio     | service request      | demande de service         |
| Provider application | postulación de proveedor  | provider application | candidature de prestataire |
| Quote                | cotización                | quote                | devis                      |
| Area                 | sector o zona             | area or neighborhood | secteur ou quartier        |
| Pending confirmation | pendiente de confirmación | pending confirmation | à confirmer                |
| Independent provider | proveedor independiente   | independent provider | prestataire indépendant    |

| Platform enum      | ES planning label           | EN planning label       | FR planning label           |
| ------------------ | --------------------------- | ----------------------- | --------------------------- |
| `GET_QUOTE`        | Solicitar cotización        | Get a quote             | Demander un devis           |
| `APPLY_NOW`        | Presentar solicitud         | Apply now               | Candidater                  |
| `WHATSAPP_MESSAGE` | Enviar mensaje por WhatsApp | Send a WhatsApp message | Envoyer un message WhatsApp |

These are review labels. Verify supported enum/placement combinations and rendered button wording in the owner's current account before import. Provider `APPLY_NOW` means an independent business partnership application, never employment. Actual page CTAs remain service-specific and are stored separately as exact `pageCta` snapshots.

ES: Use «usted», «aire acondicionado», «inversor», «cisterna» where they describe the actual service. EN: Prefer a concrete service and action over promotional slogans. FR: Use «vous», «devis», «prestataire» and adapted service terms. All locales must retain scope limits, fictional labels and consent distinctions.

Design tokens and type choices are in `docs/BRAND.md`; they reflect the current UI rather than a new visual system. Unsupported-claim patterns are in `banned-phrases.json`. Do not remove safeguards simply to obtain a passing check.
