import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "locksmith",
  accent: "#64614e",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Cerrajería",
      headline: "¿Necesita ayuda con una cerradura en Santo Domingo?",
      subhead:
        "Describa el cierre y el problema sin compartir llaves, códigos ni datos de alarma. La identidad, la autorización de acceso y la disponibilidad deben comprobarse antes del servicio.",
      cta: "Solicitar ayuda de cerrajería",
      subtypes: [
        {
          value: "lock-repair",
          label: "Reparación de cerradura",
        },
        {
          value: "lock-replacement",
          label: "Cambio de cerradura",
        },
        {
          value: "authorized-access",
          label: "Asistencia de acceso autorizado",
        },
        {
          value: "lock-assessment",
          label: "Evaluación de cierres",
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
          key: "property-access-type",
          label: "Tipo de puerta o acceso",
          type: "select",
          options: [
            {
              value: "home",
              label: "Vivienda",
            },
            {
              value: "commercial",
              label: "Local u oficina",
            },
            {
              value: "other",
              label: "Otro acceso por confirmar",
            },
          ],
          required: true,
        },
        {
          key: "lock-description",
          label: "Tipo de cerradura o problema; no incluya códigos",
          type: "text",
          required: false,
        },
      ],
      included: [
        "Consultas de reparación o sustitución de cerraduras.",
        "Evaluación de cierres en viviendas y locales.",
        "Asistencia de acceso sujeta a comprobar identidad y autorización.",
      ],
      excluded: [
        "Acceso sin autorización comprobable o envío de instrucciones para vulnerar cerraduras.",
        "Servicio inmediato, llegada garantizada o apertura sin daños prometida.",
        "Trabajos sobre cajas fuertes, alarmas u otros sistemas fuera de la especialidad declarada.",
      ],
      priceFactors: [
        "Tipo de puerta, cerradura y problema observado.",
        "Diagnóstico, piezas y trabajo de ajuste o sustitución.",
        "Acceso al lugar y condiciones de la visita acordada.",
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
          q: "¿Qué debo demostrar para recibir ayuda de acceso?",
          a: "El proveedor deberá verificar su identidad y autorización mediante el procedimiento que corresponda antes de intervenir. No envíe documentos sensibles ni códigos en este formulario; el canal y los requisitos se indicarán antes del servicio.",
        },
        {
          q: "¿La solicitud garantiza apertura inmediata o sin daños?",
          a: "No. La disponibilidad, el método y el alcance deben evaluarse. Pida que el proveedor explique alternativas, posibles daños y costos antes de autorizar cualquier intervención.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Locksmith services",
      headline: "Need help with a lock in Santo Domingo?",
      subhead:
        "Describe the lock and problem without sharing keys, access codes or alarm details. Identity, access authorization and availability must be checked before service.",
      cta: "Request locksmith help",
      subtypes: [
        {
          value: "lock-repair",
          label: "Lock repair",
        },
        {
          value: "lock-replacement",
          label: "Lock replacement",
        },
        {
          value: "authorized-access",
          label: "Authorized access assistance",
        },
        {
          value: "lock-assessment",
          label: "Lock assessment",
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
          key: "property-access-type",
          label: "Type of door or access",
          type: "select",
          options: [
            {
              value: "home",
              label: "Home",
            },
            {
              value: "commercial",
              label: "Shop or office",
            },
            {
              value: "other",
              label: "Other access to confirm",
            },
          ],
          required: true,
        },
        {
          key: "lock-description",
          label: "Lock type or problem; do not include codes",
          type: "text",
          required: false,
        },
      ],
      included: [
        "Lock repair or replacement inquiries.",
        "Assessment of locks in homes and business premises.",
        "Access assistance subject to identity and authorization checks.",
      ],
      excluded: [
        "Access without verifiable permission or instructions for defeating locks.",
        "Guaranteed dispatch, arrival time or damage-free opening.",
        "Safes, alarms or other systems outside the declared specialty.",
      ],
      priceFactors: [
        "Door and lock type and the reported issue.",
        "Diagnosis, parts and adjustment or replacement work.",
        "Site access and the agreed visit conditions.",
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
          q: "What must I show to receive access assistance?",
          a: "The provider would need to verify identity and access authorization through the appropriate procedure before doing any work. Do not send sensitive documents or codes in this form; the requirements and channel must be explained before service.",
        },
        {
          q: "Does a request guarantee immediate or damage-free opening?",
          a: "No. Availability, method and scope need assessment. Ask the provider to explain alternatives, potential damage and charges before authorizing work.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Serrurerie",
      headline: "Besoin d’un serrurier à Santo Domingo ?",
      subhead:
        "Décrivez la serrure et le problème sans transmettre de clé, code ou donnée d’alarme. L’identité, l’autorisation d’accès et la disponibilité doivent être vérifiées avant la prestation.",
      cta: "Demander une aide en serrurerie",
      subtypes: [
        {
          value: "lock-repair",
          label: "Réparation de serrure",
        },
        {
          value: "lock-replacement",
          label: "Remplacement de serrure",
        },
        {
          value: "authorized-access",
          label: "Assistance pour accès autorisé",
        },
        {
          value: "lock-assessment",
          label: "Évaluation des fermetures",
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
          key: "property-access-type",
          label: "Type de porte ou d’accès",
          type: "select",
          options: [
            {
              value: "home",
              label: "Logement",
            },
            {
              value: "commercial",
              label: "Commerce ou bureau",
            },
            {
              value: "other",
              label: "Autre accès à préciser",
            },
          ],
          required: true,
        },
        {
          key: "lock-description",
          label: "Type de serrure ou problème ; sans code d’accès",
          type: "text",
          required: false,
        },
      ],
      included: [
        "Demandes de réparation ou de remplacement de serrures.",
        "Évaluation des fermetures de logements ou de locaux.",
        "Assistance à l’accès sous réserve de vérifier identité et autorisation.",
      ],
      excluded: [
        "Accès sans autorisation vérifiable ou instructions de contournement de serrure.",
        "Déplacement immédiat, délai d’arrivée ou ouverture sans dégât garantis.",
        "Coffres, alarmes ou autres dispositifs hors de la spécialité déclarée.",
      ],
      priceFactors: [
        "Type de porte, de serrure et problème constaté.",
        "Diagnostic, pièces et travaux de réglage ou de remplacement.",
        "Accès au lieu et conditions de visite convenues.",
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
          q: "Que faut-il justifier pour obtenir une aide à l’accès ?",
          a: "Le prestataire devra vérifier l’identité et l’autorisation d’accès selon la procédure applicable avant toute intervention. N’envoyez ni document sensible ni code dans ce formulaire ; les exigences et le canal seront précisés avant le service.",
        },
        {
          q: "La demande garantit-elle une ouverture immédiate et sans dégât ?",
          a: "Non. La disponibilité, la méthode et le périmètre doivent être évalués. Demandez au prestataire d’expliquer les solutions possibles, les dégâts éventuels et les frais avant d’autoriser l’intervention.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Cerrajería",
      headline: "Reciba consultas de cerrajería dentro de su especialidad.",
      subhead:
        "Declare los cierres y tareas que atiende, sus zonas y horarios. Cada oportunidad requeriría comprobar autorización de acceso antes de cualquier intervención.",
      cta: "Postular para cerrajería",
      fit: [
        "Cerrajeros y empresas de reparación o sustitución de cerraduras.",
        "Profesionales con un procedimiento de verificación de identidad y acceso.",
        "Negocios que explican alcance, posibles daños y alternativas antes del trabajo.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Cerrajería",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: responsable de un local solicita evaluar una cerradura que se atasca; autorización y tipo de cierre pendientes de comprobar.",
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
          q: "¿La plataforma sustituye mi comprobación de autorización?",
          a: "No. El contacto y la solicitud no prueban por sí solos el derecho de acceso. Antes de intervenir debe aplicarse el procedimiento de verificación; no se deben solicitar ni almacenar códigos o llaves en notas públicas.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Locksmith services",
      headline: "Find locksmith inquiries within your specialty.",
      subhead:
        "Declare the locks and tasks you service, your areas and hours. Each opportunity would require access authorization checks before any intervention.",
      cta: "Apply for locksmith leads",
      fit: [
        "Locksmiths and companies repairing or replacing locks.",
        "Professionals with an identity and access-verification procedure.",
        "Businesses that explain scope, potential damage and alternatives before work.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Locksmith services",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: a shop manager requests assessment of a sticking lock; authority and lock type await verification.",
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
          q: "Does platform intake replace my authorization checks?",
          a: "No. A request and contact details do not themselves establish access rights. Apply the verification procedure before working; access codes and keys must not be requested or stored in public notes.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Serrurerie",
      headline: "Des demandes de serrurerie adaptées à votre spécialité.",
      subhead:
        "Déclarez les serrures et tâches prises en charge, vos zones et vos horaires. Toute opportunité nécessiterait une vérification de l’autorisation d’accès avant intervention.",
      cta: "Proposer mes services de serrurerie",
      fit: [
        "Serruriers et entreprises de réparation ou de remplacement de serrures.",
        "Professionnels disposant d’une procédure de vérification de l’identité et de l’accès.",
        "Entreprises expliquant périmètre, dégâts possibles et solutions avant les travaux.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Serrurerie",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : le responsable d’un commerce souhaite faire examiner une serrure qui se bloque ; autorisation et type de serrure à vérifier.",
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
          q: "La plateforme remplace-t-elle ma vérification d’autorisation ?",
          a: "Non. Une demande et des coordonnées ne prouvent pas à elles seules le droit d’accès. Appliquez la procédure de vérification avant d’intervenir ; ne demandez ni ne conservez de codes ou de clés dans des notes publiques.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "move-security-review",
      customer: {
        es: "Al mudarse o revisar los cierres de un inmueble, describa la necesidad y la autorización de acceso; no se presume disponibilidad inmediata.",
        en: "When moving or reviewing a property's locks, describe the need and authorized access; immediate availability is not assumed.",
        fr: "Lors d’un déménagement ou d’un examen des fermetures, décrivez le besoin et l’accès autorisé ; aucune disponibilité immédiate n’est présumée.",
      },
      provider: {
        es: "Revise zonas, horarios y tipos de cierre atendidos para consultas por mudanzas, manteniendo el control de autorización antes de intervenir.",
        en: "Review service areas, hours and supported lock types for moving-related inquiries, keeping authorization checks before intervention.",
        fr: "Réexaminez zones, horaires et types de serrure pour les demandes liées aux déménagements, sans omettre la vérification d’autorisation.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
