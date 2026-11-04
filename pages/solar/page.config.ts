import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "solar",
  accent: "#80631e",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Instalación solar",
      headline: "¿Evalúa instalar energía solar en Santo Domingo?",
      subhead:
        "Describa su propiedad y qué necesidad energética desea atender. Un especialista tendría que evaluar consumo, espacio y condiciones del inmueble antes de proponer un sistema.",
      cta: "Solicitar evaluación solar",
      subtypes: [
        {
          value: "solar-assessment",
          label: "Evaluación para un sistema solar",
        },
        {
          value: "new-installation",
          label: "Instalación nueva",
        },
        {
          value: "system-expansion",
          label: "Ampliación de sistema existente",
        },
        {
          value: "solar-maintenance",
          label: "Revisión o mantenimiento",
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
          label: "Tipo de propiedad",
          type: "select",
          options: [
            {
              value: "home",
              label: "Vivienda",
            },
            {
              value: "commercial",
              label: "Local o empresa",
            },
            {
              value: "shared-building",
              label: "Edificio compartido",
            },
          ],
          required: true,
        },
        {
          key: "project-objective",
          label: "¿Qué necesidad energética desea evaluar?",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Consultas para evaluar un proyecto solar residencial o comercial.",
        "Revisión inicial de objetivos, consumo disponible y espacio de instalación.",
        "Consultas de ampliación o mantenimiento según el sistema existente.",
      ],
      excluded: [
        "Ahorros, producción, retorno de inversión o financiamiento garantizados.",
        "Aprobaciones, conexiones o capacidad estructural asumidas sin evaluación.",
        "Baterías, refuerzos, trámites o equipos no detallados en la propuesta.",
      ],
      priceFactors: [
        "Demanda energética, objetivo y tamaño del sistema evaluado.",
        "Condiciones de instalación, componentes y almacenamiento si corresponde.",
        "Acceso, ingeniería, adecuaciones y trámites aplicables al proyecto.",
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
          q: "¿Pueden decirme cuánto ahorraré con este formulario?",
          a: "No. Una estimación requiere información de consumo y una evaluación del inmueble y del sistema. Pida que cualquier propuesta exponga sus supuestos, límites y costos; aquí no se promete ahorro ni recuperación de la inversión.",
        },
        {
          q: "¿Necesito baterías para cualquier proyecto solar?",
          a: "La configuración depende de la necesidad que desea atender y de la evaluación técnica. Describa si busca estudiar consumo, respaldo o ambos; no se presupone que el almacenamiento forme parte de la propuesta.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Solar installation",
      headline: "Considering solar installation in Santo Domingo?",
      subhead:
        "Describe your property and the energy need you want to address. A specialist would need to assess usage, available space and site conditions before proposing a system.",
      cta: "Request a solar assessment",
      subtypes: [
        {
          value: "solar-assessment",
          label: "Solar assessment",
        },
        {
          value: "new-installation",
          label: "New installation",
        },
        {
          value: "system-expansion",
          label: "Existing system expansion",
        },
        {
          value: "solar-maintenance",
          label: "Inspection or maintenance",
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
              value: "commercial",
              label: "Business premises",
            },
            {
              value: "shared-building",
              label: "Shared building",
            },
          ],
          required: true,
        },
        {
          key: "project-objective",
          label: "Which energy need would you like assessed?",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Residential and commercial solar project assessment inquiries.",
        "Initial review of objectives, available usage information and installation space.",
        "Expansion or maintenance inquiries suited to an existing system.",
      ],
      excluded: [
        "Guaranteed savings, output, investment returns or financing.",
        "Assumed approvals, connections or structural suitability without assessment.",
        "Batteries, reinforcement, applications or equipment not listed in the proposal.",
      ],
      priceFactors: [
        "Energy demand, intended purpose and evaluated system size.",
        "Installation conditions, components and storage where relevant.",
        "Access, engineering, required modifications and applicable project procedures.",
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
          q: "Can this form tell me how much I will save?",
          a: "No. An estimate requires usage information and a property and system assessment. Ask that any proposal explain its assumptions, limits and costs. This preview promises no savings or investment payback.",
        },
        {
          q: "Does every solar project need batteries?",
          a: "Configuration depends on the purpose and technical assessment. Describe whether you want to explore energy use, backup supply or both. Storage is not assumed to be part of the proposal.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Installation solaire",
      headline: "Un projet d’installation solaire à Santo Domingo ?",
      subhead:
        "Décrivez le bien et le besoin énergétique à étudier. Un spécialiste devra examiner la consommation, l’espace disponible et les conditions du site avant de proposer un système.",
      cta: "Demander une étude solaire",
      subtypes: [
        {
          value: "solar-assessment",
          label: "Étude d’un projet solaire",
        },
        {
          value: "new-installation",
          label: "Nouvelle installation",
        },
        {
          value: "system-expansion",
          label: "Extension d’une installation",
        },
        {
          value: "solar-maintenance",
          label: "Contrôle ou entretien",
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
              value: "commercial",
              label: "Local professionnel",
            },
            {
              value: "shared-building",
              label: "Immeuble collectif",
            },
          ],
          required: true,
        },
        {
          key: "project-objective",
          label: "Quel besoin énergétique souhaitez-vous étudier ?",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Demandes d’étude de projets solaires résidentiels ou professionnels.",
        "Premier examen des objectifs, des données de consommation et de l’espace disponible.",
        "Demandes d’extension ou d’entretien adaptées au système existant.",
      ],
      excluded: [
        "Économies, production, retour sur investissement ou financement garantis.",
        "Autorisations, raccordements ou capacité structurelle présumés sans étude.",
        "Batteries, renforcements, démarches ou équipements non précisés dans l’offre.",
      ],
      priceFactors: [
        "Consommation, objectif et taille du système étudié.",
        "Conditions de pose, composants et stockage éventuel.",
        "Accès, études, adaptations et démarches propres au projet.",
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
          q: "Ce formulaire permet-il de chiffrer mes économies ?",
          a: "Non. Une estimation nécessite des données de consommation et une évaluation du bien et du système. Demandez que toute proposition précise ses hypothèses, ses limites et ses coûts. Aucun gain ni délai de retour sur investissement n’est promis ici.",
        },
        {
          q: "Tout projet solaire nécessite-t-il des batteries ?",
          a: "La configuration dépend du besoin et de l’étude technique. Précisez si vous souhaitez étudier votre consommation, une alimentation de secours ou les deux. Le stockage n’est pas inclus par défaut dans la proposition.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Instalación solar",
      headline: "Conecte con consultas solares que pueda evaluar.",
      subhead:
        "Declare los tipos de propiedad y sistemas que trabaja. Las oportunidades se estudiarían según zona, objetivo energético y condiciones conocidas del proyecto.",
      cta: "Postular para proyectos solares",
      fit: [
        "Instaladores y empresas que evalúan sistemas solares.",
        "Equipos que explican supuestos, componentes y límites de sus propuestas.",
        "Especialistas que declaran capacidades de diseño, montaje o mantenimiento.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Instalación solar",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: propietario de un local desea evaluar un sistema solar; consumo y espacio de instalación pendientes de revisión.",
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
          q: "¿Una solicitud incluye un dimensionamiento o un ahorro confirmado?",
          a: "No. Es una consulta inicial, no una auditoría ni un diseño aprobado. Antes de comprometer una propuesta, revise los datos de consumo y las condiciones del inmueble; cualquier proyección debe identificar sus supuestos.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Solar installation",
      headline: "Find solar inquiries suited to your capabilities.",
      subhead:
        "Declare the property types and systems you work with. Proposed matching would consider area, energy objectives and the known project conditions.",
      cta: "Apply for solar leads",
      fit: [
        "Installers and companies that assess solar systems.",
        "Teams that explain proposal assumptions, components and limits.",
        "Specialists declaring design, installation or maintenance capabilities.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Solar installation",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: a business owner wants a solar assessment; usage information and installation space await review.",
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
          q: "Does an inquiry include a confirmed system size or savings estimate?",
          a: "No. It is an initial inquiry, not an audit or approved design. Review usage data and site conditions before committing to a proposal. Any projection must state its assumptions.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Installation solaire",
      headline: "Des projets solaires que votre équipe peut étudier.",
      subhead:
        "Déclarez les types de biens et de systèmes pris en charge. La zone, les objectifs énergétiques et les conditions connues du projet guideraient la sélection.",
      cta: "Proposer mes services solaires",
      fit: [
        "Installateurs et entreprises qui évaluent des systèmes solaires.",
        "Équipes qui explicitent les hypothèses, les composants et les limites de leurs offres.",
        "Spécialistes précisant leurs capacités d’étude, de pose ou d’entretien.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Installation solaire",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : le propriétaire d’un local souhaite étudier un système solaire ; consommation et espace de pose à examiner.",
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
          q: "La demande comprend-elle un dimensionnement ou un gain confirmé ?",
          a: "Non. Il s’agit d’un premier contact, pas d’un audit ni d’un projet validé. Examinez la consommation et les conditions du site avant de vous engager sur une offre. Toute projection doit préciser ses hypothèses.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "energy-needs-review",
      customer: {
        es: "Revise sus necesidades energéticas reales antes de plantear una instalación; las campañas no sustituyen la evaluación del consumo y del inmueble.",
        en: "Review actual energy needs before considering installation; campaigns do not replace an assessment of usage and the property.",
        fr: "Examinez vos besoins énergétiques réels avant d’envisager une installation ; une campagne ne remplace pas l’étude de la consommation et du bien.",
      },
      provider: {
        es: "Ajuste la capacidad de evaluación, diseño e instalación a los proyectos que puede estudiar, sin anunciar ahorros no comprobados.",
        en: "Align assessment, design and installation capacity with projects you can study, without advertising unverified savings.",
        fr: "Adaptez votre capacité d’étude, de conception et de pose aux projets envisageables, sans annoncer d’économies non vérifiées.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
