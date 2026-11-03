import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "security-systems",
  accent: "#425a6e",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Cámaras y alarmas",
      headline: "¿Necesita cámaras o alarmas en Santo Domingo?",
      subhead:
        "Cuéntenos qué inmueble desea evaluar y si tiene equipos instalados. Un especialista deberá revisar el alcance, la compatibilidad y las zonas de instalación antes de cotizar.",
      cta: "Cotizar cámaras y alarmas",
      subtypes: [
        {
          value: "camera-installation",
          label: "Instalación de cámaras",
        },
        {
          value: "alarm-installation",
          label: "Instalación de alarma",
        },
        {
          value: "security-maintenance",
          label: "Revisión o mantenimiento",
        },
        {
          value: "security-assessment",
          label: "Evaluación de sistema",
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
          key: "property-type",
          label: "Tipo de inmueble",
          type: "select",
          options: [
            {
              value: "home",
              label: "Vivienda",
            },
            {
              value: "shop-office",
              label: "Local u oficina",
            },
            {
              value: "shared-building",
              label: "Edificio compartido",
            },
          ],
          required: true,
        },
        {
          key: "existing-system",
          label: "Equipo existente; no incluya claves ni códigos",
          type: "text",
          required: false,
        },
      ],
      included: [
        "Consultas para instalar cámaras o alarmas en viviendas y negocios.",
        "Evaluación de equipos existentes y necesidades de mantenimiento.",
        "Definición de alcance, acceso y entrega de la configuración al responsable autorizado.",
      ],
      excluded: [
        "Prevención de delitos, vigilancia permanente o respuesta policial garantizadas.",
        "Suscripciones, monitoreo, conectividad o almacenamiento no incluidos en el acuerdo.",
        "Recepción de contraseñas, códigos, grabaciones privadas o acceso remoto desde este formulario.",
      ],
      priceFactors: [
        "Cantidad y tipo de dispositivos, cobertura y condiciones del inmueble.",
        "Cableado, alimentación, almacenamiento y compatibilidad de equipos.",
        "Acceso, configuración y mantenimiento expresamente incluidos.",
      ],
      steps: [
        "Describa el trabajo, su sector y la fecha que prefiere.",
        "Se revisarán la cobertura y la capacidad antes de proponer un proveedor.",
        "Consulte el alcance y la cotización; acuerde la visita directamente con el proveedor.",
      ],
      faq: [
        {
          q: "¿Atienden mi sector y cuándo me responderían?",
          a: "Santo Domingo es el mercado previsto. La cobertura, los horarios de atención y la capacidad están pendientes de confirmación. Esta vista previa no solicita una visita ni promete una respuesta en un plazo determinado.",
        },
        {
          q: "¿Quién prepara la cotización y cómo se paga?",
          a: "El proveedor independiente evaluaría el trabajo y explicaría materiales, mano de obra y posibles cargos de diagnóstico o visita antes de que usted acepte. Los importes y las condiciones de pago no están definidos en esta vista previa.",
        },
        {
          q: "¿Puedo elegir al proveedor y quién responde por el trabajo?",
          a: "Una solicitud no le obliga a contratar. Antes de aceptar, confirme quién realizará el servicio, qué incluye la cotización y qué garantía ofrece por escrito. La plataforma propone el contacto; el proveedor realiza el trabajo acordado.",
        },
        {
          q: "¿Cómo cambio o cancelo una solicitud o comunico un problema?",
          a: "Aquí puede revisar sus datos antes de continuar: no se envían. Antes de habilitar solicitudes reales se publicarán el canal de soporte y el procedimiento para editar, cancelar o reclamar. No se ha reservado una cita ni cobrado un servicio.",
        },
        {
          q: "¿La instalación incluye monitoreo y almacenamiento?",
          a: "No debe darse por hecho. Solicite que el presupuesto separe equipos, instalación, conectividad, almacenamiento y cualquier suscripción o monitoreo. Esta página no activa vigilancia ni respuesta a incidentes.",
        },
        {
          q: "¿Debo compartir claves o imágenes para pedir una cotización?",
          a: "No. Describa el inmueble y el equipo de forma general. Los accesos, las zonas de grabación y la entrega de credenciales deberán acordarse con el responsable autorizado por un canal apropiado; no incluya material privado en el formulario.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Security cameras and alarms",
      headline: "Need cameras or an alarm in Santo Domingo?",
      subhead:
        "Describe the property and any existing equipment. A specialist would need to review scope, compatibility and installation areas before quoting.",
      cta: "Get a security-system quote",
      subtypes: [
        {
          value: "camera-installation",
          label: "Camera installation",
        },
        {
          value: "alarm-installation",
          label: "Alarm installation",
        },
        {
          value: "security-maintenance",
          label: "Inspection or maintenance",
        },
        {
          value: "security-assessment",
          label: "System assessment",
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
          label: "Flexible timing",
        },
      ],
      extraFields: [
        {
          key: "property-type",
          label: "Property type",
          type: "select",
          options: [
            {
              value: "home",
              label: "Home",
            },
            {
              value: "shop-office",
              label: "Shop or office",
            },
            {
              value: "shared-building",
              label: "Shared building",
            },
          ],
          required: true,
        },
        {
          key: "existing-system",
          label: "Existing equipment; no passwords or codes",
          type: "text",
          required: false,
        },
      ],
      included: [
        "Camera and alarm installation inquiries for homes and businesses.",
        "Assessment of existing equipment and maintenance needs.",
        "Defining scope, access and configuration handover to an authorized person.",
      ],
      excluded: [
        "Guaranteed crime prevention, continuous monitoring or police response.",
        "Subscriptions, monitoring, connectivity or storage not included in the agreement.",
        "Passwords, codes, private recordings or remote access through this form.",
      ],
      priceFactors: [
        "Device number and type, intended coverage and property conditions.",
        "Cabling, power, storage and equipment compatibility.",
        "Access, configuration and expressly included maintenance.",
      ],
      steps: [
        "Describe the work, your area and preferred timing.",
        "Coverage and capacity would be checked before suggesting a provider.",
        "Discuss the scope and quote, then agree on a visit with the provider.",
      ],
      faq: [
        {
          q: "Do you cover my area, and when would someone respond?",
          a: "Santo Domingo is the intended market. Coverage, support hours and provider capacity still need confirmation. This preview does not request a visit or promise a response within a specific time.",
        },
        {
          q: "Who prepares the quote, and how is payment handled?",
          a: "The independent provider would assess the work and explain materials, labor and any assessment or visit charge before you agree. Prices and payment arrangements have not been set in this preview.",
        },
        {
          q: "Can I choose the provider, and who is responsible for the work?",
          a: "A request does not commit you to hiring anyone. Before accepting, confirm who will do the work, what the quote includes and any written workmanship warranty. The platform proposes a connection; the provider performs the agreed service.",
        },
        {
          q: "How do I change or cancel a request, or report a problem?",
          a: "You can review your details here; nothing is sent. Support contacts and the process for editing, cancelling or raising a complaint must be published before real requests open. No appointment has been booked and no service charged.",
        },
        {
          q: "Does installation include monitoring and storage?",
          a: "Do not assume so. Ask that the quote distinguish equipment, installation, connectivity, storage and any subscription or monitoring. This page does not activate surveillance or incident response.",
        },
        {
          q: "Should I share passwords or images to request a quote?",
          a: "No. Describe the property and equipment in general terms. Access, recording areas and credential handover must be agreed with an authorized person through an appropriate channel. Do not include private material in the form.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Caméras et alarmes",
      headline: "Des caméras ou une alarme à installer à Santo Domingo ?",
      subhead:
        "Décrivez le bien et les équipements existants. Un spécialiste devra examiner le périmètre, la compatibilité et les zones de pose avant de proposer un devis.",
      cta: "Demander un devis caméras et alarme",
      subtypes: [
        {
          value: "camera-installation",
          label: "Installation de caméras",
        },
        {
          value: "alarm-installation",
          label: "Installation d’alarme",
        },
        {
          value: "security-maintenance",
          label: "Contrôle ou entretien",
        },
        {
          value: "security-assessment",
          label: "Évaluation du système",
        },
      ],
      urgency: [
        {
          value: "today",
          label: "Aujourd’hui, selon les disponibilités",
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
          key: "property-type",
          label: "Type de bien",
          type: "select",
          options: [
            {
              value: "home",
              label: "Logement",
            },
            {
              value: "shop-office",
              label: "Commerce ou bureau",
            },
            {
              value: "shared-building",
              label: "Immeuble collectif",
            },
          ],
          required: true,
        },
        {
          key: "existing-system",
          label: "Équipement existant ; sans mot de passe ni code",
          type: "text",
          required: false,
        },
      ],
      included: [
        "Demandes de pose de caméras ou d’alarmes pour logements et entreprises.",
        "Évaluation des équipements existants et des besoins d’entretien.",
        "Définition du périmètre, des accès et de la remise de la configuration au responsable autorisé.",
      ],
      excluded: [
        "Prévention des délits, surveillance permanente ou intervention policière garanties.",
        "Abonnements, télésurveillance, connexion ou stockage non prévus dans l’accord.",
        "Transmission de mots de passe, codes, enregistrements privés ou accès à distance par ce formulaire.",
      ],
      priceFactors: [
        "Nombre et type d’appareils, couverture recherchée et état des lieux.",
        "Câblage, alimentation, stockage et compatibilité des équipements.",
        "Accès, configuration et entretien expressément inclus.",
      ],
      steps: [
        "Décrivez les travaux, votre quartier et la période souhaitée.",
        "La zone desservie et les disponibilités seront vérifiées avant de proposer un prestataire.",
        "Précisez le périmètre et le devis, puis convenez d’une visite avec le prestataire.",
      ],
      faq: [
        {
          q: "Mon quartier est-il desservi et quand recevrais-je une réponse ?",
          a: "Santo Domingo est le marché envisagé. Les zones desservies, les horaires d’assistance et les capacités des prestataires restent à confirmer. Cet aperçu ne demande aucune visite et ne promet aucun délai de réponse.",
        },
        {
          q: "Qui établit le devis et comment se règle la prestation ?",
          a: "Le prestataire indépendant évaluerait les travaux et préciserait les matériaux, la main-d’œuvre et les éventuels frais de diagnostic ou de déplacement avant votre accord. Aucun tarif ni mode de paiement n’est fixé dans cet aperçu.",
        },
        {
          q: "Puis-je choisir le prestataire et qui répond de son travail ?",
          a: "Une demande ne vous oblige pas à engager un prestataire. Avant d’accepter, vérifiez qui interviendra, ce que comprend le devis et les garanties écrites proposées. La plateforme propose une mise en relation ; le prestataire réalise la prestation convenue.",
        },
        {
          q: "Comment modifier ou annuler une demande, ou signaler un problème ?",
          a: "Vous pouvez vérifier vos informations ici : rien n’est envoyé. Les coordonnées de l’assistance et les procédures de modification, d’annulation et de réclamation devront être publiées avant l’ouverture du service. Aucun rendez-vous n’est réservé et aucune prestation n’est facturée.",
        },
        {
          q: "La pose comprend-elle la surveillance et le stockage ?",
          a: "Ce n’est pas implicite. Demandez que le devis distingue matériel, pose, connexion, stockage et tout abonnement ou service de surveillance. Cette page n’active ni surveillance ni intervention sur incident.",
        },
        {
          q: "Faut-il transmettre des mots de passe ou des images pour un devis ?",
          a: "Non. Décrivez le bien et les équipements de manière générale. Les accès, les zones filmées et la remise des identifiants devront être convenus avec le responsable autorisé par un canal approprié. N’insérez aucun contenu privé dans le formulaire.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Cámaras y alarmas",
      headline: "Conecte con proyectos de cámaras y alarmas.",
      subhead:
        "Declare los equipos y tipos de inmueble que atiende. Las consultas se evaluarían por zona, compatibilidad y alcance de instalación o mantenimiento.",
      cta: "Postular para cámaras y alarmas",
      fit: [
        "Instaladores y empresas de cámaras y alarmas.",
        "Especialistas que documentan compatibilidad, configuración y entrega al cliente.",
        "Equipos que distinguen instalación, mantenimiento y servicios de monitoreo separados.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Cámaras y alarmas",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: responsable de una oficina solicita evaluar cámaras en accesos autorizados; cantidad, equipos y alcance por definir.",
      },
      qualification: [
        "Solicitud real y alcance identificable, comprobados antes de ofrecerla como calificada.",
        "Datos de contacto válidos y permiso para compartir la solicitud con un proveedor independiente.",
        "Servicio, zona, horario y capacidad compatibles con lo declarado por el proveedor.",
        "Comprobación de duplicados y exclusiones; una consulta sin validar no se etiqueta como calificada.",
      ],
      leadModel:
        "Modelo propuesto, pendiente de aprobación: una solicitud calificada se reserva para un proveedor durante un plazo informado. Solo habría un cargo después de su aceptación y autorización. La exclusividad limita nuestra distribución de esa solicitud; no significa que el cliente no haya contactado a otros negocios.",
      commercialTerms: [
        "[OWNER: lead price] Precio por solicitud aceptada pendiente; no se cobra en esta vista previa.",
        "[OWNER: acceptance window] Plazo de aceptación pendiente; debe conocerse antes de decidir.",
        "[OWNER: credit window] Plazo y pruebas para solicitar crédito pendientes de publicación.",
        "Límites de gasto, autorización de cobro y condiciones de crédito deben aprobarse antes de activar el servicio. Aceptar una oportunidad no garantiza contratación ni ingresos.",
      ],
      controls: [
        "Declare zonas, servicios y capacidad disponibles; no reciba trabajo fuera del alcance acordado.",
        "Solicite una pausa o cambie preferencias mediante los controles que se habiliten antes del lanzamiento.",
        "Revise el límite de gasto y rechace solicitudes que no encajen antes de aceptar.",
      ],
      workflow: [
        "Presente los datos de su negocio o actividad.",
        "Complete la revisión y los requisitos de verificación que se publiquen.",
        "Defina zonas, servicios, idiomas y capacidad.",
        "Revise las condiciones y acepte solo las solicitudes adecuadas.",
        "Contacte al cliente cuando se autorice el acceso a sus datos.",
        "Registre en el CRM el contacto, la cotización y el resultado.",
      ],
      faq: [
        {
          q: "¿Postularme activa mi cuenta o garantiza trabajo?",
          a: "No. La postulación se revisaría antes de cualquier activación. La identidad, las capacidades y los requisitos de verificación deben comprobarse; no hay volumen de solicitudes, contratación ni ingresos garantizados.",
        },
        {
          q: "¿La solicitud será exclusiva y a quién pertenecen los datos?",
          a: "El modelo propuesto reserva una solicitud a un proveedor según las condiciones publicadas. El cliente puede contactar otros negocios por su cuenta. Sus datos solo se usarían para atender la solicitud autorizada; no se concede permiso para revenderlos ni hacer promociones.",
        },
        {
          q: "¿Cuándo se cobra y qué ocurre con una solicitud incorrecta?",
          a: "El cargo propuesto ocurriría después de aceptar y autorizarlo. El precio, el plazo de aceptación y la política de créditos siguen pendientes. Los duplicados, datos inválidos o solicitudes fuera del alcance se revisarían con evidencia; una oportunidad sin venta no equivale por sí sola a un error.",
        },
        {
          q: "¿Puedo pausar las solicitudes o cerrar mi cuenta?",
          a: "Las condiciones finales deben explicar pausas, cambios de capacidad y cierre, así como el tratamiento de solicitudes ya aceptadas. Esta vista previa no crea una cuenta activa, suscripción ni compromiso de pago.",
        },
        {
          q: "¿Cómo se resolverían dudas o disputas?",
          a: "El propietario debe publicar un canal de soporte, horarios y un procedimiento de revisión antes del lanzamiento. Guarde el alcance y las condiciones acordadas; los resultados se registrarían en el CRM, sin prometer una decisión favorable ni un plazo aún no definido.",
        },
        {
          q: "¿Aceptar una consulta me autoriza a acceder al sistema del cliente?",
          a: "No. La autorización de contacto es distinta del acceso a cámaras, alarmas o grabaciones. Acuerde el alcance con la persona responsable y use un proceso separado para credenciales; no las registre en notas de la oportunidad.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Security cameras and alarms",
      headline: "Find camera and alarm installation inquiries.",
      subhead:
        "Declare supported equipment and property types. Proposed matching would consider area, compatibility and installation or maintenance scope.",
      cta: "Apply for security-installation leads",
      fit: [
        "Camera and alarm installers and service companies.",
        "Specialists who document compatibility, configuration and client handover.",
        "Teams separating installation, maintenance and monitoring services.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Security cameras and alarms",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: an office manager wants cameras assessed for authorized entrances; device count, equipment and scope remain undecided.",
      },
      qualification: [
        "A genuine request and identifiable scope, checked before it is offered as qualified.",
        "Valid contact details and permission to share the request with an independent provider.",
        "Service, area, hours and capacity compatible with the provider's declared scope.",
        "Duplicate and exclusion checks; an unverified inquiry is not labelled qualified.",
      ],
      leadModel:
        "Proposed model, pending approval: one qualified request is reserved for one provider for a disclosed acceptance period. A charge would occur only after acceptance and authorization. Exclusivity limits our distribution of that request; it does not mean the customer has contacted no other business.",
      commercialTerms: [
        "[OWNER: lead price] Price per accepted request is pending; this preview charges nothing.",
        "[OWNER: acceptance window] Acceptance period is pending and must be disclosed before a decision.",
        "[OWNER: credit window] Credit request period and evidence requirements await publication.",
        "Spending limits, billing authorization and credit terms need approval before activation. Accepting an opportunity does not guarantee a job or revenue.",
      ],
      controls: [
        "Declare supported areas, services and current capacity; stay within your agreed scope.",
        "Request a pause or change preferences through controls to be provided before launch.",
        "Review your spending limit and decline unsuitable requests before accepting.",
      ],
      workflow: [
        "Submit your business or independent professional details.",
        "Complete the review and the verification requirements once published.",
        "Set your areas, services, languages and capacity.",
        "Review the terms and accept only suitable requests.",
        "Contact the customer once access to their details is authorized.",
        "Record contact, quote and outcome in the CRM.",
      ],
      faq: [
        {
          q: "Does applying activate an account or guarantee work?",
          a: "No. An application would be reviewed before activation. Identity, capabilities and verification requirements must be checked; no volume of requests, jobs or revenue is guaranteed.",
        },
        {
          q: "Is a request exclusive, and who controls the customer data?",
          a: "The proposed model reserves a request for one provider under published terms. Customers may contact other businesses themselves. Their details would be used only for the authorized service request; there is no permission to resell them or send promotions.",
        },
        {
          q: "When would I be charged, and what if a request is unsuitable?",
          a: "The proposed charge occurs after acceptance and billing authorization. Price, acceptance period and credit rules are still pending. Duplicates, invalid details or requests outside the agreed scope would be reviewed against evidence; a request that does not become a sale is not automatically invalid.",
        },
        {
          q: "Can I pause requests or close my account?",
          a: "Final terms must explain pauses, capacity changes and closure, including how previously accepted requests are handled. This preview does not create an active account, subscription or payment commitment.",
        },
        {
          q: "How would questions or disputes be handled?",
          a: "The owner must publish a support channel, operating hours and a review procedure before launch. Keep the agreed scope and terms; outcomes would be recorded in the CRM. No favorable decision or unconfirmed response deadline is promised.",
        },
        {
          q: "Does accepting an inquiry authorize access to the customer's system?",
          a: "No. Permission to make contact is separate from access to cameras, alarms or recordings. Agree scope with the responsible person and use a separate credential process; do not put credentials in opportunity notes.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Caméras et alarmes",
      headline: "Des projets de caméras et d’alarmes dans votre domaine.",
      subhead:
        "Précisez les équipements et les types de biens pris en charge. La zone, la compatibilité et le périmètre de pose ou d’entretien guideraient la sélection.",
      cta: "Proposer la pose de caméras et alarmes",
      fit: [
        "Installateurs et entreprises de caméras et d’alarmes.",
        "Spécialistes documentant compatibilité, configuration et remise au client.",
        "Équipes distinguant pose, entretien et services de surveillance.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Caméras et alarmes",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : le responsable d’un bureau souhaite évaluer des caméras aux entrées autorisées ; nombre, matériel et périmètre à définir.",
      },
      qualification: [
        "Une demande réelle et un périmètre identifiable, vérifiés avant de la présenter comme qualifiée.",
        "Des coordonnées valides et l’autorisation de transmettre la demande à un prestataire indépendant.",
        "Une prestation, une zone, des horaires et une capacité compatibles avec ceux déclarés par le prestataire.",
        "La vérification des doublons et des exclusions ; une demande non vérifiée n’est pas qualifiée.",
      ],
      leadModel:
        "Modèle proposé, à approuver : une demande qualifiée est réservée à un prestataire pendant un délai annoncé. Une facturation ne pourrait intervenir qu’après acceptation et autorisation. L’exclusivité limite notre diffusion de cette demande ; elle ne signifie pas que le client n’a contacté aucune autre entreprise.",
      commercialTerms: [
        "[OWNER: lead price] Le tarif par demande acceptée reste à définir ; cet aperçu ne facture rien.",
        "[OWNER: acceptance window] Le délai d’acceptation reste à définir et doit être annoncé avant toute décision.",
        "[OWNER: credit window] Le délai de demande d’avoir et les justificatifs attendent leur publication.",
        "Les plafonds de dépenses, l’autorisation de facturation et les conditions d’avoir doivent être approuvés avant l’activation. Accepter une opportunité ne garantit ni chantier ni revenu.",
      ],
      controls: [
        "Déclarez vos zones, vos prestations et votre capacité ; respectez le périmètre convenu.",
        "Demandez une pause ou modifiez vos préférences grâce aux fonctions qui devront être disponibles avant le lancement.",
        "Vérifiez votre plafond de dépenses et refusez les demandes inadaptées avant de les accepter.",
      ],
      workflow: [
        "Présentez votre entreprise ou votre activité indépendante.",
        "Effectuez les vérifications et l’examen du dossier selon les exigences qui seront publiées.",
        "Définissez vos zones, vos prestations, vos langues et votre capacité.",
        "Examinez les conditions et acceptez uniquement les demandes adaptées.",
        "Contactez le client une fois l’accès à ses coordonnées autorisé.",
        "Consignez le contact, le devis et le résultat dans le CRM.",
      ],
      faq: [
        {
          q: "Ma candidature active-t-elle un compte ou garantit-elle des missions ?",
          a: "Non. Le dossier serait examiné avant toute activation. L’identité, les compétences et les exigences de vérification doivent être contrôlées. Aucun volume de demandes, aucune mission ni aucun revenu ne sont garantis.",
        },
        {
          q: "La demande est-elle exclusive et comment utiliser les coordonnées ?",
          a: "Le modèle proposé réserve une demande à un prestataire selon les conditions publiées. Le client peut lui-même contacter d’autres entreprises. Ses coordonnées ne serviraient qu’à traiter la demande autorisée ; leur revente et leur utilisation promotionnelle ne sont pas autorisées.",
        },
        {
          q: "Quand serais-je facturé et que faire d’une demande inadaptée ?",
          a: "La facturation proposée interviendrait après acceptation et autorisation. Le tarif, le délai d’acceptation et les règles d’avoir restent à définir. Les doublons, les coordonnées invalides et les demandes hors périmètre seraient examinés sur justificatifs. L’absence de vente ne rend pas une demande automatiquement invalide.",
        },
        {
          q: "Puis-je suspendre les demandes ou fermer mon compte ?",
          a: "Les conditions finales doivent préciser les pauses, les changements de capacité et la fermeture, ainsi que le traitement des demandes déjà acceptées. Cet aperçu ne crée ni compte actif, ni abonnement, ni engagement de paiement.",
        },
        {
          q: "Comment les questions ou les litiges seraient-ils traités ?",
          a: "Le propriétaire doit publier un canal d’assistance, des horaires et une procédure d’examen avant le lancement. Conservez le périmètre et les conditions convenus ; les résultats seraient enregistrés dans le CRM. Aucune issue favorable ni aucun délai encore non défini ne sont promis.",
        },
        {
          q: "Accepter une demande autorise-t-il l’accès au système du client ?",
          a: "Non. L’autorisation de contact est distincte de l’accès aux caméras, aux alarmes ou aux images. Convenez du périmètre avec le responsable et utilisez une procédure séparée pour les identifiants ; ne les inscrivez pas dans les notes de l’opportunité.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "property-security-planning",
      customer: {
        es: "Antes de abrir un local o planificar un viaje, describa el sistema que desea evaluar; no se prometen vigilancia activa ni prevención de incidentes.",
        en: "Before opening a business or planning travel, describe the system you want assessed; active monitoring and incident prevention are not promised.",
        fr: "Avant l’ouverture d’un commerce ou un voyage, décrivez le système à étudier ; aucune surveillance active ni prévention d’incident n’est promise.",
      },
      provider: {
        es: "Actualice disponibilidad y equipos compatibles para aperturas de negocios o revisiones programadas, separando instalación de monitoreo.",
        en: "Update availability and compatible equipment for business openings or scheduled reviews, keeping installation separate from monitoring.",
        fr: "Actualisez disponibilités et matériels compatibles pour les ouvertures ou les contrôles programmés, en séparant pose et surveillance.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
