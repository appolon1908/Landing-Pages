import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "windows-doors",
  accent: "#426775",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Ventanas y puertas",
      headline: "¿Sus puertas o ventanas necesitan atención en Santo Domingo?",
      subhead:
        "Describa la reparación o el cambio que necesita, el material y cuántas piezas son. Las medidas, el sellado y los herrajes deberán revisarse antes de cotizar.",
      cta: "Cotizar puertas o ventanas",
      subtypes: [
        {
          value: "window-installation",
          label: "Instalación o cambio de ventanas",
        },
        {
          value: "door-installation",
          label: "Instalación o cambio de puertas",
        },
        {
          value: "hardware-repair",
          label: "Reparación de herrajes",
        },
        {
          value: "screens-sealing",
          label: "Mosquiteros y sellado",
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
          key: "opening-count",
          label: "Cantidad aproximada de puertas o ventanas",
          type: "number",
          required: false,
        },
        {
          key: "opening-material",
          label: "Material y problema de la puerta o ventana",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Consultas para instalar o sustituir puertas y ventanas.",
        "Evaluación de bisagras, rodamientos, cierres y otros herrajes.",
        "Revisión de mosquiteros y sellos según el tipo de abertura.",
      ],
      excluded: [
        "Resistencia certificada a tormentas sin producto y especificación comprobados.",
        "Vidrios especiales, obra de albañilería o pintura no incluidos en el presupuesto.",
        "Aperturas de cerradura o trabajos en altura fuera de la capacidad del proveedor.",
      ],
      priceFactors: [
        "Cantidad, dimensiones y material de las aberturas.",
        "Tipo de vidrio, herrajes, acabado y fabricación a medida.",
        "Estado del marco, acceso y retiro de piezas existentes.",
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
          q: "¿Debo enviar medidas exactas?",
          a: "Puede aportar medidas aproximadas para explicar el proyecto. La fabricación o compra debe basarse en una medición confirmada por el responsable de la instalación; una medida del formulario no sustituye esa revisión.",
        },
        {
          q: "¿Un sellado convierte la ventana en resistente a tormentas?",
          a: "No. El sellado y la resistencia del conjunto son cuestiones distintas. Cualquier afirmación sobre desempeño debe corresponder a un producto y una instalación específicos, con documentación disponible.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Windows and doors",
      headline: "Do your windows or doors need attention in Santo Domingo?",
      subhead:
        "Describe the repair or replacement, material and number of openings. Measurements, seals and hardware would need checking before a quote.",
      cta: "Request an installation quote",
      subtypes: [
        {
          value: "window-installation",
          label: "Window installation or replacement",
        },
        {
          value: "door-installation",
          label: "Door installation or replacement",
        },
        {
          value: "hardware-repair",
          label: "Hardware repair",
        },
        {
          value: "screens-sealing",
          label: "Screens and sealing",
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
          key: "opening-count",
          label: "Approximate number of doors or windows",
          type: "number",
          required: false,
        },
        {
          key: "opening-material",
          label: "Door or window material and problem",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Window and door installation or replacement inquiries.",
        "Assessment of hinges, rollers, catches and other hardware.",
        "Screen and seal inspections for the relevant opening type.",
      ],
      excluded: [
        "Certified storm resistance without a verified product specification.",
        "Special glazing, masonry or painting not included in the quote.",
        "Lock opening or work at height outside the provider's capabilities.",
      ],
      priceFactors: [
        "Number, dimensions and material of openings.",
        "Glazing, hardware, finish and custom fabrication.",
        "Frame condition, access and removal of existing units.",
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
          q: "Do I need exact measurements?",
          a: "Approximate measurements can help describe the project. Fabrication or purchasing must use measurements confirmed by the installer; figures entered in a form do not replace that check.",
        },
        {
          q: "Does sealing a window make it storm resistant?",
          a: "No. Sealing and the performance of the whole assembly are different matters. Any performance claim must relate to a specific product and installation with supporting documentation.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Fenêtres et portes",
      headline: "Des portes ou fenêtres à réparer à Santo Domingo ?",
      subhead:
        "Décrivez la réparation ou le remplacement, le matériau et le nombre d’ouvertures. Les mesures, les joints et la quincaillerie devront être vérifiés avant le devis.",
      cta: "Demander un devis de pose",
      subtypes: [
        {
          value: "window-installation",
          label: "Pose ou remplacement de fenêtres",
        },
        {
          value: "door-installation",
          label: "Pose ou remplacement de portes",
        },
        {
          value: "hardware-repair",
          label: "Réparation de quincaillerie",
        },
        {
          value: "screens-sealing",
          label: "Moustiquaires et joints",
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
          key: "opening-count",
          label: "Nombre approximatif de portes ou fenêtres",
          type: "number",
          required: false,
        },
        {
          key: "opening-material",
          label: "Matériau et problème de la porte ou fenêtre",
          type: "text",
          required: true,
        },
      ],
      included: [
        "Demandes de pose ou de remplacement de portes et fenêtres.",
        "Évaluation des charnières, roulettes, fermetures et autres pièces.",
        "Examen des moustiquaires et des joints selon le type d’ouverture.",
      ],
      excluded: [
        "Résistance certifiée aux tempêtes sans produit ni spécification vérifiés.",
        "Vitrages spéciaux, maçonnerie ou peinture non prévus au devis.",
        "Ouverture de serrure ou travail en hauteur hors des capacités du prestataire.",
      ],
      priceFactors: [
        "Nombre, dimensions et matériau des ouvertures.",
        "Vitrage, quincaillerie, finition et fabrication sur mesure.",
        "État du cadre, accès et dépose des éléments existants.",
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
          q: "Faut-il fournir des mesures exactes ?",
          a: "Des mesures approximatives aident à décrire le projet. La fabrication ou l’achat doit reposer sur des dimensions confirmées par le responsable de la pose ; les mesures du formulaire ne remplacent pas cette vérification.",
        },
        {
          q: "Un nouveau joint rend-il une fenêtre résistante aux tempêtes ?",
          a: "Non. L’étanchéité des joints et la résistance de l’ensemble sont deux sujets distincts. Toute performance annoncée doit concerner un produit et une pose précis, avec une documentation à l’appui.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Ventanas y puertas",
      headline: "Conecte con proyectos de puertas y ventanas.",
      subhead:
        "Detalle los materiales, herrajes y tipos de instalación que atiende. La selección de oportunidades consideraría medidas aproximadas, zona y acceso.",
      cta: "Postular para puertas y ventanas",
      fit: [
        "Instaladores y talleres de puertas o ventanas.",
        "Especialistas en herrajes, mosquiteros y sellado.",
        "Empresas que distinguen reparación, fabricación y montaje en su alcance.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Ventanas y puertas",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: revisar dos ventanas corredizas con cierre difícil; material y medidas pendientes de confirmar.",
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
          q: "¿Puedo limitar las solicitudes a los materiales que trabajo?",
          a: "Sí, esa preferencia debe formar parte de su perfil antes de activar oportunidades. Declare materiales, herrajes y limitaciones de acceso; no se debe interpretar una solicitud de sellado como fabricación o certificación del conjunto.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Windows and doors",
      headline: "Find suitable window and door projects.",
      subhead:
        "Describe the materials, hardware and installation types you support. Proposed matching would consider approximate dimensions, area and access.",
      cta: "Apply for window-and-door leads",
      fit: [
        "Window and door installers and fabrication workshops.",
        "Specialists in hardware, screens and sealing.",
        "Companies that distinguish repair, fabrication and installation in their scope.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Windows and doors",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: inspect two sliding windows that are difficult to close; material and measurements await confirmation.",
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
          q: "Can I receive inquiries only for materials I work with?",
          a: "That preference should be part of your profile before opportunities are activated. Declare materials, hardware and access limits. A sealing inquiry must not be treated as a request for fabrication or certification of the entire assembly.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Fenêtres et portes",
      headline: "Des projets de portes et fenêtres dans votre spécialité.",
      subhead:
        "Précisez les matériaux, la quincaillerie et les types de pose pris en charge. Les dimensions approximatives, la zone et l’accès guideraient la sélection.",
      cta: "Proposer mes services de pose",
      fit: [
        "Poseurs et ateliers de fabrication de portes ou fenêtres.",
        "Spécialistes de la quincaillerie, des moustiquaires et des joints.",
        "Entreprises qui distinguent réparation, fabrication et pose dans leur offre.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Fenêtres et portes",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : examiner deux fenêtres coulissantes difficiles à fermer ; matériau et dimensions à confirmer.",
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
          q: "Puis-je limiter les demandes aux matériaux que je travaille ?",
          a: "Cette préférence doit figurer dans votre profil avant l’activation des opportunités. Précisez les matériaux, les pièces et les limites d’accès. Une demande de joints ne doit pas devenir implicitement une prestation de fabrication ou de certification de l’ensemble.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "weather-sealing",
      customer: {
        es: "Antes de períodos lluviosos, describa filtraciones o cierres defectuosos para una evaluación; no se promete protección frente a tormentas.",
        en: "Before rainy periods, describe leaks or faulty closures for assessment; storm protection is not promised.",
        fr: "Avant les périodes pluvieuses, décrivez les infiltrations ou les fermetures défectueuses à évaluer ; aucune protection contre les tempêtes n’est promise.",
      },
      provider: {
        es: "Actualice capacidad para sellado y herrajes, indicando los materiales y condiciones de acceso que puede atender.",
        en: "Update capacity for sealing and hardware work, including supported materials and access conditions.",
        fr: "Actualisez votre capacité pour les joints et la quincaillerie, en précisant matériaux et conditions d’accès.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
