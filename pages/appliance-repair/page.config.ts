import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "appliance-repair",
  accent: "#5a6775",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Reparación de electrodomésticos",
      headline: "¿Su nevera o lavadora falla en Santo Domingo?",
      subhead:
        "Indique el electrodoméstico, la marca y lo que está pasando. Un técnico deberá revisar el equipo antes de confirmar reparación, repuestos y costo.",
      cta: "Buscar un técnico de electrodomésticos",
      subtypes: [
        {
          value: "appliance-diagnosis",
          label: "Diagnóstico de falla",
        },
        {
          value: "appliance-repair",
          label: "Reparación",
        },
        {
          value: "appliance-maintenance",
          label: "Mantenimiento",
        },
        {
          value: "appliance-installation",
          label: "Instalación o conexión",
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
          key: "appliance-type",
          label: "Tipo de electrodoméstico",
          type: "select",
          options: [
            {
              value: "refrigerator",
              label: "Nevera",
            },
            {
              value: "washer",
              label: "Lavadora",
            },
            {
              value: "oven-cooker",
              label: "Horno o estufa",
            },
            {
              value: "dryer",
              label: "Secadora",
            },
            {
              value: "other",
              label: "Otro equipo por confirmar",
            },
          ],
          required: true,
        },
        {
          key: "appliance-brand",
          label: "Marca; indique si no la conoce",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Consultas de diagnóstico y reparación según tipo y marca del equipo.",
        "Mantenimiento o instalación cuando corresponda a la especialidad.",
        "Evaluación de alternativas tras identificar la falla.",
      ],
      excluded: [
        "Reparación asegurada o repuestos disponibles sin diagnóstico.",
        "Garantía del fabricante o servicio autorizado no acreditado.",
        "Piezas, retiro del equipo o instalaciones de gas y electricidad no acordadas.",
      ],
      priceFactors: [
        "Tipo, marca, modelo y acceso al electrodoméstico.",
        "Diagnóstico, mano de obra y disponibilidad de repuestos.",
        "Visita, traslado o instalación adicional expresamente cotizados.",
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
          q: "¿Pueden darme el precio solo por describir la falla?",
          a: "La descripción orienta, pero distintos problemas pueden parecerse. Antes de aceptar, confirme si la visita o el diagnóstico tienen costo y solicite una cotización con repuestos y mano de obra cuando se conozca la falla.",
        },
        {
          q: "¿Trabajan con cualquier marca o garantía?",
          a: "La compatibilidad y la condición de servicio autorizado deben comprobarse para el técnico propuesto. Indique la marca y si el equipo tiene garantía; esta página no representa al fabricante ni promete cobertura de garantía.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Appliance repair",
      headline: "Is your refrigerator or washer failing in Santo Domingo?",
      subhead:
        "Tell us the appliance, brand and symptoms. A technician would need to inspect it before confirming the repair, parts and cost.",
      cta: "Find an appliance technician",
      subtypes: [
        {
          value: "appliance-diagnosis",
          label: "Fault diagnosis",
        },
        {
          value: "appliance-repair",
          label: "Repair",
        },
        {
          value: "appliance-maintenance",
          label: "Maintenance",
        },
        {
          value: "appliance-installation",
          label: "Installation or connection",
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
          key: "appliance-type",
          label: "Appliance type",
          type: "select",
          options: [
            {
              value: "refrigerator",
              label: "Refrigerator",
            },
            {
              value: "washer",
              label: "Washing machine",
            },
            {
              value: "oven-cooker",
              label: "Oven or cooker",
            },
            {
              value: "dryer",
              label: "Dryer",
            },
            {
              value: "other",
              label: "Other equipment to confirm",
            },
          ],
          required: true,
        },
        {
          key: "appliance-brand",
          label: "Brand; say if unknown",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Diagnosis and repair inquiries matched to appliance type and brand.",
        "Maintenance or installation within the provider's specialty.",
        "Assessment of options after identifying the fault.",
      ],
      excluded: [
        "Guaranteed repair or parts availability before diagnosis.",
        "Manufacturer warranty coverage or authorized-service status without evidence.",
        "Parts, appliance removal or gas and electrical work not agreed in the scope.",
      ],
      priceFactors: [
        "Appliance type, brand, model and access.",
        "Diagnosis, labor and parts availability.",
        "Any expressly quoted visit, transport or additional installation.",
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
          q: "Can you give a price from the symptoms alone?",
          a: "Symptoms help describe the issue, but different faults can look similar. Confirm whether assessment or visit fees apply before agreeing, then request a parts-and-labor quote once the fault is identified.",
        },
        {
          q: "Are all brands and warranties covered?",
          a: "Compatibility and any authorized-service status must be checked for the proposed technician. State the brand and whether the appliance is under warranty. This page does not represent a manufacturer or promise warranty coverage.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Réparation d’électroménager",
      headline:
        "Votre réfrigérateur ou lave-linge tombe en panne à Santo Domingo ?",
      subhead:
        "Indiquez l’appareil, la marque et les symptômes. Un technicien devra l’examiner avant de confirmer la réparation, les pièces et le coût.",
      cta: "Trouver un réparateur d’électroménager",
      subtypes: [
        {
          value: "appliance-diagnosis",
          label: "Diagnostic de panne",
        },
        {
          value: "appliance-repair",
          label: "Réparation",
        },
        {
          value: "appliance-maintenance",
          label: "Entretien",
        },
        {
          value: "appliance-installation",
          label: "Installation ou raccordement",
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
          key: "appliance-type",
          label: "Type d’appareil",
          type: "select",
          options: [
            {
              value: "refrigerator",
              label: "Réfrigérateur",
            },
            {
              value: "washer",
              label: "Lave-linge",
            },
            {
              value: "oven-cooker",
              label: "Four ou cuisinière",
            },
            {
              value: "dryer",
              label: "Sèche-linge",
            },
            {
              value: "other",
              label: "Autre appareil à préciser",
            },
          ],
          required: true,
        },
        {
          key: "appliance-brand",
          label: "Marque ; précisez si elle est inconnue",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Demandes de diagnostic et de réparation selon l’appareil et la marque.",
        "Entretien ou installation dans la spécialité du prestataire.",
        "Examen des solutions après identification de la panne.",
      ],
      excluded: [
        "Réparation garantie ou pièces disponibles avant diagnostic.",
        "Prise en charge constructeur ou statut de réparateur agréé sans justificatif.",
        "Pièces, enlèvement, gaz ou électricité non prévus dans le périmètre.",
      ],
      priceFactors: [
        "Type, marque, modèle et accès à l’appareil.",
        "Diagnostic, main-d’œuvre et disponibilité des pièces.",
        "Déplacement, transport ou installation supplémentaire expressément chiffrés.",
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
          q: "Peut-on donner un prix à partir des symptômes ?",
          a: "La description aide à comprendre le problème, mais plusieurs pannes peuvent se ressembler. Vérifiez les éventuels frais de visite ou de diagnostic avant d’accepter, puis demandez un devis pièces et main-d’œuvre après identification de la panne.",
        },
        {
          q: "Toutes les marques et garanties sont-elles prises en charge ?",
          a: "La compatibilité et l’éventuel agrément doivent être vérifiés pour le technicien proposé. Précisez la marque et l’existence d’une garantie. Cette page ne représente aucun fabricant et ne promet pas une prise en charge au titre de la garantie.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Reparación de electrodomésticos",
      headline: "Reciba consultas de equipos y marcas que repara.",
      subhead:
        "Declare los electrodomésticos, marcas y tareas que atiende. La selección consideraría la falla descrita, la zona y su capacidad para evaluar el equipo.",
      cta: "Postular para reparar equipos",
      fit: [
        "Técnicos independientes y talleres de reparación.",
        "Especialistas que declaran equipos y marcas compatibles.",
        "Negocios que explican cargos de diagnóstico, repuestos y alcance de garantía propia.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Reparación de electrodomésticos",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: una lavadora no completa el ciclo; marca indicada por el solicitante y diagnóstico aún pendiente.",
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
          q: "¿Puedo rechazar una marca o equipo que no atiendo?",
          a: "Sí, antes de aceptar una oportunidad debe quedar claro qué equipos y marcas cubre. No se debe afirmar autorización del fabricante sin evidencia; la solicitud tampoco confirma que haya un repuesto disponible.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Appliance repair",
      headline: "Find inquiries for appliances and brands you repair.",
      subhead:
        "Declare supported appliances, brands and tasks. Proposed matching would consider the reported fault, area and your capacity to assess the equipment.",
      cta: "Apply for appliance-repair leads",
      fit: [
        "Independent appliance technicians and repair workshops.",
        "Specialists declaring supported equipment and brands.",
        "Businesses that explain diagnostic fees, parts and their own workmanship terms.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Appliance repair",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: a washing machine does not finish its cycle; the requester has supplied a brand, but diagnosis is pending.",
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
          q: "Can I decline a brand or appliance I do not service?",
          a: "Yes. Supported equipment and brands must be clear before accepting an opportunity. Do not claim manufacturer authorization without evidence; an inquiry also does not confirm parts availability.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Réparation d’électroménager",
      headline: "Des demandes pour les appareils et marques que vous réparez.",
      subhead:
        "Déclarez les appareils, les marques et les tâches pris en charge. Les symptômes, la zone et votre capacité de diagnostic guideraient la sélection.",
      cta: "Proposer mes services de réparation",
      fit: [
        "Réparateurs indépendants et ateliers d’électroménager.",
        "Spécialistes indiquant les appareils et les marques compatibles.",
        "Entreprises qui expliquent frais de diagnostic, pièces et garanties de leur travail.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Réparation d’électroménager",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : un lave-linge ne termine pas son cycle ; marque indiquée par le demandeur, diagnostic encore à réaliser.",
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
          q: "Puis-je refuser une marque ou un appareil non pris en charge ?",
          a: "Oui. Les équipements et les marques doivent être précisés avant l’acceptation. Ne revendiquez pas d’agrément constructeur sans justificatif. Une demande ne confirme pas non plus la disponibilité des pièces.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "appliance-care",
      customer: {
        es: "Antes de períodos de mayor uso, describa fallas de refrigeración o cocción para su evaluación; no se promete reparación antes de una celebración.",
        en: "Ahead of heavier use, describe refrigeration or cooking faults for assessment; repair before a celebration is not promised.",
        fr: "Avant une utilisation accrue, décrivez les pannes de froid ou de cuisson à évaluer ; aucune réparation avant une fête n’est promise.",
      },
      provider: {
        es: "Actualice equipos y marcas atendidos y capacidad de diagnóstico, especialmente cuando aumenten las consultas de neveras u hornos.",
        en: "Update supported appliances, brands and diagnostic capacity when refrigerator or oven inquiries increase.",
        fr: "Actualisez appareils, marques et capacité de diagnostic lorsque les demandes concernant réfrigérateurs ou fours augmentent.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
