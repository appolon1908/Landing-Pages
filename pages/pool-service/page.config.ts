import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "pool-service",
  accent: "#2d7280",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Mantenimiento de piscinas",
      headline: "¿Su piscina necesita mantenimiento en Santo Domingo?",
      subhead:
        "Indique si busca limpieza, cuidado periódico o revisión del equipo. El estado del agua, el tamaño de la piscina y la disponibilidad deben evaluarse antes de acordar el servicio.",
      cta: "Solicitar servicio de piscina",
      subtypes: [
        {
          value: "pool-cleaning",
          label: "Limpieza de piscina",
        },
        {
          value: "recurring-maintenance",
          label: "Mantenimiento periódico",
        },
        {
          value: "pump-filter",
          label: "Bomba y filtro",
        },
        {
          value: "pool-inspection",
          label: "Evaluación de funcionamiento",
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
          key: "pool-size",
          label: "Dimensiones o volumen aproximado",
          type: "text",
          required: false,
        },
        {
          key: "service-frequency",
          label: "Frecuencia que busca",
          type: "select",
          options: [
            {
              value: "one-time",
              label: "Servicio puntual",
            },
            {
              value: "recurring",
              label: "Plan periódico por definir",
            },
            {
              value: "assessment",
              label: "Primero necesito una evaluación",
            },
          ],
          required: true,
        },
      ],
      included: [
        "Consultas de limpieza y mantenimiento periódico.",
        "Evaluación del funcionamiento de bombas y filtros.",
        "Definición de un alcance de cuidado según la piscina y su uso.",
      ],
      excluded: [
        "Declaraciones de agua apta para baño sin evaluación apropiada.",
        "Reparaciones estructurales, fugas ocultas o trabajos eléctricos no acordados.",
        "Productos, repuestos o visitas adicionales si no están incluidos en la cotización.",
      ],
      priceFactors: [
        "Volumen, superficie y estado inicial de la piscina.",
        "Frecuencia, carga de uso y alcance de limpieza.",
        "Equipos, repuestos, consumibles y condiciones de acceso.",
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
          q: "¿Puedo solicitar mantenimiento periódico?",
          a: "Sí, indique la frecuencia deseada y el uso de la piscina. El proveedor deberá revisar el estado inicial y definir qué tareas, productos y visitas incluiría el plan; la recurrencia no se activa desde este formulario.",
        },
        {
          q: "¿Una visita de limpieza incluye reparar la bomba?",
          a: "No necesariamente. Describa cualquier falla del equipo para que se determine si hace falta diagnóstico y una cotización separada. No se presupone que repuestos o trabajos eléctricos estén incluidos.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Pool care",
      headline: "Does your pool need care in Santo Domingo?",
      subhead:
        "Tell us whether you need cleaning, recurring care or an equipment check. Water condition, pool size and availability must be assessed before agreeing on service.",
      cta: "Request pool service",
      subtypes: [
        {
          value: "pool-cleaning",
          label: "Pool cleaning",
        },
        {
          value: "recurring-maintenance",
          label: "Recurring maintenance",
        },
        {
          value: "pump-filter",
          label: "Pump and filter service",
        },
        {
          value: "pool-inspection",
          label: "Pool assessment",
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
          key: "pool-size",
          label: "Approximate dimensions or volume",
          type: "text",
          required: false,
        },
        {
          key: "service-frequency",
          label: "Preferred service frequency",
          type: "select",
          options: [
            {
              value: "one-time",
              label: "One-time visit",
            },
            {
              value: "recurring",
              label: "Recurring plan to be agreed",
            },
            {
              value: "assessment",
              label: "Assessment first",
            },
          ],
          required: true,
        },
      ],
      included: [
        "Pool cleaning and recurring maintenance inquiries.",
        "Assessment of pump and filter operation.",
        "Defining a care plan around the pool and its use.",
      ],
      excluded: [
        "Claims that water is safe for swimming without an appropriate assessment.",
        "Structural repairs, concealed leaks or electrical work outside the agreed scope.",
        "Products, parts or extra visits unless expressly included in the quote.",
      ],
      priceFactors: [
        "Pool volume, surface area and initial condition.",
        "Frequency, use and the agreed cleaning scope.",
        "Equipment, parts, consumables and access.",
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
          q: "Can I request recurring maintenance?",
          a: "State the desired frequency and how the pool is used. The provider would need to assess its starting condition and define the tasks, products and visits in the plan. This form does not activate recurring service.",
        },
        {
          q: "Does a cleaning visit include pump repairs?",
          a: "Not necessarily. Describe equipment problems so that a separate assessment and quote can be considered. Parts and electrical work are not assumed to be included.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Entretien de piscines",
      headline: "Votre piscine a besoin d’entretien à Santo Domingo ?",
      subhead:
        "Précisez si vous cherchez un nettoyage, un entretien régulier ou un contrôle des équipements. L’état de l’eau, la taille du bassin et les disponibilités restent à évaluer.",
      cta: "Demander un entretien de piscine",
      subtypes: [
        {
          value: "pool-cleaning",
          label: "Nettoyage de piscine",
        },
        {
          value: "recurring-maintenance",
          label: "Entretien régulier",
        },
        {
          value: "pump-filter",
          label: "Pompe et filtre",
        },
        {
          value: "pool-inspection",
          label: "Évaluation du fonctionnement",
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
          key: "pool-size",
          label: "Dimensions ou volume approximatifs",
          type: "text",
          required: false,
        },
        {
          key: "service-frequency",
          label: "Fréquence souhaitée",
          type: "select",
          options: [
            {
              value: "one-time",
              label: "Intervention ponctuelle",
            },
            {
              value: "recurring",
              label: "Entretien régulier à définir",
            },
            {
              value: "assessment",
              label: "Évaluation préalable",
            },
          ],
          required: true,
        },
      ],
      included: [
        "Demandes de nettoyage et d’entretien régulier.",
        "Évaluation du fonctionnement de la pompe et du filtre.",
        "Définition d’un entretien adapté au bassin et à son utilisation.",
      ],
      excluded: [
        "Affirmation d’une eau propre à la baignade sans évaluation appropriée.",
        "Réparations structurelles, fuites cachées ou électricité hors du périmètre convenu.",
        "Produits, pièces et visites supplémentaires non prévus au devis.",
      ],
      priceFactors: [
        "Volume, surface et état initial du bassin.",
        "Fréquence, fréquentation et étendue du nettoyage.",
        "Équipements, pièces, consommables et accès.",
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
          q: "Puis-je demander un entretien régulier ?",
          a: "Précisez la fréquence souhaitée et l’utilisation du bassin. Le prestataire devra évaluer son état initial et définir les tâches, les produits et les visites compris. Le formulaire n’active aucun entretien récurrent.",
        },
        {
          q: "Une visite de nettoyage comprend-elle la réparation de la pompe ?",
          a: "Pas nécessairement. Décrivez les problèmes d’équipement pour envisager un diagnostic et un devis distincts. Les pièces et les travaux électriques ne sont pas inclus par défaut.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Mantenimiento de piscinas",
      headline: "Presente su servicio de piscinas en las zonas que atiende.",
      subhead:
        "Indique si ofrece limpieza puntual, rutas periódicas o diagnóstico de equipos. Las solicitudes se evaluarían según ubicación, tamaño y alcance del servicio.",
      cta: "Postular para servicios de piscina",
      fit: [
        "Técnicos y empresas de limpieza y mantenimiento de piscinas.",
        "Equipos que definen frecuencia, consumibles y condiciones de acceso.",
        "Especialistas que separan cuidado rutinario y reparación de equipos.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Mantenimiento de piscinas",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: evaluar un plan periódico para una piscina residencial; volumen y estado del equipo por confirmar.",
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
          q: "¿La solicitud significa que ya tengo un contrato de mantenimiento?",
          a: "No. La oportunidad permite evaluar la piscina y discutir un alcance. La frecuencia, los consumibles, el acceso y el precio deben acordarse por separado; no hay contrato recurrente ni ruta garantizada por postularse.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Pool care",
      headline: "Offer pool care in the areas you serve.",
      subhead:
        "Declare one-time cleaning, maintenance routes or equipment assessment services. Proposed matching would consider location, pool size and scope.",
      cta: "Apply for pool-service leads",
      fit: [
        "Pool cleaning technicians and maintenance companies.",
        "Teams that define frequency, consumables and access conditions.",
        "Specialists who distinguish routine care from equipment repair.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Pool care",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: assess a recurring care plan for a residential pool; volume and equipment condition await confirmation.",
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
          q: "Does an inquiry mean I have a maintenance contract?",
          a: "No. It is an opportunity to assess the pool and discuss scope. Frequency, consumables, access and price must be agreed separately. Applying does not guarantee a recurring contract or a maintenance route.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Entretien de piscines",
      headline: "Proposez l’entretien de piscines dans vos zones.",
      subhead:
        "Indiquez si vous proposez un nettoyage ponctuel, des tournées d’entretien ou un diagnostic d’équipement. La zone, la taille du bassin et le périmètre guideraient la sélection.",
      cta: "Proposer l’entretien de piscines",
      fit: [
        "Techniciens et entreprises d’entretien de piscines.",
        "Équipes qui précisent fréquence, consommables et conditions d’accès.",
        "Professionnels qui séparent entretien courant et réparation d’équipement.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Entretien de piscines",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : évaluer un entretien régulier pour une piscine résidentielle ; volume et état des équipements à confirmer.",
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
          q: "Une demande correspond-elle déjà à un contrat d’entretien ?",
          a: "Non. Elle permet d’évaluer le bassin et de discuter du périmètre. La fréquence, les consommables, l’accès et le prix restent à convenir séparément. Une candidature ne garantit ni contrat récurrent ni tournée.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "pool-use-planning",
      customer: {
        es: "Antes de períodos de mayor uso, describa el estado de la piscina y el cuidado que necesita; confirme la evaluación y las fechas con el proveedor.",
        en: "Before periods of heavier use, describe the pool's condition and care needs; confirm assessment and timing with the provider.",
        fr: "Avant une période d’utilisation accrue, décrivez l’état du bassin et l’entretien souhaité ; confirmez l’évaluation et les dates avec le prestataire.",
      },
      provider: {
        es: "Revise su capacidad de ruta y los servicios de equipo que admite antes de considerar solicitudes para períodos de mayor uso.",
        en: "Review route capacity and supported equipment services before considering inquiries for periods of heavier use.",
        fr: "Réexaminez votre capacité de tournée et les équipements pris en charge avant les périodes de fréquentation accrue.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
