import type {
  ComplianceProfile,
  LocalizedText,
  PolicyContent,
} from "../contracts/compliance.ts";
import { applicabilityKeys } from "../contracts/compliance.ts";
import type { SiteContext } from "../contracts/site.ts";

const pair = (en: string, es: string): LocalizedText => ({ en, es });
const section = (
  key: string,
  titleEn: string,
  titleEs: string,
  en: string,
  es: string,
) => ({ key, title: pair(titleEn, titleEs), body: pair(en, es) });
const document = (sections: PolicyContent["sections"]): PolicyContent => ({
  version: "2026-10-29-draft",
  updatedOn: "2026-10-29",
  sections,
});

/** Illustrative preview text, never a verified legal identity or provider-approved policy. */
export function previewCompliance(brand: string): ComplianceProfile {
  return {
    schemaVersion: 1,
    revision: "2026-10-29-draft",
    status: "draft",
    business: {
      legalName: null,
      dbaName: null,
      supportEmail: null,
      supportPhone: null,
      address: null,
      description: pair(
        `${brand} previews home-service information and customer/provider request forms. Requests, subscriptions and payments are not activated.`,
        `${brand} presenta información de servicios para el hogar y formularios para clientes y proveedores. Las solicitudes, suscripciones y pagos no están activados.`,
      ),
    },
    policies: {
      privacy: document([
        section(
          "collection",
          "Information entered",
          "Información ingresada",
          "You can enter contact and project details in this preview. Form contents stay in browser memory and are not submitted. Hosting systems may process technical request information.",
          "Puedes ingresar datos de contacto y del proyecto en esta vista previa. El formulario conserva los datos en la memoria del navegador y no los envía. Los sistemas de alojamiento pueden procesar información técnica de las solicitudes.",
        ),
        section(
          "use",
          "How information is used",
          "Uso de la información",
          "This preview uses entered details only to display your draft request. The operating business must review and describe all uses before live collection begins.",
          "Esta vista previa utiliza los datos solo para mostrar tu solicitud en borrador. El negocio debe revisar y describir todos los usos antes de recopilar datos en un sitio activo.",
        ),
        section(
          "sms",
          "Text-message choices",
          "Opciones de mensajes de texto",
          "Service updates and promotions have independent optional choices. Entering a number is not permission to text it. Preview choices do not enroll anyone in a messaging program.",
          "Las actualizaciones de servicio y las promociones tienen opciones separadas y voluntarias. Ingresar un número no autoriza mensajes. Las opciones de esta vista previa no inscriben a nadie en un programa.",
        ),
        section(
          "cookies",
          "Cookies and tracking",
          "Cookies y seguimiento",
          "This renderer does not install advertising pixels or analytics cookies. Any future optional tracking needs an accurate policy and the controls applicable to its audience before it runs.",
          "Este sitio de vista previa no instala píxeles publicitarios ni cookies de analítica. Cualquier seguimiento futuro requiere una política precisa y los controles aplicables antes de ejecutarse.",
        ),
        section(
          "sharing",
          "Mobile information and consent",
          "Información móvil y consentimiento",
          "The proposed program must not transfer mobile information to other businesses for their marketing. Support processors may handle information only to provide the contracted service. SMS opt-in records must not be sold or shared as another business's permission to send messages. The business must supply the applicable reviewed provider wording and confirm its actual practices.",
          "El programa propuesto no debe transferir información móvil a otros negocios para su mercadeo. Los proveedores de soporte solo pueden procesarla para prestar el servicio contratado. Los registros de suscripción SMS no deben venderse ni compartirse como permiso de otro negocio para enviar mensajes. El negocio debe aportar el texto aplicable revisado y confirmar sus prácticas reales.",
        ),
        section(
          "security",
          "Data handling",
          "Manejo de datos",
          "Do not enter sensitive information in this preview. Before live operation, the business must describe its actual security measures and authorized service providers without making unsupported guarantees.",
          "No ingreses información sensible en esta vista previa. Antes de operar, el negocio debe describir sus medidas reales de seguridad y proveedores autorizados sin ofrecer garantías sin fundamento.",
        ),
        section(
          "retention",
          "Retention",
          "Conservación",
          "Form details are not saved by this application and are cleared when the page is closed or reloaded. The business must publish the actual retention rules for any future server records and hosting logs.",
          "La aplicación no guarda los datos del formulario; se borran al cerrar o recargar la página. El negocio debe publicar las reglas reales de conservación para futuros registros del servidor y del alojamiento.",
        ),
        section(
          "rights",
          "Choices and privacy requests",
          "Opciones y solicitudes de privacidad",
          "You can leave optional message choices unchecked and clear your draft by reloading this page. Before live collection, the business must provide its privacy-request contact and the rights and processes applicable to its customers.",
          "Puedes dejar sin marcar las opciones de mensajes y borrar el borrador recargando la página. Antes de recopilar datos, el negocio debe proporcionar un contacto de privacidad y los derechos y procesos aplicables a sus clientes.",
        ),
        section(
          "contact",
          "Privacy contact",
          "Contacto de privacidad",
          "Business support and privacy contacts are awaiting verification. This draft is not ready for public registration or live collection.",
          "Los contactos de soporte y privacidad están pendientes de verificación. Este borrador no está listo para registro público ni recopilación activa.",
        ),
      ]),
      terms: document([
        section(
          "service",
          "Website and service scope",
          "Alcance del sitio y del servicio",
          "This is a service-information preview. A draft request does not confirm a booking, purchase, provider assignment or payment. Actual prices, cancellation rules and business terms require review before an offer is accepted.",
          "Esta es una vista previa de información de servicios. Un borrador no confirma una reserva, compra, asignación de proveedor ni pago. Los precios, cancelaciones y condiciones reales requieren revisión antes de aceptar una oferta.",
        ),
        section(
          "sms-program",
          "Proposed SMS program",
          "Programa SMS propuesto",
          `${brand} shows separate draft choices for request/service updates and promotions. No messages are sent and no subscription is created in this preview.`,
          `${brand} muestra opciones separadas en borrador para actualizaciones de solicitudes o servicios y promociones. Esta vista previa no envía mensajes ni crea suscripciones.`,
        ),
        section(
          "frequency",
          "Frequency",
          "Frecuencia",
          "The proposed frequency varies with the selected program and activity. Before enrollment, the business must publish the actual frequency for each category beside its consent choice.",
          "La frecuencia propuesta varía según el programa y la actividad. Antes de inscribir a alguien, el negocio debe publicar la frecuencia real de cada categoría junto a su opción.",
        ),
        section(
          "charges",
          "Messaging charges and purchase choices",
          "Cargos y decisiones de compra",
          "Your mobile plan may charge for texts and data. Choosing promotional messages must never be required to buy a product or service or to send the underlying request.",
          "Tu plan móvil puede cobrar por mensajes y datos. Elegir promociones nunca debe ser un requisito para comprar un producto o servicio ni para enviar la solicitud.",
        ),
        section(
          "stop",
          "Stopping messages",
          "Cómo detener mensajes",
          "For an activated program, send STOP to end the applicable subscription. The backend must confirm the withdrawal once and suppress subsequent program messages. This behavior must be tested before activation.",
          "En un programa activado, envía STOP para terminar la suscripción aplicable. El sistema debe confirmar la baja una vez y suprimir los mensajes posteriores. Este comportamiento debe probarse antes de la activación.",
        ),
        section(
          "help",
          "Getting help",
          "Cómo obtener ayuda",
          "An activated program must respond to HELP with the business identity and working support details. Verified email and telephone contacts must be supplied before enrollment opens.",
          "Un programa activado debe responder a HELP con la identidad del negocio y contactos de soporte válidos. El correo y teléfono verificados deben proporcionarse antes de abrir inscripciones.",
        ),
        section(
          "rejoin",
          "Joining again",
          "Volver a suscribirse",
          "After withdrawing, use the original signup process and make a new explicit choice if you want to subscribe again. An old permission must not be silently restored.",
          "Después de darte de baja, usa el proceso original y elige expresamente suscribirte de nuevo. Un permiso anterior no debe reactivarse sin una nueva decisión.",
        ),
        section(
          "carriers",
          "Delivery limitations",
          "Limitaciones de entrega",
          "Mobile carriers do not assume responsibility when program messages arrive late or fail to arrive. A messaging delivery failure does not reverse an order already committed by the commerce service.",
          "Los operadores móviles no asumen responsabilidad por mensajes tardíos o no entregados. Una falla de entrega no revierte un pedido ya confirmado por el servicio de comercio.",
        ),
        section(
          "age",
          "Program eligibility",
          "Elegibilidad del programa",
          "The proposed SMS program is for people aged 18 or older. Restricted offerings may need additional eligibility and age verification; this statement alone does not establish that verification.",
          "El programa SMS propuesto es para personas de 18 años o más. Las ofertas restringidas pueden requerir verificaciones adicionales de edad y elegibilidad; esta declaración no sustituye esas verificaciones.",
        ),
        section(
          "privacy",
          "Privacy",
          "Privacidad",
          "Read the linked Privacy Policy for the business's data practices and message-choice information. This draft must be reviewed against the actual operation before publication.",
          "Consulta la Política de privacidad enlazada para conocer las prácticas de datos y las opciones de mensajes. Este borrador debe revisarse según la operación real antes de publicarse.",
        ),
      ]),
    },
    sms: {
      offered: true,
      programName: `${brand} updates`,
      minimumAge: 18,
      wordingReview: "draft",
      eligibility: "unreviewed",
      transactional: {
        offered: true,
        purposes: pair(
          "Updates about requests, appointments and service activity",
          "Actualizaciones sobre solicitudes, citas y servicios",
        ),
        frequency: pair(
          "Frequency depends on request and service activity.",
          "La frecuencia depende de la actividad de solicitudes y servicios.",
        ),
        disclosure: pair(
          `I choose service-related texts from ${brand} at the number entered here. My mobile plan may charge for texts and data. Use HELP for assistance or STOP to withdraw. This choice is optional and this preview creates no subscription.`,
          `Elijo recibir mensajes de servicio de ${brand} en el número ingresado. Mi plan móvil puede cobrar mensajes y datos. Uso HELP para ayuda o STOP para darme de baja. Esta opción es voluntaria y la vista previa no crea una suscripción.`,
        ),
      },
      marketing: {
        offered: true,
        purposes: pair(
          "Promotional offers and product or service announcements",
          "Ofertas promocionales y novedades de productos o servicios",
        ),
        frequency: pair(
          "Promotional frequency varies; the business must confirm its actual schedule.",
          "La frecuencia promocional varía; el negocio debe confirmar su calendario real.",
        ),
        disclosure: pair(
          `I choose promotional texts from ${brand} at the number entered here. My mobile plan may charge for texts and data. Use HELP for assistance or STOP to withdraw. Buying or requesting a service does not require this choice. This preview creates no subscription.`,
          `Elijo recibir promociones por texto de ${brand} en el número ingresado. Mi plan móvil puede cobrar mensajes y datos. Uso HELP para ayuda o STOP para darme de baja. Comprar o solicitar un servicio no requiere esta opción. La vista previa no crea una suscripción.`,
        ),
      },
    },
    applicability: Object.fromEntries(
      applicabilityKeys.map((key) => [key, null]),
    ) as ComplianceProfile["applicability"],
  };
}

export function profileForSite(site: SiteContext): ComplianceProfile {
  return site.schemaVersion === 2
    ? site.compliance
    : previewCompliance(site.brand.name);
}
