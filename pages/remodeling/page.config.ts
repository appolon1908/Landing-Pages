import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "remodeling",
  accent: "#805239",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Remodelaciones",
      headline: "¿Planea remodelar su hogar o local en Santo Domingo?",
      subhead:
        "Explique qué quiere cambiar, el espacio y sus prioridades. El alcance, la visita y la disponibilidad de un equipo deben confirmarse antes de comenzar.",
      cta: "Consultar mi remodelación",
      subtypes: [
        {
          value: "kitchen",
          label: "Cocina",
        },
        {
          value: "bathroom",
          label: "Baño",
        },
        {
          value: "general-renovation",
          label: "Remodelación general",
        },
        {
          value: "commercial-refit",
          label: "Adecuación de local",
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
          key: "project-area",
          label: "¿Qué espacio desea remodelar?",
          type: "text",
          required: true,
        },
        {
          key: "occupied-property",
          label: "¿El inmueble estará ocupado durante la obra?",
          type: "select",
          options: [
            {
              value: "yes",
              label: "Sí",
            },
            {
              value: "no",
              label: "No",
            },
            {
              value: "unsure",
              label: "Por definir",
            },
          ],
          required: true,
        },
      ],
      included: [
        "Evaluación de proyectos de cocina, baño y otros espacios.",
        "Definición del alcance, acabados y etapas de trabajo.",
        "Consultas para adaptar viviendas o locales a un nuevo uso.",
      ],
      excluded: [
        "Cambios estructurales, planos y permisos sin evaluación profesional específica.",
        "Materiales, retiro de escombros o trabajos eléctricos no incluidos expresamente en la cotización.",
        "Fechas de entrega o precios cerrados sin inspección y alcance acordado.",
      ],
      priceFactors: [
        "Superficie y estado de las instalaciones existentes.",
        "Demoliciones, materiales, acabados y trabajos de otras especialidades.",
        "Acceso, ocupación del inmueble y ejecución por etapas.",
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
          q: "¿Puedo pedir una remodelación por etapas?",
          a: "Sí, puede describir las prioridades y qué espacios deben seguir en uso. El equipo deberá evaluar la secuencia, el acceso y los costos de cada etapa antes de proponer un calendario.",
        },
        {
          q: "¿La cotización incluye planos, permisos y escombros?",
          a: "No se presume que estén incluidos. Pida que se identifiquen por separado el diseño, los permisos que correspondan, los trabajos de cada especialidad y la retirada de escombros.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Remodeling",
      headline: "Planning a home or business renovation in Santo Domingo?",
      subhead:
        "Describe the space, what you want to change and your priorities. Scope, assessment visits and crew availability must be confirmed before work begins.",
      cta: "Discuss my renovation",
      subtypes: [
        {
          value: "kitchen",
          label: "Kitchen",
        },
        {
          value: "bathroom",
          label: "Bathroom",
        },
        {
          value: "general-renovation",
          label: "General renovation",
        },
        {
          value: "commercial-refit",
          label: "Commercial refit",
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
          key: "project-area",
          label: "Which space would you like to remodel?",
          type: "text",
          required: true,
        },
        {
          key: "occupied-property",
          label: "Will the property be occupied during the work?",
          type: "select",
          options: [
            {
              value: "yes",
              label: "Yes",
            },
            {
              value: "no",
              label: "No",
            },
            {
              value: "unsure",
              label: "To be decided",
            },
          ],
          required: true,
        },
      ],
      included: [
        "Assessment inquiries for kitchens, bathrooms and other spaces.",
        "Defining scope, finishes and stages of work.",
        "Planning changes to homes or commercial interiors.",
      ],
      excluded: [
        "Structural alterations, plans or permits without the relevant professional assessment.",
        "Materials, debris removal or electrical work not expressly included in the quote.",
        "Completion dates or fixed prices before an agreed scope and assessment.",
      ],
      priceFactors: [
        "Floor area and the condition of existing installations.",
        "Demolition, materials, finishes and specialist trades.",
        "Access, occupancy and work split into stages.",
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
          q: "Can I request a renovation in stages?",
          a: "Describe your priorities and which rooms must stay usable. The team would need to assess sequencing, access and the cost of each stage before proposing a schedule.",
        },
        {
          q: "Does the quote include plans, permits and debris removal?",
          a: "Do not assume so. Ask for design, any applicable permits, specialist trades and debris removal to be listed separately in the scope.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Rénovation",
      headline: "Un projet de rénovation à Santo Domingo ?",
      subhead:
        "Décrivez l’espace à transformer et vos priorités. Le périmètre, la visite d’évaluation et la disponibilité d’une équipe doivent être confirmés avant les travaux.",
      cta: "Parler de ma rénovation",
      subtypes: [
        {
          value: "kitchen",
          label: "Cuisine",
        },
        {
          value: "bathroom",
          label: "Salle de bains",
        },
        {
          value: "general-renovation",
          label: "Rénovation générale",
        },
        {
          value: "commercial-refit",
          label: "Aménagement de local",
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
          key: "project-area",
          label: "Quel espace souhaitez-vous rénover ?",
          type: "text",
          required: true,
        },
        {
          key: "occupied-property",
          label: "Le bien sera-t-il occupé pendant les travaux ?",
          type: "select",
          options: [
            {
              value: "yes",
              label: "Oui",
            },
            {
              value: "no",
              label: "Non",
            },
            {
              value: "unsure",
              label: "À définir",
            },
          ],
          required: true,
        },
      ],
      included: [
        "Demandes d’évaluation pour cuisines, salles de bains et autres espaces.",
        "Définition des travaux, des finitions et des étapes du chantier.",
        "Projets d’aménagement de logements ou de locaux professionnels.",
      ],
      excluded: [
        "Modifications structurelles, plans et autorisations sans évaluation professionnelle adaptée.",
        "Matériaux, évacuation des gravats ou électricité non prévus au devis.",
        "Dates de livraison ou prix fermes avant évaluation et accord sur le périmètre.",
      ],
      priceFactors: [
        "Surface et état des installations existantes.",
        "Démolition, matériaux, finitions et corps de métier nécessaires.",
        "Accès, occupation des lieux et réalisation par étapes.",
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
          q: "Puis-je demander une rénovation par étapes ?",
          a: "Précisez vos priorités et les pièces qui doivent rester utilisables. L’équipe devra étudier l’ordre des travaux, l’accès et le coût de chaque étape avant de proposer un calendrier.",
        },
        {
          q: "Le devis comprend-il les plans, les autorisations et les gravats ?",
          a: "Ce n’est pas implicite. Demandez de distinguer la conception, les éventuelles autorisations, les interventions de chaque métier et l’évacuation des gravats.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Remodelaciones",
      headline: "Reciba consultas de remodelación acordes con su equipo.",
      subhead:
        "Presente los espacios que remodela, su capacidad y el tipo de proyecto que puede evaluar. La selección consideraría zona, alcance y disponibilidad declarada.",
      cta: "Postular para remodelaciones",
      fit: [
        "Contratistas, equipos y empresas que coordinan remodelaciones.",
        "Especialistas capaces de delimitar partidas, acabados y tareas subcontratadas.",
        "Negocios que explican cómo trabajan en inmuebles ocupados.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Remodelaciones",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: renovar un baño de una vivienda ocupada; alcance y acabados por definir, sin presupuesto ni fecha aprobados.",
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
          q: "¿Cómo evito recibir proyectos que excedan mi equipo?",
          a: "Declare qué espacios interviene, qué especialidades coordina y qué trabajos excluye. La revisión debe distinguir un cambio de acabados de una intervención estructural; no acepte un alcance que no pueda evaluar o ejecutar.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Remodeling",
      headline: "Find renovation inquiries suited to your crew.",
      subhead:
        "Describe the spaces you renovate, your capacity and the projects you can assess. Proposed matching would consider area, scope and declared availability.",
      cta: "Apply for remodeling leads",
      fit: [
        "Contractors, crews and companies coordinating renovation work.",
        "Specialists who define work items, finishes and subcontracted tasks.",
        "Businesses that explain how they work in occupied properties.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Remodeling",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: renovate a bathroom in an occupied home; scope and finishes to be discussed, with no approved budget or date.",
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
          q: "How can I avoid projects beyond my crew's capabilities?",
          a: "Declare the spaces you work on, trades you coordinate and exclusions. Review should distinguish a finish update from structural work; do not accept a scope you cannot assess or deliver.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Rénovation",
      headline: "Des demandes de rénovation adaptées à votre équipe.",
      subhead:
        "Présentez les espaces que vous rénovez, votre capacité et les projets que vous pouvez évaluer. La mise en relation envisagée tiendrait compte de la zone et du périmètre.",
      cta: "Proposer mes services de rénovation",
      fit: [
        "Entrepreneurs, équipes et entreprises qui coordonnent des rénovations.",
        "Professionnels qui précisent les postes, les finitions et la sous-traitance.",
        "Entreprises capables d’expliquer leur organisation en site occupé.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Rénovation",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : rénover une salle de bains dans un logement occupé ; travaux et finitions à préciser, sans budget ni date approuvés.",
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
          q: "Comment éviter les projets qui dépassent les capacités de mon équipe ?",
          a: "Précisez les espaces traités, les métiers coordonnés et les exclusions. L’examen doit distinguer un changement de finitions d’une intervention structurelle. N’acceptez pas un périmètre que vous ne pouvez ni évaluer ni réaliser.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "renovation-planning",
      customer: {
        es: "Antes de planificar obras para fin de año, describa el alcance y los espacios que necesita mantener en uso; las fechas dependerán de una evaluación.",
        en: "When planning a renovation before the holidays, identify the scope and rooms that must stay usable; timing will depend on an assessment.",
        fr: "Pour une rénovation envisagée avant les fêtes, précisez les travaux et les pièces à garder utilisables ; le calendrier dépendra de l’évaluation.",
      },
      provider: {
        es: "Actualice la capacidad por etapa y los proyectos que puede estudiar antes de aceptar compromisos de fin de año.",
        en: "Update your capacity by project stage before considering work intended for the holiday period.",
        fr: "Actualisez votre capacité par étape avant d’envisager des chantiers prévus pour la période des fêtes.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
