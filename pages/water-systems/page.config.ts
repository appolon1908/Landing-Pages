import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "water-systems",
  accent: "#346c79",
  layout: "customer-provider",
  group: "home",
  pilot: false,
  customer: {
    es: {
      name: "Cisternas, bombas y filtración",
      headline:
        "¿Su cisterna, bomba o filtro necesita atención en Santo Domingo?",
      subhead:
        "Describa el sistema y el problema: limpieza pendiente, bombeo o filtración. Un proveedor tendría que evaluar acceso, equipo y alcance antes de proponer el servicio.",
      cta: "Solicitar servicio de agua",
      subtypes: [
        {
          value: "tank-cleaning",
          label: "Limpieza de cisterna o tinaco",
        },
        {
          value: "pump-repair",
          label: "Revisión de bomba",
        },
        {
          value: "filtration-service",
          label: "Mantenimiento de filtración",
        },
        {
          value: "water-system-installation",
          label: "Instalación de equipo",
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
          key: "system-description",
          label: "Tipo de sistema y problema observado",
          type: "text",
          required: true,
        },
        {
          key: "equipment-brand",
          label: "Marca del equipo, si la conoce",
          type: "text",
          required: false,
        },
      ],
      included: [
        "Consultas de limpieza programada de cisternas y tinacos.",
        "Evaluación de bombas y equipos de suministro.",
        "Revisión o mantenimiento de filtración según equipo y especialidad.",
      ],
      excluded: [
        "Certificados de potabilidad o resultados de laboratorio no contratados.",
        "Obra estructural, acceso confinado o trabajos eléctricos fuera del alcance evaluado.",
        "Filtros, repuestos, transporte de agua o vaciado no incluidos en la cotización.",
      ],
      priceFactors: [
        "Tipo, capacidad y estado del sistema.",
        "Acceso, preparación y alcance de limpieza o diagnóstico.",
        "Consumibles, repuestos compatibles y trabajos adicionales acordados.",
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
          q: "¿La limpieza confirma que el agua es potable?",
          a: "No por sí sola. La limpieza, la filtración y un análisis de calidad son prestaciones distintas. Pida que se describa qué evaluación o documentación se incluye; esta página no certifica el agua.",
        },
        {
          q: "¿Debo conocer la marca de la bomba o filtro?",
          a: "Si la conoce, inclúyala junto con el modelo y lo que observa. Si no, describa el sistema sin desmontarlo para completar el formulario. El proveedor deberá identificar el equipo antes de proponer piezas o trabajos.",
        },
      ],
      confirmation:
        "Solicitud recibida. Se revisarán el alcance, la zona y la disponibilidad antes de proponer un proveedor. Conserve la referencia mostrada para solicitar cambios o comunicar un problema. Esta confirmación no reserva una visita; la cita se acuerda con el proveedor.",
    },
    en: {
      name: "Water tanks, pumps and filtration",
      headline: "Need help with a tank, pump or filter in Santo Domingo?",
      subhead:
        "Describe the system and whether it needs cleaning, pump assessment or filtration care. A provider would need to review access, equipment and scope before proposing service.",
      cta: "Request water-system service",
      subtypes: [
        {
          value: "tank-cleaning",
          label: "Cistern or tank cleaning",
        },
        {
          value: "pump-repair",
          label: "Pump assessment",
        },
        {
          value: "filtration-service",
          label: "Filtration maintenance",
        },
        {
          value: "water-system-installation",
          label: "Equipment installation",
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
          key: "system-description",
          label: "System type and observed problem",
          type: "text",
          required: true,
        },
        {
          key: "equipment-brand",
          label: "Equipment brand, if known",
          type: "text",
          required: false,
        },
      ],
      included: [
        "Scheduled cistern and water-tank cleaning inquiries.",
        "Assessment of pumps and water-supply equipment.",
        "Filtration inspection or maintenance within the provider's specialty.",
      ],
      excluded: [
        "Drinking-water certification or laboratory results not separately commissioned.",
        "Structural work, confined access or electrical work outside the assessed scope.",
        "Filters, parts, delivered water or emptying unless included in the quote.",
      ],
      priceFactors: [
        "System type, capacity and condition.",
        "Access, preparation and cleaning or diagnostic scope.",
        "Consumables, compatible parts and agreed additional work.",
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
          q: "Does cleaning confirm the water is safe to drink?",
          a: "Not on its own. Cleaning, filtration and water-quality analysis are separate services. Ask which assessment or documentation is included; this page does not certify water quality.",
        },
        {
          q: "Do I need the pump or filter brand?",
          a: "Include the brand, model and what you have observed if known. Otherwise describe the system without dismantling it just to complete the form. The provider would need to identify the equipment before recommending parts or work.",
        },
      ],
      confirmation:
        "Request received. Scope, area and availability will be reviewed before a provider is proposed. Keep the displayed reference when requesting changes or reporting a problem. This confirmation does not book a visit; you and the provider must agree on an appointment.",
    },
    fr: {
      name: "Citernes, pompes et filtration",
      headline: "Une citerne, pompe ou filtration à revoir à Santo Domingo ?",
      subhead:
        "Décrivez le système et le besoin de nettoyage, de pompage ou de filtration. Le prestataire devra examiner l’accès, l’équipement et le périmètre avant de proposer une intervention.",
      cta: "Demander un entretien du système",
      subtypes: [
        {
          value: "tank-cleaning",
          label: "Nettoyage de citerne ou réservoir",
        },
        {
          value: "pump-repair",
          label: "Contrôle de pompe",
        },
        {
          value: "filtration-service",
          label: "Entretien de filtration",
        },
        {
          value: "water-system-installation",
          label: "Installation d’équipement",
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
          key: "system-description",
          label: "Type de système et problème constaté",
          type: "text",
          required: true,
        },
        {
          key: "equipment-brand",
          label: "Marque de l’équipement, si connue",
          type: "text",
          required: false,
        },
      ],
      included: [
        "Demandes de nettoyage programmé de citernes et de réservoirs.",
        "Évaluation de pompes et d’équipements d’alimentation en eau.",
        "Contrôle ou entretien de filtration selon la spécialité du prestataire.",
      ],
      excluded: [
        "Certification de potabilité ou analyses de laboratoire non commandées.",
        "Travaux structurels, accès confiné ou électricité hors du périmètre évalué.",
        "Filtres, pièces, livraison d’eau ou vidange non prévus au devis.",
      ],
      priceFactors: [
        "Type, capacité et état du système.",
        "Accès, préparation et périmètre du nettoyage ou du diagnostic.",
        "Consommables, pièces compatibles et travaux supplémentaires convenus.",
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
          q: "Un nettoyage confirme-t-il la potabilité de l’eau ?",
          a: "Pas à lui seul. Le nettoyage, la filtration et l’analyse de la qualité de l’eau sont des prestations distinctes. Demandez quelles évaluations ou quels documents sont inclus ; cette page ne certifie pas la qualité de l’eau.",
        },
        {
          q: "Faut-il connaître la marque de la pompe ou du filtre ?",
          a: "Si vous les connaissez, indiquez la marque, le modèle et vos observations. Sinon, décrivez le système sans le démonter pour remplir le formulaire. Le prestataire devra identifier l’équipement avant de proposer des pièces ou des travaux.",
        },
      ],
      confirmation:
        "Demande reçue. Le périmètre, la zone et les disponibilités seront examinés avant de proposer un prestataire. Conservez la référence affichée pour toute modification ou tout signalement. Cette confirmation ne réserve aucune visite ; le rendez-vous reste à convenir avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Cisternas, bombas y filtración",
      headline: "Conecte con solicitudes de cisternas, bombas y filtración.",
      subhead:
        "Precise qué sistemas atiende y sus condiciones de acceso. Las oportunidades se evaluarían según zona, equipo, alcance de limpieza y capacidad declarada.",
      cta: "Postular para sistemas de agua",
      fit: [
        "Empresas y técnicos de mantenimiento de cisternas, tinacos y bombas.",
        "Especialistas en equipos de filtración con alcance claramente definido.",
        "Equipos que evalúan acceso y separan limpieza, diagnóstico y obra adicional.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio · Distrito Nacional",
        service: "Cisternas, bombas y filtración",
        urgency: "Fecha flexible; ninguna visita confirmada",
        scope:
          "Ejemplo ficticio: evaluar limpieza de una cisterna residencial y revisar la bomba; acceso y capacidad por confirmar.",
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
          q: "¿Cómo diferencio limpieza, reparación y evaluación de calidad?",
          a: "Declare cada servicio por separado y qué evidencia puede entregar. Una solicitud de limpieza no autoriza reparaciones, análisis ni certificaciones; el alcance debe confirmarse antes de cotizar o comprometer recursos.",
        },
      ],
      confirmation:
        "Postulación recibida y pendiente de revisión. Se evaluarán los servicios declarados y los requisitos de verificación antes de indicar los siguientes pasos. Conserve la referencia mostrada. Esta confirmación no activa una cuenta, una suscripción ni cobros.",
    },
    en: {
      name: "Water tanks, pumps and filtration",
      headline: "Find tank, pump and filtration service inquiries.",
      subhead:
        "Specify supported systems and access requirements. Proposed matching would consider area, equipment, cleaning scope and declared capacity.",
      cta: "Apply for water-system leads",
      fit: [
        "Technicians and companies maintaining cisterns, tanks and pumps.",
        "Filtration specialists with clearly defined equipment scope.",
        "Teams that assess access and distinguish cleaning, diagnostics and additional work.",
      ],
      exampleLead: {
        area: "Fictional example · Distrito Nacional",
        service: "Water tanks, pumps and filtration",
        urgency: "Flexible timing; no visit confirmed",
        scope:
          "Fictional example: assess cleaning of a residential cistern and inspect its pump; access and capacity await confirmation.",
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
          q: "How should cleaning, repair and water-quality assessment be separated?",
          a: "Declare each service and the evidence you can provide. A cleaning inquiry does not authorize repairs, analysis or certification. Confirm scope before quoting or committing resources.",
        },
      ],
      confirmation:
        "Application received and awaiting review. Declared services and verification requirements will be assessed before next steps are provided. Keep the displayed reference. This confirmation does not activate an account, subscription or billing.",
    },
    fr: {
      name: "Citernes, pompes et filtration",
      headline: "Des demandes pour citernes, pompes et filtration.",
      subhead:
        "Précisez les systèmes pris en charge et les conditions d’accès. La zone, le matériel, le périmètre du nettoyage et votre capacité guideraient la sélection.",
      cta: "Proposer mes services d’entretien",
      fit: [
        "Techniciens et entreprises d’entretien de citernes, réservoirs et pompes.",
        "Spécialistes de la filtration au périmètre matériel défini.",
        "Équipes qui distinguent nettoyage, diagnostic et travaux supplémentaires.",
      ],
      exampleLead: {
        area: "Exemple fictif · Distrito Nacional",
        service: "Citernes, pompes et filtration",
        urgency: "Date flexible ; aucune visite confirmée",
        scope:
          "Exemple fictif : étudier le nettoyage d’une citerne résidentielle et le contrôle de sa pompe ; accès et capacité à confirmer.",
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
          q: "Comment distinguer nettoyage, réparation et analyse de qualité ?",
          a: "Déclarez séparément chaque prestation et les justificatifs que vous pouvez fournir. Une demande de nettoyage n’autorise ni réparation, ni analyse, ni certification. Confirmez le périmètre avant de chiffrer ou de mobiliser des moyens.",
        },
      ],
      confirmation:
        "Candidature reçue, en attente d’examen. Les prestations déclarées et les exigences de vérification seront étudiées avant de préciser la suite. Conservez la référence affichée. Cette confirmation n’active ni compte, ni abonnement, ni facturation.",
    },
  },
  seasonal: [
    {
      trigger: "scheduled-water-care",
      customer: {
        es: "Planifique el cuidado de cisternas, bombas y filtros según su uso y estado; no se presume que un cambio de temporada determine la calidad del agua.",
        en: "Plan tank, pump and filter care around usage and condition; a change in season alone does not establish water quality.",
        fr: "Planifiez l’entretien selon l’utilisation et l’état des équipements ; un changement de saison ne permet pas de conclure sur la qualité de l’eau.",
      },
      provider: {
        es: "Actualice capacidad para mantenimiento programado y condiciones de acceso, sin ofrecer certificaciones o servicios fuera de su especialidad.",
        en: "Update scheduled maintenance capacity and access requirements without offering certification or work outside your specialty.",
        fr: "Actualisez votre capacité d’entretien programmé et vos conditions d’accès, sans annoncer de certification hors de votre spécialité.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
