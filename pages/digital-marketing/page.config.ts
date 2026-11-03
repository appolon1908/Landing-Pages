import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "digital-marketing",
  accent: "#176257",
  layout: "customer-provider",
  group: "business",
  pilot: false,
  customer: {
    en: {
      name: "Websites and digital marketing",
      headline: "Planning a digital project in Santo Domingo?",
      subhead:
        "Describe your business goal, current website or channels and project scope. An agency or freelancer can discuss an approach, deliverables and quote.",
      cta: "Request a growth consultation",
      subtypes: [
        {
          value: "website",
          label: "Website project",
        },
        {
          value: "campaign",
          label: "Marketing campaign",
        },
        {
          value: "digital-sales",
          label: "Digital sales improvement",
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
          key: "project-goal",
          type: "text",
          required: true,
          label: "Main business goal",
        },
      ],
      included: [
        "Website and campaign planning",
        "Defined design, development or marketing deliverables",
        "Handover, reporting and access arrangements",
      ],
      excluded: [
        "Ad spend, hosting, licenses and ongoing maintenance are separate unless quoted. Rankings, revenue and campaign results are not guaranteed. Never share account passwords in the form.",
      ],
      priceFactors: [
        "Scope and required integrations",
        "Content, design and delivery schedule",
        "Reporting, support and recurring services",
      ],
      steps: [
        "Describe the work and your area.",
        "We check for an eligible provider.",
        "Discuss a quote and agree any appointment directly.",
      ],
      faq: [
        {
          q: "What should I describe in my request?",
          a: "Describe your business goal, current website or channels and project scope. An agency or freelancer can discuss an approach, deliverables and quote.",
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
          a: "Ad spend, hosting, licenses and ongoing maintenance are separate unless quoted. Rankings, revenue and campaign results are not guaranteed. Never share account passwords in the form.",
        },
      ],
      confirmation:
        "Your request has been received for matching review. Keep the reference shown here. An appointment is confirmed only when you and the provider agree.",
    },
    es: {
      name: "Sitios web y marketing digital",
      headline: "¿Planea un proyecto digital en Santo Domingo?",
      subhead:
        "Describa su objetivo comercial, su sitio o canales actuales y el alcance del proyecto. Una agencia o profesional independiente podrá proponer entregables y una cotización.",
      cta: "Consultar sobre mi proyecto digital",
      subtypes: [
        {
          value: "website",
          label: "Proyecto de sitio web",
        },
        {
          value: "campaign",
          label: "Campaña de marketing",
        },
        {
          value: "digital-sales",
          label: "Mejora de ventas digitales",
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
          key: "project-goal",
          type: "text",
          required: true,
          label: "Objetivo comercial principal",
        },
      ],
      included: [
        "Planificación de sitios web y campañas",
        "Entregables definidos de diseño, desarrollo o marketing",
        "Acuerdos de entrega, informes y acceso",
      ],
      excluded: [
        "La inversión publicitaria, el alojamiento, las licencias y el mantenimiento son aparte salvo que se coticen. No se garantizan posiciones, ingresos ni resultados. No comparta contraseñas en el formulario.",
      ],
      priceFactors: [
        "Alcance e integraciones necesarias",
        "Contenido, diseño y plazo de entrega",
        "Informes, soporte y servicios recurrentes",
      ],
      steps: [
        "Describa el trabajo y su sector.",
        "Revisamos si hay un proveedor adecuado.",
        "Converse sobre la cotización y acuerde la cita directamente.",
      ],
      faq: [
        {
          q: "¿Qué debo describir en mi solicitud?",
          a: "Describa su objetivo comercial, su sitio o canales actuales y el alcance del proyecto. Una agencia o profesional independiente podrá proponer entregables y una cotización.",
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
          a: "La inversión publicitaria, el alojamiento, las licencias y el mantenimiento son aparte salvo que se coticen. No se garantizan posiciones, ingresos ni resultados. No comparta contraseñas en el formulario.",
        },
      ],
      confirmation:
        "Recibimos su solicitud para revisar si hay un proveedor adecuado. Conserve la referencia mostrada. La cita solo se confirma cuando usted y el proveedor la acuerdan.",
    },
    fr: {
      name: "Sites web et marketing numérique",
      headline: "Un projet numérique à Santo Domingo ?",
      subhead:
        "Décrivez votre objectif, votre site ou vos canaux actuels et le périmètre du projet. Une agence ou un indépendant pourra proposer une approche, des livrables et un devis.",
      cta: "Discuter de mon projet numérique",
      subtypes: [
        {
          value: "website",
          label: "Projet de site web",
        },
        {
          value: "campaign",
          label: "Campagne marketing",
        },
        {
          value: "digital-sales",
          label: "Amélioration des ventes en ligne",
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
          key: "project-goal",
          type: "text",
          required: true,
          label: "Objectif commercial principal",
        },
      ],
      included: [
        "Préparation de sites et de campagnes",
        "Livrables définis en conception, développement ou marketing",
        "Modalités de remise, de suivi et d’accès",
      ],
      excluded: [
        "Budget publicitaire, hébergement, licences et maintenance sont distincts sauf mention au devis. Aucun classement, chiffre d’affaires ou résultat n’est garanti. Ne partagez pas de mots de passe.",
      ],
      priceFactors: [
        "Périmètre et intégrations nécessaires",
        "Contenu, conception et calendrier",
        "Rapports, assistance et prestations récurrentes",
      ],
      steps: [
        "Décrivez le travail et votre quartier.",
        "Nous vérifions si un prestataire peut répondre.",
        "Discutez du devis et convenez directement du rendez-vous.",
      ],
      faq: [
        {
          q: "Que dois-je préciser dans ma demande ?",
          a: "Décrivez votre objectif, votre site ou vos canaux actuels et le périmètre du projet. Une agence ou un indépendant pourra proposer une approche, des livrables et un devis.",
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
          a: "Budget publicitaire, hébergement, licences et maintenance sont distincts sauf mention au devis. Aucun classement, chiffre d’affaires ou résultat n’est garanti. Ne partagez pas de mots de passe.",
        },
      ],
      confirmation:
        "Votre demande a été reçue pour rechercher un prestataire adapté. Conservez la référence affichée. Un rendez-vous n’est confirmé qu’après accord entre vous et le prestataire.",
    },
  },
  provider: {
    en: {
      name: "Websites and digital marketing",
      headline: "Websites and digital marketing: requests in your service area",
      subhead:
        "Set your service areas, capabilities and capacity. Apply for matching opportunities; an application does not activate lead delivery or guarantee work.",
      cta: "Apply for digital-service leads",
      fit: [
        "Independent professionals, teams and companies that provide this service",
        "Declare your coverage, capacity and relevant credentials",
        "Agree the lead terms before any paid delivery",
        "Website and campaign planning",
      ],
      exampleLead: {
        area: "Santo Domingo",
        service: "Website project",
        urgency: "Flexible",
        scope:
          "Fictional example: a small business wants to refresh its website to explain its services; content, scope, authorized access and deliverables remain to be agreed.",
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
          a: "Website and campaign planning. Defined design, development or marketing deliverables. Handover, reporting and access arrangements.",
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
      name: "Sitios web y marketing digital",
      headline: "Sitios web y marketing digital: solicitudes en sus zonas",
      subhead:
        "Defina sus zonas, servicios y capacidad. Solicite acceso a oportunidades compatibles; la solicitud no activa el envío de contactos ni garantiza trabajo.",
      cta: "Recibir solicitudes digitales",
      fit: [
        "Profesionales independientes, equipos y empresas de este servicio",
        "Declare su cobertura, capacidad y credenciales aplicables",
        "Acepte las condiciones antes de recibir oportunidades con cargo",
        "Planificación de sitios web y campañas",
      ],
      exampleLead: {
        area: "Santo Domingo",
        service: "Proyecto de sitio web",
        urgency: "Fecha flexible",
        scope:
          "Ejemplo ficticio: un pequeño negocio solicita renovar su sitio web para explicar sus servicios; contenidos, alcance, accesos autorizados y entregables quedan por acordar.",
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
          a: "Planificación de sitios web y campañas. Entregables definidos de diseño, desarrollo o marketing. Acuerdos de entrega, informes y acceso.",
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
      name: "Sites web et marketing numérique",
      headline:
        "Sites web et marketing numérique : des demandes dans votre zone",
      subhead:
        "Définissez vos zones, services et disponibilités. Candidatez pour recevoir des demandes adaptées ; la candidature n’active aucun envoi et ne garantit aucun contrat.",
      cta: "Recevoir des demandes numériques",
      fit: [
        "Indépendants, équipes et entreprises proposant ce service",
        "Déclarez vos zones, votre capacité et les qualifications applicables",
        "Acceptez les conditions avant toute demande payante",
        "Préparation de sites et de campagnes",
      ],
      exampleLead: {
        area: "Santo Domingo",
        service: "Projet de site web",
        urgency: "Date flexible",
        scope:
          "Exemple fictif : une petite entreprise souhaite revoir son site pour présenter ses services ; contenu, périmètre, accès autorisés et livrables restent à convenir.",
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
          a: "Préparation de sites et de campagnes. Livrables définis en conception, développement ou marketing. Modalités de remise, de suivi et d’accès.",
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
      trigger: "business-planning",
      customer: {
        en: "Plan digital projects around business launches and annual goals.",
        es: "Planifique proyectos digitales según lanzamientos y objetivos anuales.",
        fr: "Planifiez vos projets numériques selon vos lancements et objectifs annuels.",
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
