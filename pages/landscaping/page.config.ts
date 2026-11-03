import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "landscaping",
  accent: "#166534",
  group: "home",
  pilot: false,
  layout: "customer-provider",
  customer: {
    es: {
      name: "Jardinería y paisajismo",
      headline: "¿Su jardín necesita atención en Santo Domingo?",
      subhead:
        "Describa el jardín y si busca mantenimiento o un proyecto de paisajismo. Solicite una cotización según el espacio, las plantas y las tareas que necesita.",
      cta: "Solicitar cotización de jardinería",
      subtypes: [
        {
          value: "garden-maintenance",
          label: "Mantenimiento de jardín",
        },
        {
          value: "lawn-care",
          label: "Cuidado de césped",
        },
        {
          value: "planting",
          label: "Siembra y plantación",
        },
        {
          value: "landscape-project",
          label: "Proyecto de paisajismo",
        },
        {
          value: "garden-cleanup",
          label: "Limpieza de jardín",
        },
      ],
      urgency: [
        {
          value: "today",
          label: "Hoy, si hay disponibilidad",
        },
        {
          value: "this-week",
          label: "Esta semana, si hay disponibilidad",
        },
        {
          value: "flexible",
          label: "Fecha flexible",
        },
      ],
      extraFields: [],
      included: [
        "Consulta para mantenimiento de jardines y césped.",
        "Definición de tareas de siembra o renovación.",
        "Evaluación de proyectos de paisajismo.",
      ],
      excluded: [
        "Plantas, tierra, abono y materiales se cotizan por separado salvo acuerdo.",
        "La poda en altura y el retiro de árboles corresponden a un alcance especializado.",
        "No se garantiza el crecimiento de plantas ni se incluyen obras de drenaje sin evaluación.",
      ],
      priceFactors: [
        "Superficie y estado del jardín.",
        "Tareas, frecuencia y materiales elegidos.",
        "Acceso, retiro de residuos y alcance del proyecto.",
      ],
      steps: [
        "Describa el trabajo, su zona y la fecha que prefiere.",
        "Se revisará si hay un proveedor compatible; la solicitud no confirma disponibilidad.",
        "Acuerde con el proveedor el alcance, el presupuesto y, después, la cita.",
      ],
      faq: [
        {
          q: "¿Qué información debo incluir en la solicitud?",
          a: "Indique si necesita mantenimiento, cuidado del césped o un cambio de diseño. Describa el tamaño aproximado del espacio y si hay plantas que desea conservar. El proveedor revisará qué tareas son adecuadas.",
        },
        {
          q: "¿De qué depende el presupuesto?",
          a: "Superficie y estado del jardín. Tareas, frecuencia y materiales elegidos. Acceso, retiro de residuos y alcance del proyecto. El proveedor debe explicar el alcance y el precio antes de que usted apruebe el trabajo. Esta página no publica una tarifa.",
        },
        {
          q: "¿Atienden mi zona y la fecha que necesito?",
          a: "La cobertura y los horarios del piloto están pendientes de confirmación. Indique su zona y la fecha preferida; no se promete disponibilidad ni un plazo de respuesta. Si no hay un proveedor compatible, no debe presentarse la solicitud como aceptada por uno.",
        },
        {
          q: "¿Enviar la solicitud o recibir una visita tiene algún costo?",
          a: "Las condiciones del servicio aún deben publicarse. No suponga que una visita, una inspección o un presupuesto presencial son gratuitos. Antes de aceptar una visita, confirme cualquier cargo y qué incluye; no apruebe trabajo sin conocer su alcance.",
        },
        {
          q: "¿Quién recibe mis datos y quién realiza el trabajo?",
          a: "En el flujo propuesto, con su permiso se comparte la solicitud y el contacto con un proveedor independiente compatible. Usted acuerda con ese proveedor el trabajo, el pago y cualquier garantía. El permiso para promociones es opcional y está separado del contacto por este servicio.",
        },
        {
          q: "¿La solicitud reserva una cita y cómo puedo cambiarla?",
          a: "No. La cita solo queda acordada cuando usted y el proveedor la confirman. Conserve la referencia que se emita para pedir cambios o cancelación. El canal de seguimiento, las condiciones de cancelación y el procedimiento de reclamos deben publicarse antes de habilitar el servicio.",
        },
      ],
      confirmation:
        "Su solicitud ha sido recibida y está pendiente de revisión para comprobar si hay un proveedor compatible. Conserve la referencia mostrada para el seguimiento. Esto no confirma una cita: deberá acordar el presupuesto y la visita con el proveedor.",
    },
    en: {
      name: "Landscaping and lawn care",
      headline: "Does your garden need attention in Santo Domingo?",
      subhead:
        "Describe your garden and whether you need maintenance or a landscaping project. Request a quote based on the space, plants and tasks involved.",
      cta: "Get a landscaping quote",
      subtypes: [
        {
          value: "garden-maintenance",
          label: "Garden maintenance",
        },
        {
          value: "lawn-care",
          label: "Lawn care",
        },
        {
          value: "planting",
          label: "Planting",
        },
        {
          value: "landscape-project",
          label: "Landscaping project",
        },
        {
          value: "garden-cleanup",
          label: "Garden cleanup",
        },
      ],
      urgency: [
        {
          value: "today",
          label: "Today, subject to availability",
        },
        {
          value: "this-week",
          label: "This week, subject to availability",
        },
        {
          value: "flexible",
          label: "Flexible timing",
        },
      ],
      extraFields: [],
      included: [
        "Garden and lawn maintenance inquiries.",
        "Scoping of planting or garden refresh tasks.",
        "Landscaping project assessments.",
      ],
      excluded: [
        "Plants, soil, fertilizer and materials are quoted separately unless agreed.",
        "Work on tall trees and tree removal require specialist scoping.",
        "Plant growth is not guaranteed; drainage works need assessment.",
      ],
      priceFactors: [
        "Garden area and current condition.",
        "Tasks, frequency and selected materials.",
        "Access, waste removal and project scope.",
      ],
      steps: [
        "Describe the work, your area and preferred timing.",
        "Availability of a suitable provider must be checked; a request does not confirm a match.",
        "Agree on scope and a quote with the provider, then confirm an appointment.",
      ],
      faq: [
        {
          q: "What information should I include?",
          a: "Say whether you need maintenance, lawn care or a design change. Describe the approximate space and plants you want to keep. The provider will assess suitable tasks.",
        },
        {
          q: "What affects the quote?",
          a: "Garden area and current condition. Tasks, frequency and selected materials. Access, waste removal and project scope. The provider should explain the scope and price before you approve any work. This page does not publish a fixed fee.",
        },
        {
          q: "Do you cover my area and preferred date?",
          a: "Pilot coverage and operating hours are pending confirmation. State your area and preferred timing; availability and a response deadline are not promised. If no suitable provider is available, the request must not be presented as accepted by one.",
        },
        {
          q: "Is there a charge for a request or a visit?",
          a: "Service terms still need to be published. Do not assume a visit, inspection or on-site estimate is free. Before accepting a visit, confirm any charge and what it covers; agree on the work scope before authorizing it.",
        },
        {
          q: "Who receives my details and performs the work?",
          a: "In the proposed flow, your permission allows the request and contact details to be shared with a suitable independent provider. You agree on work, payment and any warranty with that provider. Promotional permission is optional and separate from contact about this service.",
        },
        {
          q: "Does a request book a visit, and can I change it?",
          a: "No. An appointment is agreed only when you and the provider confirm it. Keep any request reference to ask for changes or cancellation. The follow-up channel, cancellation terms and complaints process must be published before the service is enabled.",
        },
      ],
      confirmation:
        "Your request has been received and is pending review for a suitable provider. Keep the displayed reference for follow-up. This does not confirm an appointment: agree on the quote and visit with the provider.",
    },
    fr: {
      name: "Jardinage et aménagement paysager",
      headline: "Votre jardin a besoin d’entretien à Santo Domingo ?",
      subhead:
        "Décrivez votre jardin et votre projet d’entretien ou d’aménagement. Demandez un devis adapté à l’espace, aux plantations et aux travaux souhaités.",
      cta: "Demander un devis paysager",
      subtypes: [
        {
          value: "garden-maintenance",
          label: "Entretien du jardin",
        },
        {
          value: "lawn-care",
          label: "Entretien de pelouse",
        },
        {
          value: "planting",
          label: "Plantation",
        },
        {
          value: "landscape-project",
          label: "Projet paysager",
        },
        {
          value: "garden-cleanup",
          label: "Remise en état du jardin",
        },
      ],
      urgency: [
        {
          value: "today",
          label: "Aujourd’hui, selon disponibilité",
        },
        {
          value: "this-week",
          label: "Cette semaine, selon disponibilité",
        },
        {
          value: "flexible",
          label: "Date flexible",
        },
      ],
      extraFields: [],
      included: [
        "Demande d’entretien de jardin ou de pelouse.",
        "Définition de travaux de plantation ou de renouvellement.",
        "Évaluation de projets d’aménagement paysager.",
      ],
      excluded: [
        "Plantes, terre, fertilisants et matériaux sont chiffrés séparément sauf accord.",
        "Les travaux en hauteur sur les arbres et l’abattage nécessitent une étude spécialisée.",
        "La croissance des plantes n’est pas garantie ; le drainage exige une évaluation.",
      ],
      priceFactors: [
        "Surface et état actuel du jardin.",
        "Travaux, fréquence et matériaux choisis.",
        "Accès, évacuation des déchets et ampleur du projet.",
      ],
      steps: [
        "Décrivez les travaux, votre quartier et la période souhaitée.",
        "La disponibilité d’un prestataire adapté doit être vérifiée ; la demande ne confirme pas de mise en relation.",
        "Convenez avec le prestataire des travaux et du devis, puis du rendez-vous.",
      ],
      faq: [
        {
          q: "Quelles informations dois-je fournir ?",
          a: "Précisez s’il s’agit d’entretien, de pelouse ou d’un nouvel aménagement. Décrivez la surface approximative et les végétaux à conserver. Le prestataire évaluera les travaux adaptés.",
        },
        {
          q: "De quoi dépend le devis ?",
          a: "Surface et état actuel du jardin. Travaux, fréquence et matériaux choisis. Accès, évacuation des déchets et ampleur du projet. Le prestataire doit expliquer les travaux et leur prix avant votre accord. Cette page ne publie pas de tarif fixe.",
        },
        {
          q: "Mon secteur et la date souhaitée sont-ils couverts ?",
          a: "Les secteurs et horaires du pilote restent à confirmer. Indiquez votre quartier et la période souhaitée ; aucune disponibilité ni aucun délai de réponse n’est promis. Sans prestataire adapté, la demande ne doit pas être présentée comme acceptée par un professionnel.",
        },
        {
          q: "La demande ou la visite est-elle payante ?",
          a: "Les conditions du service restent à publier. Ne présumez pas qu’une visite, une inspection ou un devis sur place est gratuit. Avant d’accepter une visite, faites préciser les frais éventuels et ce qu’ils couvrent ; convenez des travaux avant de les autoriser.",
        },
        {
          q: "Qui reçoit mes coordonnées et réalise les travaux ?",
          a: "Dans le parcours proposé, votre accord permet de partager la demande et vos coordonnées avec un prestataire indépendant adapté. Vous convenez avec lui des travaux, du paiement et d’une éventuelle garantie. L’accord pour les promotions est facultatif et distinct du contact pour ce service.",
        },
        {
          q: "La demande réserve-t-elle un rendez-vous ? Puis-je la modifier ?",
          a: "Non. Un rendez-vous est convenu lorsque vous et le prestataire le confirmez. Conservez la référence émise pour demander une modification ou une annulation. Le suivi, les conditions d’annulation et le traitement des réclamations doivent être publiés avant l’activation du service.",
        },
      ],
      confirmation:
        "Votre demande a été reçue et attend un examen pour rechercher un prestataire adapté. Conservez la référence affichée pour le suivi. Aucun rendez-vous n’est confirmé : convenez du devis et de la visite avec le prestataire.",
    },
  },
  provider: {
    es: {
      name: "Jardinería y paisajismo",
      headline: "Reciba solicitudes de jardinería y paisajismo",
      subhead:
        "Indique sus zonas, el equipo disponible y los trabajos que realiza. Diferencie mantenimiento recurrente de proyectos que requieren diseño o materiales.",
      cta: "Postularme para jardinería",
      fit: [
        "Jardineros, equipos y empresas de paisajismo.",
        "Capacidad declarada para mantenimiento o proyectos según especialidad.",
        "Disposición para detallar materiales y manejo de residuos.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio — Santo Domingo Este",
        service: "Jardinería y paisajismo",
        urgency: "Fecha flexible; disponibilidad sin confirmar",
        scope:
          "Un hogar pide mantenimiento de un jardín con césped y plantas ornamentales. La frecuencia, los materiales y el retiro de residuos siguen por definir.",
      },
      qualification: [
        "Criterios propuestos para revisar cada solicitud; una consulta sin comprobar no se presenta como calificada.",
        "Necesidad real y datos de contacto válidos.",
        "Servicio compatible con la especialidad declarada.",
        "Zona dentro de la cobertura y capacidad confirmadas por el proveedor.",
        "Permiso para compartir la solicitud y contactar al cliente por el servicio.",
        "Revisión de duplicados antes de asignar o proponer un cobro.",
      ],
      leadModel:
        "Modelo propuesto, pendiente de confirmar sus condiciones operativas: una solicitud calificada se reserva para un solo proveedor durante un plazo comunicado antes de decidir. Solo se cobra después de que el proveedor la acepta. Exclusividad significa que la plataforma no envía esa solicitud a otro proveedor; no significa que el cliente no haya contactado a otros. No se garantiza contratación ni ingresos.",
      commercialTerms: [
        "Precio por solicitud aceptada: [OWNER: lead price].",
        "Plazo para aceptar: [OWNER: acceptance window].",
        "Plazo y condiciones para solicitar crédito: [OWNER: credit window].",
        "Los cargos, límites de gasto, pausas y criterios de crédito deben comunicarse y aceptarse antes de activar el servicio.",
        "No hay cobros ni aceptación automática habilitados en esta vista previa. La solicitud de registro no autoriza cargos.",
      ],
      controls: [
        "Preferencias propuestas: zonas, especialidades, idiomas y horarios declarados.",
        "Capacidad y disponibilidad que deberá confirmar antes de aceptar trabajo.",
        "Pausa de nuevas solicitudes y límite de gasto, sujetos a condiciones aún por aprobar.",
        "Consulta de la referencia, del estado y del motivo de cualquier cargo cuando el servicio esté habilitado.",
      ],
      workflow: [
        "Presente su solicitud de registro con sus servicios y zonas.",
        "Complete la revisión y la documentación que corresponda; la candidatura sigue pendiente hasta una decisión.",
        "Defina preferencias, capacidad y condiciones comerciales antes de la activación.",
        "Revise cada oportunidad y acepte solo las que pueda atender bajo las condiciones comunicadas.",
        "Contacte al cliente con su permiso para acordar alcance, presupuesto y cita.",
        "Informe el resultado y cualquier incidencia; conserve la referencia de la solicitud.",
      ],
      faq: [
        {
          q: "¿Quién puede solicitar el registro?",
          a: "Jardineros, equipos y empresas de paisajismo. Capacidad declarada para mantenimiento o proyectos según especialidad. Disposición para detallar materiales y manejo de residuos. Declare únicamente las competencias y los documentos que pueda respaldar. La revisión no equivale a un sello de verificación ni garantiza la aprobación.",
        },
        {
          q: "¿Se garantiza trabajo o una cantidad de solicitudes?",
          a: "No. El registro y la aceptación de una solicitud no garantizan contratación, ingresos ni un volumen de oportunidades. El cliente decide con quién trabajar; usted debe valorar el alcance y su capacidad antes de aceptar.",
        },
        {
          q: "¿Qué significa que una solicitud sea exclusiva?",
          a: "Según el modelo propuesto, la plataforma reserva una solicitud calificada para un solo proveedor durante el plazo comunicado. No la envía a otro proveedor bajo esa reserva. El cliente puede haber consultado por su cuenta a otras empresas; exclusividad no significa un trabajo asegurado.",
        },
        {
          q: "¿Cuándo se cobra y qué ocurre si la solicitud no cumple los criterios?",
          a: "El modelo propuesto contempla cobrar solo después de aceptar una solicitud calificada. Precio, plazo de aceptación y política de créditos están pendientes del propietario. Deben conocerse y aceptarse antes de activar el servicio; esta vista previa no habilita cobros.",
        },
        {
          q: "¿Puedo limitar zonas, pausar solicitudes o cerrar la cuenta?",
          a: "Esos controles forman parte del servicio propuesto y deben confirmarse antes de activarlo. Declare sus zonas, especialidades y capacidad real. Las condiciones para pausar, modificar preferencias o cerrar la cuenta deben estar disponibles antes de asumir compromisos.",
        },
        {
          q: "¿Cómo se gestionan los contactos, el soporte y los reclamos?",
          a: "Use los datos únicamente para atender la solicitud autorizada; recibir un contacto no concede permiso para promociones. Conserve su referencia y registre incidencias. Los canales y horarios de soporte, así como el proceso de reclamos, siguen pendientes de publicación.",
        },
      ],
      confirmation:
        "Su solicitud de registro ha sido recibida y está pendiente de revisión. El siguiente paso es revisar sus servicios, zonas y la documentación que corresponda. Conserve la referencia mostrada. Esto no activa una cuenta, no autoriza cargos ni garantiza solicitudes.",
    },
    en: {
      name: "Landscaping and lawn care",
      headline: "Find gardening and landscaping inquiries",
      subhead:
        "State your areas, available equipment and services. Distinguish recurring maintenance from projects requiring design or materials.",
      cta: "Apply for landscaping leads",
      fit: [
        "Gardeners, teams and landscaping businesses.",
        "Declared capacity for maintenance or projects within their specialty.",
        "Willingness to itemize materials and waste handling.",
      ],
      exampleLead: {
        area: "Fictional example — Santo Domingo Este",
        service: "Landscaping and lawn care",
        urgency: "Flexible timing; availability unconfirmed",
        scope:
          "A household requests care for a garden with lawn and ornamental plants. Frequency, supplies and waste removal remain to be agreed.",
      },
      qualification: [
        "Proposed review criteria for each request; an unchecked inquiry is not described as qualified.",
        "A genuine need and valid contact details.",
        "A service matching the provider’s declared specialty.",
        "An area within coverage and capacity confirmed by the provider.",
        "Permission to share the request and contact the customer about the service.",
        "Duplicate review before assignment or any proposed charge.",
      ],
      leadModel:
        "Proposed model, pending confirmation of its operating terms: one qualified request is reserved for one provider for an acceptance period disclosed in advance. A charge occurs only after the provider accepts. Exclusivity means the platform does not send that request to another provider; it does not mean the customer has contacted nobody else. Work and income are not guaranteed.",
      commercialTerms: [
        "Price per accepted request: [OWNER: lead price].",
        "Acceptance period: [OWNER: acceptance window].",
        "Credit request period and conditions: [OWNER: credit window].",
        "Charges, spending caps, pause controls and credit criteria must be disclosed and accepted before service activation.",
        "No charges or automatic acceptance are enabled in this preview. Applying does not authorize charges.",
      ],
      controls: [
        "Proposed preferences: declared areas, specialties, languages and hours.",
        "Capacity and availability to confirm before accepting work.",
        "Pausing new requests and setting a spending cap, subject to terms still to be approved.",
        "Access to request references, status and reasons for any charge when service is enabled.",
      ],
      workflow: [
        "Apply with your services and coverage areas.",
        "Complete the relevant review and documentation; the application remains pending until a decision.",
        "Set preferences, capacity and commercial terms before activation.",
        "Review each opportunity and accept only work you can handle under the disclosed terms.",
        "Contact the customer with permission to agree on scope, a quote and an appointment.",
        "Report the outcome and any issue; keep the request reference.",
      ],
      faq: [
        {
          q: "Who can apply?",
          a: "Gardeners, teams and landscaping businesses. Declared capacity for maintenance or projects within their specialty. Willingness to itemize materials and waste handling. Declare only skills and documentation you can substantiate. Review is not a verification badge and does not guarantee approval.",
        },
        {
          q: "Are jobs or a number of requests guaranteed?",
          a: "No. Applying or accepting a request does not guarantee a job, income or an opportunity volume. Customers choose whom to hire; assess the scope and your capacity before accepting.",
        },
        {
          q: "What does an exclusive request mean?",
          a: "Under the proposed model, the platform reserves one qualified request for one provider for the disclosed period and does not send it to another provider during that reservation. The customer may have contacted other businesses independently; exclusivity does not guarantee the work.",
        },
        {
          q: "When am I charged, and what if the request fails the criteria?",
          a: "The proposed model charges only after acceptance of a qualified request. The price, acceptance period and credit policy await owner confirmation. They must be disclosed and accepted before activation; this preview does not enable charges.",
        },
        {
          q: "Can I limit areas, pause requests or close my account?",
          a: "These controls are part of the proposed service and must be confirmed before activation. Declare your actual areas, specialties and capacity. Terms for pausing, changing preferences or closing an account must be available before commitments are made.",
        },
        {
          q: "How are contacts, support and complaints handled?",
          a: "Use details only for the authorized service request; receiving a contact does not grant promotional permission. Keep the reference and record issues. Support channels, hours and the complaints process remain to be published.",
        },
      ],
      confirmation:
        "Your application has been received and is pending review. The next step is to review your services, areas and relevant documentation. Keep the displayed reference. This does not activate an account, authorize charges or guarantee requests.",
    },
    fr: {
      name: "Jardinage et aménagement paysager",
      headline: "Recevez des demandes de jardinage et d’aménagement",
      subhead:
        "Précisez vos secteurs, votre matériel et vos prestations. Distinguez l’entretien régulier des projets nécessitant une conception ou des fournitures.",
      cta: "Proposer mes services paysagers",
      fit: [
        "Jardiniers, équipes et entreprises paysagères.",
        "Capacité déclarée pour l’entretien ou les projets relevant de leur spécialité.",
        "Précision des fournitures et de la gestion des déchets.",
      ],
      exampleLead: {
        area: "Exemple fictif — Santo Domingo Este",
        service: "Jardinage et aménagement paysager",
        urgency: "Date flexible ; disponibilité non confirmée",
        scope:
          "Un foyer demande l’entretien d’un jardin avec pelouse et plantes ornementales. La fréquence, les fournitures et les déchets restent à définir.",
      },
      qualification: [
        "Critères proposés pour examiner chaque demande ; une demande non vérifiée n’est pas présentée comme qualifiée.",
        "Un besoin réel et des coordonnées valides.",
        "Une prestation correspondant à la spécialité déclarée.",
        "Un secteur couvert et une capacité confirmés par le prestataire.",
        "L’autorisation de partager la demande et de contacter le client pour ce service.",
        "La recherche de doublons avant attribution ou facturation envisagée.",
      ],
      leadModel:
        "Modèle proposé, dont les conditions opérationnelles restent à confirmer : une demande qualifiée est réservée à un seul prestataire pendant un délai annoncé avant sa décision. La facturation intervient uniquement après acceptation. L’exclusivité signifie que la plateforme ne transmet pas cette demande à un autre prestataire, et non que le client n’a contacté personne d’autre. Aucun contrat ni revenu n’est garanti.",
      commercialTerms: [
        "Prix par demande acceptée : [OWNER: lead price].",
        "Délai d’acceptation : [OWNER: acceptance window].",
        "Délai et conditions de demande d’avoir : [OWNER: credit window].",
        "Frais, plafonds de dépenses, pauses et critères d’avoir doivent être communiqués et acceptés avant activation.",
        "Aucune facturation ni acceptation automatique n’est active dans cet aperçu. Une candidature n’autorise aucun prélèvement.",
      ],
      controls: [
        "Préférences proposées : secteurs, spécialités, langues et horaires déclarés.",
        "Capacité et disponibilité à confirmer avant d’accepter du travail.",
        "Pause des nouvelles demandes et plafond de dépenses, selon des conditions encore à approuver.",
        "Consultation de la référence, du statut et du motif de tout frais lorsque le service sera activé.",
      ],
      workflow: [
        "Déposez votre candidature avec vos prestations et vos secteurs.",
        "Complétez l’examen et les justificatifs applicables ; la candidature reste en attente d’une décision.",
        "Définissez préférences, capacité et conditions commerciales avant activation.",
        "Examinez chaque demande et n’acceptez que les interventions possibles selon les conditions annoncées.",
        "Contactez le client avec son accord pour convenir des travaux, du devis et du rendez-vous.",
        "Communiquez le résultat et les difficultés éventuelles ; conservez la référence.",
      ],
      faq: [
        {
          q: "Qui peut déposer une candidature ?",
          a: "Jardiniers, équipes et entreprises paysagères. Capacité déclarée pour l’entretien ou les projets relevant de leur spécialité. Précision des fournitures et de la gestion des déchets. Déclarez seulement les compétences et justificatifs que vous pouvez étayer. L’examen ne constitue pas un label de vérification et ne garantit pas l’admission.",
        },
        {
          q: "Des chantiers ou un nombre de demandes sont-ils garantis ?",
          a: "Non. Une candidature ou l’acceptation d’une demande ne garantit ni contrat, ni revenu, ni volume d’opportunités. Le client choisit son prestataire ; évaluez les travaux et vos capacités avant d’accepter.",
        },
        {
          q: "Que signifie une demande exclusive ?",
          a: "Dans le modèle proposé, la plateforme réserve une demande qualifiée à un seul prestataire pendant le délai annoncé et ne la transmet pas à un autre pendant cette réservation. Le client peut avoir contacté d’autres entreprises de son côté ; l’exclusivité ne garantit pas le chantier.",
        },
        {
          q: "Quand suis-je facturé et que faire si la demande ne respecte pas les critères ?",
          a: "Le modèle proposé prévoit une facturation uniquement après acceptation d’une demande qualifiée. Le prix, le délai d’acceptation et les avoirs attendent la confirmation du propriétaire. Ces conditions doivent être annoncées et acceptées avant activation ; cet aperçu ne permet aucune facturation.",
        },
        {
          q: "Puis-je limiter mes secteurs, suspendre les demandes ou fermer le compte ?",
          a: "Ces contrôles font partie du service proposé et restent à confirmer avant activation. Déclarez vos secteurs, spécialités et capacités réels. Les modalités de pause, de modification et de fermeture doivent être accessibles avant tout engagement.",
        },
        {
          q: "Comment sont gérés les contacts, le support et les réclamations ?",
          a: "Utilisez les coordonnées uniquement pour la demande autorisée ; leur réception n’autorise pas les promotions. Conservez la référence et signalez les difficultés. Les canaux, horaires de support et modalités de réclamation restent à publier.",
        },
      ],
      confirmation:
        "Votre candidature a été reçue et reste en attente d’examen. La prochaine étape porte sur vos prestations, vos secteurs et les justificatifs applicables. Conservez la référence affichée. Aucun compte n’est activé, aucun prélèvement autorisé et aucune demande garantie.",
    },
  },
  seasonal: [
    {
      trigger: "garden-planning-for-changing-weather",
      customer: {
        es: "Al planificar el jardín para un período de lluvia o sequía, consulte qué tareas convienen a sus plantas y al lugar. No se promete un resultado de crecimiento.",
        en: "When planning for a wet or dry period, ask which tasks suit your plants and site. Plant growth outcomes are not promised.",
        fr: "Avant une période humide ou sèche, demandez quels travaux conviennent aux plantes et au terrain. Aucun résultat de croissance n’est promis.",
      },
      provider: {
        es: "Proponga tareas según el estado del jardín y las condiciones locales; confirme recursos y materiales antes de aceptar el proyecto.",
        en: "Propose tasks based on garden condition and local circumstances; confirm resources and materials before accepting a project.",
        fr: "Proposez des travaux adaptés au jardin et aux conditions locales ; confirmez moyens et matériaux avant d’accepter le projet.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
