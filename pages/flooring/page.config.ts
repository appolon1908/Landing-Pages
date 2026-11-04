import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "flooring",
  accent: "#765743",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Pisos y revestimientos",
      headline: "¿Necesita instalar o cambiar pisos en Santo Domingo?",
      subhead:
        "Cuéntenos qué superficie desea renovar y qué material tiene en mente. Un instalador tendría que evaluar la base, las medidas y el alcance antes de cotizar.",
      cta: "Solicitar cotización de pisos",
      subtypes: [
        {
          value: "tile-installation",
          label: "Instalación de cerámica o porcelanato",
        },
        {
          value: "floor-replacement",
          label: "Cambio de piso",
        },
        {
          value: "floor-repair",
          label: "Reparación de piso",
        },
        {
          value: "commercial-flooring",
          label: "Piso para local comercial",
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
          key: "surface-area",
          label: "Superficie aproximada en m²",
          type: "number",
          required: false,
        },
        {
          key: "floor-material",
          label: "Material actual o deseado",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Consultas de instalación de cerámica, porcelanato y otros pisos según especialidad.",
        "Evaluación de retiro, preparación de base y colocación.",
        "Reparaciones localizadas y renovación de pisos residenciales o comerciales.",
      ],
      excluded: [
        "Corrección estructural o de humedad sin diagnóstico específico.",
        "Materiales, movimiento de muebles y escombros si no figuran en el alcance.",
        "Coincidencia exacta de piezas antiguas o acabados sin comprobar disponibilidad.",
      ],
      priceFactors: [
        "Área, formato y tipo de material.",
        "Estado y nivelación de la base; retiro del piso existente.",
        "Cortes, zócalos, acceso y trabajo en espacios ocupados.",
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
          q: "¿Puedo aportar las cerámicas o el porcelanato?",
          a: "Indíquelo al describir el proyecto. El instalador deberá revisar la cantidad, el formato y la compatibilidad con la base. Acuerden quién aporta adhesivos, juntas y piezas adicionales.",
        },
        {
          q: "¿Se puede colocar el piso sobre el existente?",
          a: "No se puede confirmar solo con el formulario. La decisión depende del estado de la base, los niveles, las puertas y el sistema de colocación; solicite una evaluación antes de comprar materiales.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Flooring and tile",
      headline: "Need new flooring or tile in Santo Domingo?",
      subhead:
        "Tell us which surface needs work and your preferred material. An installer would need to assess the base, measurements and scope before quoting.",
      cta: "Get a flooring quote",
      subtypes: [
        {
          value: "tile-installation",
          label: "Tile installation",
        },
        {
          value: "floor-replacement",
          label: "Floor replacement",
        },
        {
          value: "floor-repair",
          label: "Floor repair",
        },
        {
          value: "commercial-flooring",
          label: "Commercial flooring",
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
          key: "surface-area",
          label: "Approximate area in m²",
          type: "number",
          required: false,
        },
        {
          key: "floor-material",
          label: "Existing or preferred flooring material",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Installation inquiries for tile and other flooring within the provider's specialty.",
        "Assessment of removal, substrate preparation and fitting.",
        "Localized repairs and residential or commercial floor replacement.",
      ],
      excluded: [
        "Structural or moisture correction without a specific assessment.",
        "Materials, furniture moving and debris removal unless listed in the scope.",
        "An exact match to older tiles or finishes without checking availability.",
      ],
      priceFactors: [
        "Area, material and tile or board format.",
        "Substrate condition, leveling and removal of existing flooring.",
        "Cuts, skirting, access and occupied rooms.",
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
          q: "Can I supply the tiles or flooring?",
          a: "Mention this when describing the project. The installer would need to check quantity, format and compatibility with the base. Agree who supplies adhesive, grout and additional pieces.",
        },
        {
          q: "Can new flooring go over the existing floor?",
          a: "The form alone cannot establish that. It depends on the base, floor levels, doors and fitting method. Request an assessment before buying materials.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Sols et carrelage",
      headline: "Un sol à poser ou à remplacer à Santo Domingo ?",
      subhead:
        "Précisez la surface à rénover et le matériau envisagé. Le poseur devra évaluer le support, les dimensions et le périmètre avant de proposer un devis.",
      cta: "Demander un devis pour mon sol",
      subtypes: [
        {
          value: "tile-installation",
          label: "Pose de carrelage",
        },
        {
          value: "floor-replacement",
          label: "Remplacement de sol",
        },
        {
          value: "floor-repair",
          label: "Réparation de sol",
        },
        {
          value: "commercial-flooring",
          label: "Sol de local professionnel",
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
          key: "surface-area",
          label: "Surface approximative en m²",
          type: "number",
          required: false,
        },
        {
          key: "floor-material",
          label: "Revêtement actuel ou souhaité",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Demandes de pose de carrelage et d’autres revêtements selon la spécialité.",
        "Évaluation de la dépose, de la préparation du support et de la pose.",
        "Réparations ponctuelles et remplacement de sols de logements ou de locaux.",
      ],
      excluded: [
        "Reprise structurelle ou traitement de l’humidité sans diagnostic adapté.",
        "Matériaux, déplacement de meubles et gravats non prévus au devis.",
        "Reproduction exacte de carreaux anciens sans vérification de leur disponibilité.",
      ],
      priceFactors: [
        "Surface, matériau et format des éléments.",
        "État et nivellement du support ; dépose du revêtement existant.",
        "Découpes, plinthes, accès et occupation des pièces.",
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
          q: "Puis-je fournir les carreaux ou le revêtement ?",
          a: "Précisez-le dans votre demande. Le poseur devra vérifier la quantité, le format et la compatibilité avec le support. Convenez de la fourniture de la colle, des joints et des éléments supplémentaires.",
        },
        {
          q: "Peut-on poser le nouveau sol sur l’ancien ?",
          a: "Le formulaire ne permet pas de le confirmer. Cela dépend du support, des niveaux, des portes et du système de pose. Demandez une évaluation avant d’acheter les matériaux.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Pisos y revestimientos",
      headline: "Encuentre proyectos de pisos dentro de su especialidad.",
      subhead:
        "Indique los materiales que instala y el tamaño de proyecto que puede atender. Las solicitudes se evaluarían por superficie, zona y preparación necesaria.",
      cta: "Postular para trabajos de pisos",
      fit: [
        "Instaladores de cerámica, porcelanato y otros revestimientos.",
        "Equipos que pueden explicar preparación de base y terminaciones.",
        "Empresas con capacidad declarada para viviendas o locales.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Pisos y revestimientos",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: cambiar el piso de una sala, con material por elegir y base pendiente de inspección.",
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
          q: "¿Qué información necesito antes de aceptar una oportunidad?",
          a: "Revise superficie aproximada, material, estado conocido de la base y si el espacio estará ocupado. Aclare si puede asumir retiro y escombros; aceptar el contacto no sustituye la inspección ni fija el precio de instalación.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Flooring and tile",
      headline: "Find flooring projects that match your skills.",
      subhead:
        "State which materials you install and the project sizes you can take on. Proposed matching would consider area, location and preparation needs.",
      cta: "Apply for flooring leads",
      fit: [
        "Tile and flooring installers with defined material specialties.",
        "Crews that explain substrate preparation and finishing work.",
        "Companies declaring capacity for homes or commercial premises.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Flooring and tile",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: replace a living-room floor, with material undecided and the base awaiting inspection.",
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
          q: "What should I know before accepting an opportunity?",
          a: "Review approximate area, material, known substrate condition and occupancy. Clarify whether removal and waste handling are within your scope. Accepting contact does not replace an inspection or fix the installation price.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Sols et carrelage",
      headline: "Des projets de sols adaptés à votre savoir-faire.",
      subhead:
        "Indiquez les matériaux que vous posez et la taille des projets que vous pouvez traiter. La mise en relation envisagée dépendrait de la zone et de la préparation nécessaire.",
      cta: "Proposer mes services de pose",
      fit: [
        "Poseurs de carrelage et de revêtements aux spécialités définies.",
        "Équipes qui précisent la préparation du support et les finitions.",
        "Entreprises indiquant leur capacité pour logements ou locaux professionnels.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Sols et carrelage",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : remplacer le sol d’un séjour ; matériau à choisir et support à inspecter.",
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
          q: "Quelles informations vérifier avant d’accepter une opportunité ?",
          a: "Examinez la surface approximative, le matériau, l’état connu du support et l’occupation des lieux. Précisez si la dépose et les gravats font partie de votre offre. Accepter le contact ne remplace pas l’inspection et ne fixe pas le prix de pose.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "move-in-refit",
      customer: {
        es: "Antes de una mudanza o reapertura, describa el piso y el acceso disponible; la instalación dependerá del material y la preparación.",
        en: "Before a move or reopening, describe the floor and available access; installation depends on material choice and preparation.",
        fr: "Avant un emménagement ou une réouverture, décrivez le sol et les possibilités d’accès ; la pose dépendra du matériau et de la préparation.",
      },
      provider: {
        es: "Declare capacidad para obras por etapas y locales ocupados antes de considerar proyectos ligados a mudanzas o reaperturas.",
        en: "Declare capacity for phased work and occupied premises before considering projects tied to moves or reopenings.",
        fr: "Précisez votre capacité pour des travaux par étapes ou en site occupé avant d’envisager les projets liés à un emménagement.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
