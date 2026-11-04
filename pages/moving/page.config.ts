import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "moving",
  accent: "#176257",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    en: {
      name: "Moving",
      headline: "Planning a move in Santo Domingo?",
      subhead:
        "Tell us the origin and destination areas, planned date and size of your move. A suitable provider can discuss access, packing and a quote.",
      cta: "Get a moving quote",
      subtypes: [
        {
          value: "home-move",
          label: "Home move",
        },
        {
          value: "office-move",
          label: "Office move",
        },
        {
          value: "packing",
          label: "Packing assistance",
        },
      ],
      urgency: [
        {
          value: "today",
          label: "Today, subject to availability",
        },
        {
          value: "this-week",
          label: "This week",
        },
        {
          value: "flexible",
          label: "Flexible",
        },
      ],
      extraFields: [
        {
          key: "move-date",
          type: "date",
          required: false,
          label: "Preferred moving date",
        },
        {
          key: "destination-area",
          type: "text",
          required: true,
          label: "Destination neighborhood, not full address",
        },
      ],
      included: [
        "Home and office moves",
        "Packing and loading scope agreed in the quote",
        "Furniture handling subject to access assessment",
      ],
      excluded: [
        "Hazardous goods and international transport are outside this request. Declare fragile or unusually heavy items before agreeing a quote.",
      ],
      priceFactors: [
        "Volume and travel distance",
        "Stairs, lifts and parking access",
        "Packing materials and handling requirements",
      ],
      steps: [
        "Describe the work and your area.",
        "We check for an eligible provider.",
        "Discuss a quote and agree any appointment directly.",
      ],
      faq: [
        {
          q: "What should I describe in my request?",
          a: "Tell us the origin and destination areas, planned date and size of your move. A suitable provider can discuss access, packing and a quote.",
        },
        {
          q: "Is this a confirmed appointment?",
          a: "No. A request starts a review of the service and area. A provider must confirm the quote, date and availability with you.",
        },
        {
          q: "Which areas and hours are covered?",
          a: "Santo Domingo is the proposed pilot area. Actual supported zones and staffed hours have not been published; this preview does not promise a match or response time.",
        },
        {
          q: "Is the request or visit free?",
          a: "Free customer requests are the proposed model. The provider must explain any diagnosis, visit or project charge before you agree; no service price is published here.",
        },
        {
          q: "Who carries out the work?",
          a: "An independent provider would supply the service and its quote. Confirm scope, payment terms and any workmanship guarantee directly before authorizing work.",
        },
        {
          q: "How can I change, cancel or complain?",
          a: "The operator must publish a working support channel and cancellation process before launch. This preview creates no request, charge or appointment.",
        },
        {
          q: "What is outside the standard scope?",
          a: "Hazardous goods and international transport are outside this request. Declare fragile or unusually heavy items before agreeing a quote.",
        },
      ],
      confirmation:
        "Your request has been received for matching review. Keep the reference shown here. An appointment is confirmed only when you and the provider agree.",
    },
    es: {
      name: "Mudanzas",
      headline: "¿Planea una mudanza en Santo Domingo?",
      subhead:
        "Indique los sectores de origen y destino, la fecha prevista y el tamaño de la mudanza. Un proveedor podrá revisar el acceso, el embalaje y la cotización.",
      cta: "Cotizar mi mudanza",
      subtypes: [
        {
          value: "home-move",
          label: "Mudanza de vivienda",
        },
        {
          value: "office-move",
          label: "Mudanza de oficina",
        },
        {
          value: "packing",
          label: "Ayuda con el embalaje",
        },
      ],
      urgency: [
        {
          value: "today",
          label: "Hoy, sujeto a disponibilidad",
        },
        {
          value: "this-week",
          label: "Esta semana",
        },
        {
          value: "flexible",
          label: "Fecha flexible",
        },
      ],
      extraFields: [
        {
          key: "move-date",
          type: "date",
          required: false,
          label: "Fecha prevista de mudanza",
        },
        {
          key: "destination-area",
          type: "text",
          required: true,
          label: "Sector de destino, sin dirección completa",
        },
      ],
      included: [
        "Mudanzas de viviendas y oficinas",
        "Embalaje y carga según la cotización",
        "Manejo de muebles sujeto a evaluación del acceso",
      ],
      excluded: [
        "Esta solicitud no incluye mercancías peligrosas ni transporte internacional. Declare los objetos frágiles o de peso especial antes de acordar la cotización.",
      ],
      priceFactors: [
        "Volumen y distancia del traslado",
        "Escaleras, ascensores y acceso para estacionar",
        "Materiales de embalaje y necesidades de carga",
      ],
      steps: [
        "Describa el trabajo y su sector.",
        "Revisamos si hay un proveedor adecuado.",
        "Converse sobre la cotización y acuerde la cita directamente.",
      ],
      faq: [
        {
          q: "¿Qué debo describir en mi solicitud?",
          a: "Indique los sectores de origen y destino, la fecha prevista y el tamaño de la mudanza. Un proveedor podrá revisar el acceso, el embalaje y la cotización.",
        },
        {
          q: "¿Esto confirma una cita?",
          a: "No. La solicitud inicia una revisión del servicio y del área. Un proveedor debe confirmar con usted la cotización, la fecha y la disponibilidad.",
        },
        {
          q: "¿Qué zonas y horarios atienden?",
          a: "Santo Domingo es el área propuesta para el piloto. Las zonas habilitadas y los horarios de atención aún no se han publicado; esta vista previa no promete proveedor ni tiempo de respuesta.",
        },
        {
          q: "¿La solicitud o la visita son gratuitas?",
          a: "El modelo propuesto contempla solicitudes gratuitas para clientes. El proveedor debe explicar cualquier cargo de diagnóstico, visita o trabajo antes de que usted lo acepte; aquí no se publica un precio.",
        },
        {
          q: "¿Quién realiza el trabajo?",
          a: "Un proveedor independiente prestaría el servicio y emitiría su cotización. Confirme alcance, condiciones de pago y cualquier garantía del trabajo antes de autorizarlo.",
        },
        {
          q: "¿Cómo cambio, cancelo o presento una queja?",
          a: "Antes del lanzamiento, el operador debe publicar un canal de soporte y un proceso de cancelación. Esta vista previa no crea solicitudes, cargos ni citas.",
        },
        {
          q: "¿Qué queda fuera del alcance habitual?",
          a: "Esta solicitud no incluye mercancías peligrosas ni transporte internacional. Declare los objetos frágiles o de peso especial antes de acordar la cotización.",
        },
      ],
      confirmation:
        "Recibimos su solicitud para revisar si hay un proveedor adecuado. Conserve la referencia mostrada. La cita solo se confirma cuando usted y el proveedor la acuerdan.",
    },
    fr: {
      name: "Déménagement",
      headline: "Un déménagement prévu à Santo Domingo ?",
      subhead:
        "Indiquez les quartiers de départ et d’arrivée, la date et le volume à déménager. Un prestataire pourra préciser les accès, l’emballage et le devis.",
      cta: "Demander un devis de déménagement",
      subtypes: [
        {
          value: "home-move",
          label: "Déménagement de logement",
        },
        {
          value: "office-move",
          label: "Déménagement de bureaux",
        },
        {
          value: "packing",
          label: "Aide à l’emballage",
        },
      ],
      urgency: [
        {
          value: "today",
          label: "Aujourd’hui, selon disponibilité",
        },
        {
          value: "this-week",
          label: "Cette semaine",
        },
        {
          value: "flexible",
          label: "Date flexible",
        },
      ],
      extraFields: [
        {
          key: "move-date",
          type: "date",
          required: false,
          label: "Date de déménagement souhaitée",
        },
        {
          key: "destination-area",
          type: "text",
          required: true,
          label: "Quartier d’arrivée, sans adresse complète",
        },
      ],
      included: [
        "Déménagements de logements et de bureaux",
        "Emballage et chargement définis au devis",
        "Manutention des meubles selon les accès",
      ],
      excluded: [
        "Cette demande ne couvre pas les produits dangereux ni le transport international. Signalez les objets fragiles ou très lourds avant de valider le devis.",
      ],
      priceFactors: [
        "Volume et distance du trajet",
        "Escaliers, ascenseurs et stationnement",
        "Emballage et manutention nécessaires",
      ],
      steps: [
        "Décrivez le travail et votre quartier.",
        "Nous vérifions si un prestataire peut répondre.",
        "Discutez du devis et convenez directement du rendez-vous.",
      ],
      faq: [
        {
          q: "Que dois-je préciser dans ma demande ?",
          a: "Indiquez les quartiers de départ et d’arrivée, la date et le volume à déménager. Un prestataire pourra préciser les accès, l’emballage et le devis.",
        },
        {
          q: "Est-ce un rendez-vous confirmé ?",
          a: "Non. Une demande ouvre l’examen du service et de la zone. Un prestataire doit confirmer avec vous le devis, la date et ses disponibilités.",
        },
        {
          q: "Quelles zones et quels horaires sont couverts ?",
          a: "Santo Domingo est la zone pilote proposée. Les secteurs desservis et horaires de présence ne sont pas encore publiés ; cet aperçu ne promet ni mise en relation ni délai de réponse.",
        },
        {
          q: "La demande ou la visite est-elle gratuite ?",
          a: "La gratuité des demandes clients est le modèle proposé. Le prestataire doit expliquer tout coût de diagnostic, de visite ou de travaux avant votre accord ; aucun prix de service n’est publié ici.",
        },
        {
          q: "Qui réalise le travail ?",
          a: "Un prestataire indépendant fournirait le service et son devis. Confirmez le périmètre, le paiement et toute garantie sur les travaux avant de les autoriser.",
        },
        {
          q: "Comment modifier, annuler ou déposer une réclamation ?",
          a: "L’opérateur doit publier un canal d’assistance et une procédure d’annulation avant le lancement. Cet aperçu ne crée aucune demande, facturation ou réservation.",
        },
        {
          q: "Quelles prestations sont exclues ?",
          a: "Cette demande ne couvre pas les produits dangereux ni le transport international. Signalez les objets fragiles ou très lourds avant de valider le devis.",
        },
      ],
      confirmation:
        "Votre demande a été reçue pour rechercher un prestataire adapté. Conservez la référence affichée. Un rendez-vous n’est confirmé qu’après accord entre vous et le prestataire.",
    },
  },
  provider: {
    en: {
      name: "Moving",
      headline: "Moving: requests in your service area",
      subhead:
        "Set your service areas, capabilities and capacity. Apply for matching opportunities; an application does not activate lead delivery or guarantee work.",
      cta: "Apply for moving leads",
      fit: [
        "Independent professionals, teams and companies that provide this service",
        "Declare your coverage, capacity and relevant credentials",
        "Agree the lead terms before any paid delivery",
        "Home and office moves",
      ],
      exampleLead: {
        area: "Santo Domingo",
        service: "Home move",
        urgency: "Flexible",
        scope:
          "Fictional example: a family asks for a quote to move an apartment between two Santo Domingo neighborhoods; volume, stair access and packing remain to be confirmed.",
      },
      qualification: [
        "Actual service request with contact permission",
        "Valid contact details and relevant service",
        "Area and scope supported by the provider",
        "Duplicate checks completed before a qualified label",
      ],
      leadModel:
        "Proposed pilot model: one qualified request reserved for one provider for a disclosed acceptance period. A charge would follow acceptance under agreed terms. Platform exclusivity does not mean the customer has contacted no other business. Terms must be published before activation.",
      commercialTerms: [
        "Lead fee and charging authorization: owner confirmation pending",
        "Acceptance period and spending limits: owner confirmation pending",
        "Credit reasons, evidence and claim period: owner confirmation pending",
      ],
      controls: [
        "Set service areas, supported work and capacity",
        "Pause opportunities when unavailable",
        "Review each offer and its terms before acceptance",
      ],
      workflow: [
        "Apply with your service information.",
        "Complete the review and required verification.",
        "Set coverage, preferences and capacity.",
        "Accept a suitable request under agreed terms.",
        "Contact the customer and discuss a quote.",
        "Report the outcome through the CRM.",
      ],
      faq: [
        {
          q: "Which jobs would I receive?",
          a: "Home and office moves. Packing and loading scope agreed in the quote. Furniture handling subject to access assessment.",
        },
        {
          q: "Does applying guarantee work?",
          a: "No. Application review, supported territory and current capacity are required before activation. Opportunities do not guarantee customer acceptance or revenue.",
        },
        {
          q: "Are requests exclusive?",
          a: "The proposed model reserves one qualified request for one provider for a disclosed period. The customer may independently contact other businesses. Final distribution terms must be agreed before activation.",
        },
        {
          q: "When would I pay?",
          a: "Only after accepting under the published charging terms and your authorization. The fee, spending limit and payment process are not yet approved; this preview cannot charge you.",
        },
        {
          q: "What counts as a poor lead?",
          a: "Proposed credit reasons include an invalid contact, a previously charged duplicate, wrong trade or an area outside the agreement. Evidence requirements and claim periods still need publication.",
        },
        {
          q: "Can I pause or close my account?",
          a: "Pause controls and an account-closure support process are required before launch. No account is activated by this preview.",
        },
        {
          q: "Who owns the customer relationship?",
          a: "You would receive access only to requests assigned to you under the agreed terms. Contact details must be used for that request; broader customer and platform rights must be stated in the provider agreement.",
        },
      ],
      confirmation:
        "Your application has been received for review. Keep the reference shown here. Lead delivery stays inactive until the review and agreed onboarding are complete.",
    },
    es: {
      name: "Mudanzas",
      headline: "Mudanzas: solicitudes en sus zonas",
      subhead:
        "Defina sus zonas, servicios y capacidad. Solicite acceso a oportunidades compatibles; la solicitud no activa el envío de contactos ni garantiza trabajo.",
      cta: "Recibir solicitudes de mudanza",
      fit: [
        "Profesionales independientes, equipos y empresas de este servicio",
        "Declare su cobertura, capacidad y credenciales aplicables",
        "Acepte las condiciones antes de recibir oportunidades con cargo",
        "Mudanzas de viviendas y oficinas",
      ],
      exampleLead: {
        area: "Santo Domingo",
        service: "Mudanza de vivienda",
        urgency: "Fecha flexible",
        scope:
          "Ejemplo ficticio: una familia solicita cotizar la mudanza de un apartamento entre dos sectores de Santo Domingo; el volumen, las escaleras y el embalaje quedan por confirmar.",
      },
      qualification: [
        "Solicitud real con permiso de contacto",
        "Datos de contacto válidos y servicio pertinente",
        "Zona y alcance que el proveedor pueda atender",
        "Revisión de duplicados antes de calificar la solicitud",
      ],
      leadModel:
        "Modelo propuesto para el piloto: una solicitud calificada reservada para un proveedor durante un plazo informado. El cargo seguiría a la aceptación bajo condiciones acordadas. La exclusividad de la plataforma no impide que el cliente contacte a otras empresas. Las condiciones deben publicarse antes de activar el servicio.",
      commercialTerms: [
        "Precio y autorización del cargo: pendientes de confirmación del responsable",
        "Plazo de aceptación y límites de gasto: pendientes de confirmación",
        "Motivos de crédito, pruebas y plazo de reclamación: pendientes de confirmación",
      ],
      controls: [
        "Defina zonas, servicios y capacidad",
        "Pause las oportunidades cuando no tenga disponibilidad",
        "Revise cada solicitud y sus condiciones antes de aceptar",
      ],
      workflow: [
        "Solicite acceso con la información de sus servicios.",
        "Complete la revisión y verificación requeridas.",
        "Defina cobertura, preferencias y capacidad.",
        "Acepte una solicitud adecuada bajo condiciones acordadas.",
        "Contacte al cliente y converse sobre la cotización.",
        "Registre el resultado en el CRM.",
      ],
      faq: [
        {
          q: "¿Qué trabajos podría recibir?",
          a: "Mudanzas de viviendas y oficinas. Embalaje y carga según la cotización. Manejo de muebles sujeto a evaluación del acceso.",
        },
        {
          q: "¿Solicitar acceso garantiza trabajo?",
          a: "No. Se requiere revisar la solicitud, la zona y la capacidad antes de activar el servicio. Una oportunidad no garantiza aceptación del cliente ni ingresos.",
        },
        {
          q: "¿Las solicitudes son exclusivas?",
          a: "El modelo propuesto reserva una solicitud calificada para un proveedor durante un plazo informado. El cliente puede contactar por su cuenta a otras empresas. Las condiciones finales deben acordarse antes de la activación.",
        },
        {
          q: "¿Cuándo tendría que pagar?",
          a: "Después de aceptar bajo condiciones de cobro publicadas y con su autorización. El precio, el límite de gasto y el proceso de pago aún no están aprobados; esta vista previa no puede cobrarle.",
        },
        {
          q: "¿Qué permite solicitar un crédito?",
          a: "Se proponen como motivos un contacto inválido, un duplicado ya cobrado, un servicio incorrecto o una zona fuera del acuerdo. Aún deben publicarse las pruebas y los plazos necesarios.",
        },
        {
          q: "¿Puedo pausar o cerrar mi cuenta?",
          a: "Antes del lanzamiento deben existir controles de pausa y un proceso de cierre con soporte. Esta vista previa no activa ninguna cuenta.",
        },
        {
          q: "¿Qué acceso tendré a los clientes?",
          a: "Solo tendría acceso a solicitudes que le hayan sido asignadas según las condiciones acordadas. Los datos se deben usar para esa solicitud; el contrato debe definir los demás derechos del cliente y de la plataforma.",
        },
      ],
      confirmation:
        "Recibimos su solicitud de acceso para revisión. Conserve la referencia mostrada. El envío de contactos seguirá inactivo hasta completar la revisión y el proceso acordado.",
    },
    fr: {
      name: "Déménagement",
      headline: "Déménagement : des demandes dans votre zone",
      subhead:
        "Définissez vos zones, services et disponibilités. Candidatez pour recevoir des demandes adaptées ; la candidature n’active aucun envoi et ne garantit aucun contrat.",
      cta: "Recevoir des demandes de déménagement",
      fit: [
        "Indépendants, équipes et entreprises proposant ce service",
        "Déclarez vos zones, votre capacité et les qualifications applicables",
        "Acceptez les conditions avant toute demande payante",
        "Déménagements de logements et de bureaux",
      ],
      exampleLead: {
        area: "Santo Domingo",
        service: "Déménagement de logement",
        urgency: "Date flexible",
        scope:
          "Exemple fictif : une famille demande un devis pour déménager un appartement entre deux quartiers de Santo Domingo ; volume, escaliers et emballage restent à préciser.",
      },
      qualification: [
        "Demande réelle avec autorisation de contact",
        "Coordonnées valides et service pertinent",
        "Zone et travaux pris en charge par le prestataire",
        "Doublons vérifiés avant qualification",
      ],
      leadModel:
        "Modèle pilote proposé : une demande qualifiée réservée à un prestataire pendant un délai annoncé. La facturation suivrait l’acceptation selon les conditions convenues. L’exclusivité de distribution n’empêche pas le client de contacter d’autres entreprises. Les conditions doivent être publiées avant activation.",
      commercialTerms: [
        "Tarif et autorisation de facturation : à confirmer par le responsable",
        "Délai d’acceptation et plafond de dépenses : à confirmer",
        "Motifs d’avoir, justificatifs et délai de réclamation : à confirmer",
      ],
      controls: [
        "Définissez vos zones, prestations et capacités",
        "Mettez les demandes en pause si vous êtes indisponible",
        "Examinez chaque demande et ses conditions avant d’accepter",
      ],
      workflow: [
        "Candidatez en décrivant vos services.",
        "Complétez les vérifications requises pour l’examen de votre candidature.",
        "Définissez zones, préférences et capacité.",
        "Acceptez une demande adaptée selon les conditions convenues.",
        "Contactez le client et discutez d’un devis.",
        "Renseignez le résultat dans le CRM.",
      ],
      faq: [
        {
          q: "Quelles demandes pourrais-je recevoir ?",
          a: "Déménagements de logements et de bureaux. Emballage et chargement définis au devis. Manutention des meubles selon les accès.",
        },
        {
          q: "Une candidature garantit-elle des contrats ?",
          a: "Non. La candidature, la zone et la capacité doivent être examinées avant activation. Une demande ne garantit ni acceptation du client ni revenu.",
        },
        {
          q: "Les demandes sont-elles exclusives ?",
          a: "Le modèle proposé réserve une demande qualifiée à un prestataire pendant un délai annoncé. Le client peut contacter d’autres entreprises de son côté. Les conditions définitives doivent être convenues avant activation.",
        },
        {
          q: "Quand devrais-je payer ?",
          a: "Après acceptation selon les conditions publiées et avec votre autorisation. Tarif, plafond de dépenses et paiement restent à approuver ; cet aperçu ne peut rien facturer.",
        },
        {
          q: "Quels motifs permettraient un avoir ?",
          a: "Les motifs proposés comprennent un contact invalide, un doublon déjà facturé, un mauvais métier ou une zone hors accord. Justificatifs et délais restent à publier.",
        },
        {
          q: "Puis-je suspendre ou fermer mon compte ?",
          a: "Des commandes de pause et une procédure de fermeture avec assistance sont requises avant le lancement. Cet aperçu n’active aucun compte.",
        },
        {
          q: "Quel accès aurai-je aux clients ?",
          a: "Vous n’auriez accès qu’aux demandes qui vous sont attribuées selon les conditions convenues. Les coordonnées doivent servir à cette demande ; les autres droits doivent être définis dans l’accord prestataire.",
        },
      ],
      confirmation:
        "Votre candidature a été reçue pour examen. Conservez la référence affichée. La réception de demandes reste inactive jusqu’à la fin de l’examen et des étapes convenues.",
    },
  },
  seasonal: [
    {
      trigger: "moving-lease-turnover",
      customer: {
        en: "Plan packing and transport around your lease dates.",
        es: "Organice el embalaje y el transporte según las fechas de su alquiler.",
        fr: "Préparez l’emballage et le transport selon les dates de votre bail.",
      },
      provider: {
        en: "Declare available capacity for this campaign before recruitment.",
        es: "Declare su capacidad disponible para esta campaña antes de captar solicitudes.",
        fr: "Déclarez votre capacité pour cette campagne avant de recevoir des demandes.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
