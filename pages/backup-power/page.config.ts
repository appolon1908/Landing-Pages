import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "backup-power",
  accent: "#6b6333",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Plantas eléctricas, inversores y baterías",
      headline: "¿Necesita revisar su planta o inversor en Santo Domingo?",
      subhead:
        "Explique el equipo, la falla o la necesidad de respaldo. Un técnico deberá comprobar compatibilidad, estado y alcance antes de proponer mantenimiento o instalación.",
      cta: "Evaluar mi sistema de respaldo",
      subtypes: [
        {
          value: "generator-service",
          label: "Revisión de planta eléctrica",
        },
        {
          value: "inverter-service",
          label: "Revisión de inversor",
        },
        {
          value: "battery-assessment",
          label: "Evaluación de baterías",
        },
        {
          value: "backup-installation",
          label: "Evaluación de instalación de respaldo",
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
          key: "equipment-brand-model",
          label: "Marca y modelo, si los conoce",
          type: "text",
          required: false,
        },
        {
          key: "backup-purpose",
          label: "Equipo existente o necesidad de respaldo",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Consultas de mantenimiento o revisión de plantas eléctricas.",
        "Evaluación de inversores y baterías según la especialidad del técnico.",
        "Estudio de necesidades para una instalación o ampliación de respaldo.",
      ],
      excluded: [
        "Autonomía o suministro ininterrumpido garantizados sin estudio.",
        "Manipulación remota del equipo o instrucciones de reparación desde el formulario.",
        "Combustible, baterías, repuestos y adecuaciones eléctricas fuera del alcance cotizado.",
      ],
      priceFactors: [
        "Tipo, marca, capacidad y estado del equipo.",
        "Diagnóstico requerido, componentes y repuestos compatibles.",
        "Acceso, montaje y adecuaciones que determine la evaluación.",
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
          q: "¿Pueden cotizar una batería solo con la marca del inversor?",
          a: "La marca puede orientar, pero no basta para confirmar compatibilidad o alcance. Indique el modelo y lo que conoce del sistema; el técnico deberá verificar la configuración antes de recomendar un reemplazo.",
        },
        {
          q: "¿Puedo reservar atención inmediata durante un apagón?",
          a: "No desde esta vista previa. La solicitud no confirma despacho, disponibilidad ni un tiempo de llegada. La capacidad y los horarios deben verificarse antes de acordar una visita.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Generators, inverters and batteries",
      headline: "Need generator or inverter service in Santo Domingo?",
      subhead:
        "Describe the equipment, fault or backup need. A technician would have to check compatibility, condition and scope before proposing maintenance or installation.",
      cta: "Request a backup-power assessment",
      subtypes: [
        {
          value: "generator-service",
          label: "Generator service",
        },
        {
          value: "inverter-service",
          label: "Inverter service",
        },
        {
          value: "battery-assessment",
          label: "Battery assessment",
        },
        {
          value: "backup-installation",
          label: "Backup installation assessment",
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
          key: "equipment-brand-model",
          label: "Brand and model, if known",
          type: "text",
          required: false,
        },
        {
          key: "backup-purpose",
          label: "Existing equipment or backup need",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Generator maintenance or inspection inquiries.",
        "Inverter and battery assessment within the technician's specialty.",
        "Assessment of needs for a new or expanded backup system.",
      ],
      excluded: [
        "Guaranteed runtime or uninterrupted supply without a study.",
        "Remote equipment operation or repair instructions through the form.",
        "Fuel, batteries, parts and electrical changes outside the quoted scope.",
      ],
      priceFactors: [
        "Equipment type, brand, capacity and condition.",
        "Required diagnosis, components and compatible parts.",
        "Access, installation and modifications identified in the assessment.",
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
          q: "Can a replacement battery be quoted from the inverter brand alone?",
          a: "The brand helps identify the system but does not establish compatibility or scope. Provide the model and what you know about the equipment; a technician would need to check its configuration before recommending a replacement.",
        },
        {
          q: "Can I reserve immediate help during an outage?",
          a: "Not through this preview. A request does not confirm dispatch, availability or arrival time. Capacity and operating hours must be checked before a visit is agreed.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Groupes électrogènes et batteries",
      headline: "Un système de secours à contrôler à Santo Domingo ?",
      subhead:
        "Décrivez l’équipement, la panne ou le besoin de secours. Un technicien devra vérifier compatibilité, état et périmètre avant de proposer un entretien ou une installation.",
      cta: "Évaluer mon alimentation de secours",
      subtypes: [
        {
          value: "generator-service",
          label: "Entretien de groupe électrogène",
        },
        {
          value: "inverter-service",
          label: "Contrôle d’onduleur",
        },
        {
          value: "battery-assessment",
          label: "Évaluation de batteries",
        },
        {
          value: "backup-installation",
          label: "Étude d’alimentation de secours",
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
          key: "equipment-brand-model",
          label: "Marque et modèle, si connus",
          type: "text",
          required: false,
        },
        {
          key: "backup-purpose",
          label: "Équipement existant ou besoin de secours",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Demandes d’entretien ou de contrôle de groupes électrogènes.",
        "Évaluation d’onduleurs et de batteries selon la spécialité du technicien.",
        "Étude des besoins pour créer ou étendre une alimentation de secours.",
      ],
      excluded: [
        "Autonomie ou alimentation continue garanties sans étude.",
        "Commande à distance du matériel ou instructions de réparation par le formulaire.",
        "Carburant, batteries, pièces et adaptations électriques hors du devis.",
      ],
      priceFactors: [
        "Type, marque, capacité et état de l’équipement.",
        "Diagnostic nécessaire, composants et pièces compatibles.",
        "Accès, montage et adaptations identifiées lors de l’évaluation.",
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
          q: "La marque de l’onduleur suffit-elle pour chiffrer une batterie ?",
          a: "Elle aide à identifier le système, mais ne permet pas de confirmer sa compatibilité. Précisez le modèle et les informations connues ; le technicien devra vérifier la configuration avant de recommander un remplacement.",
        },
        {
          q: "Puis-je réserver une intervention immédiate pendant une coupure ?",
          a: "Pas dans cet aperçu. Une demande ne confirme ni déplacement, ni disponibilité, ni heure d’arrivée. La capacité et les horaires doivent être vérifiés avant de convenir d’une visite.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Plantas eléctricas, inversores y baterías",
      headline: "Reciba consultas de respaldo eléctrico dentro de su alcance.",
      subhead:
        "Declare las plantas, inversores y tecnologías de batería que atiende. La selección consideraría equipo, zona y capacidad, sin presumir servicio de emergencia.",
      cta: "Postular para respaldo eléctrico",
      fit: [
        "Técnicos y empresas de mantenimiento de plantas e inversores.",
        "Especialistas que documentan compatibilidad y alcance de equipos.",
        "Equipos que declaran claramente instalación, diagnóstico y exclusiones.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Plantas eléctricas, inversores y baterías",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: revisar un inversor residencial que no mantiene el respaldo esperado; modelo y baterías pendientes de confirmar.",
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
          q: "¿Debo aceptar cualquier equipo incluido en la categoría?",
          a: "No. Declare las marcas, tecnologías y tareas que puede atender, así como los trabajos que requieren otro especialista. Una oportunidad debe revisarse por compatibilidad y alcance, sin asumir atención inmediata.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Generators, inverters and batteries",
      headline: "Find backup-power inquiries within your expertise.",
      subhead:
        "Declare the generators, inverters and battery technologies you service. Proposed matching would consider equipment, area and capacity without assuming emergency coverage.",
      cta: "Apply for backup-power leads",
      fit: [
        "Generator and inverter maintenance technicians and companies.",
        "Specialists who document compatibility and equipment scope.",
        "Teams that distinguish installation, diagnostics and exclusions.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Generators, inverters and batteries",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: inspect a home inverter with reduced backup performance; model and battery details await confirmation.",
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
          q: "Must I accept every equipment type in this category?",
          a: "No. Declare supported brands, technologies and tasks, including work that needs another specialist. Review compatibility and scope before accepting; an opportunity does not imply an immediate response commitment.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Groupes électrogènes et batteries",
      headline: "Des demandes de secours électrique dans votre spécialité.",
      subhead:
        "Précisez les groupes électrogènes, onduleurs et batteries pris en charge. La sélection tiendrait compte du matériel, de la zone et de la capacité, sans supposer un service d’urgence.",
      cta: "Proposer mes services de secours",
      fit: [
        "Techniciens et entreprises d’entretien de groupes et d’onduleurs.",
        "Spécialistes qui documentent compatibilité et périmètre technique.",
        "Équipes qui distinguent installation, diagnostic et exclusions.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Groupes électrogènes et batteries",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : examiner un onduleur domestique dont l’autonomie semble réduite ; modèle et batteries à confirmer.",
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
          q: "Dois-je accepter tous les équipements de cette catégorie ?",
          a: "Non. Déclarez les marques, les technologies et les tâches prises en charge, ainsi que les travaux nécessitant un autre spécialiste. Vérifiez compatibilité et périmètre avant d’accepter, sans présumer une intervention immédiate.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "outage-readiness",
      customer: {
        es: "Planifique una revisión del respaldo según el estado real de su equipo; una solicitud no garantiza continuidad eléctrica ni respuesta durante una interrupción.",
        en: "Plan a backup-system review based on its actual condition. A request does not guarantee continuous power or assistance during an outage.",
        fr: "Planifiez un contrôle selon l’état réel de votre système. Une demande ne garantit ni alimentation continue ni intervention pendant une coupure.",
      },
      provider: {
        es: "Actualice capacidad para mantenimiento y diagnóstico antes de períodos de mayor demanda, sin prometer atención de emergencia no disponible.",
        en: "Update maintenance and diagnostic capacity ahead of increased demand without promising emergency coverage that is not available.",
        fr: "Actualisez votre capacité d’entretien et de diagnostic avant une hausse de la demande, sans promettre une permanence indisponible.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
