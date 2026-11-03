import { definePage } from "@lp/core";

/** Blueprint service content; operational facts and commercial terms await owner confirmation. */
export default definePage({
  slug: "commercial-cleaning",
  accent: "#115E59",
  group: "business",
  pilot: false,
  layout: "customer-provider",
  customer: {
    es: {
      name: "Limpieza comercial",
      headline: "¿Necesita limpieza para su negocio en Santo Domingo?",
      subhead:
        "Describa sus oficinas, local o áreas comunes y la frecuencia deseada. Solicite una propuesta que detalle tareas, horarios, insumos y condiciones de acceso.",
      cta: "Cotizar limpieza comercial",
      subtypes: [
        {
          value: "office-cleaning",
          label: "Limpieza de oficinas",
        },
        {
          value: "retail-cleaning",
          label: "Limpieza de locales comerciales",
        },
        {
          value: "shared-areas",
          label: "Áreas comunes",
        },
        {
          value: "recurring-contract",
          label: "Servicio recurrente",
        },
        {
          value: "deep-cleaning",
          label: "Limpieza profunda",
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
        "Consulta para limpieza de oficinas y locales.",
        "Definición de tareas por zona y frecuencia.",
        "Solicitud de propuesta para servicio recurrente.",
      ],
      excluded: [
        "No se incluyen protocolos clínicos, industriales o de residuos peligrosos sin evaluación especializada.",
        "Consumibles, equipos y limpieza en altura se detallan por separado.",
        "Solicitar una propuesta no adjudica un contrato.",
      ],
      priceFactors: [
        "Superficie, uso y ocupación de los espacios.",
        "Frecuencia, tareas y ventanas de acceso.",
        "Insumos, equipos y requisitos del establecimiento.",
      ],
      steps: [
        "Describa el trabajo, su zona y la fecha que prefiere.",
        "Se revisará si hay un proveedor compatible; la solicitud no confirma disponibilidad.",
        "Acuerde con el proveedor el alcance, el presupuesto y, después, la cita.",
      ],
      faq: [
        {
          q: "¿Qué información debo incluir en la solicitud?",
          a: "Describa el tipo de negocio, las áreas que deben limpiarse y los horarios en que puede entrar el equipo. Si existe un protocolo específico, indíquelo para evaluar si el proveedor puede cumplirlo.",
        },
        {
          q: "¿De qué depende el presupuesto?",
          a: "Superficie, uso y ocupación de los espacios. Frecuencia, tareas y ventanas de acceso. Insumos, equipos y requisitos del establecimiento. El proveedor debe explicar el alcance y el precio antes de que usted apruebe el trabajo. Esta página no publica una tarifa.",
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
      name: "Commercial cleaning",
      headline: "Need cleaning for your business in Santo Domingo?",
      subhead:
        "Describe your office, shop or shared spaces and preferred frequency. Request a proposal covering tasks, hours, supplies and access conditions.",
      cta: "Get a commercial cleaning quote",
      subtypes: [
        {
          value: "office-cleaning",
          label: "Office cleaning",
        },
        {
          value: "retail-cleaning",
          label: "Retail cleaning",
        },
        {
          value: "shared-areas",
          label: "Shared spaces",
        },
        {
          value: "recurring-contract",
          label: "Recurring service",
        },
        {
          value: "deep-cleaning",
          label: "Deep cleaning",
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
        "Office and commercial premises cleaning inquiries.",
        "Task scoping by area and frequency.",
        "Recurring-service proposal requests.",
      ],
      excluded: [
        "Clinical, industrial or hazardous-waste protocols need specialist assessment.",
        "Consumables, equipment and high-level cleaning must be itemized separately.",
        "Requesting a proposal does not award a contract.",
      ],
      priceFactors: [
        "Floor area, use and occupancy.",
        "Frequency, tasks and access windows.",
        "Supplies, equipment and premises requirements.",
      ],
      steps: [
        "Describe the work, your area and preferred timing.",
        "Availability of a suitable provider must be checked; a request does not confirm a match.",
        "Agree on scope and a quote with the provider, then confirm an appointment.",
      ],
      faq: [
        {
          q: "What information should I include?",
          a: "Describe your business, the areas to clean and when a team can access them. Mention any specific protocol so a provider can assess whether it can meet the requirement.",
        },
        {
          q: "What affects the quote?",
          a: "Floor area, use and occupancy. Frequency, tasks and access windows. Supplies, equipment and premises requirements. The provider should explain the scope and price before you approve any work. This page does not publish a fixed fee.",
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
      name: "Nettoyage professionnel",
      headline: "Besoin de nettoyer vos locaux à Santo Domingo ?",
      subhead:
        "Décrivez vos bureaux, votre commerce ou vos parties communes et la fréquence souhaitée. Demandez une proposition précisant tâches, horaires, fournitures et accès.",
      cta: "Demander un devis de nettoyage",
      subtypes: [
        {
          value: "office-cleaning",
          label: "Bureaux",
        },
        {
          value: "retail-cleaning",
          label: "Commerces",
        },
        {
          value: "shared-areas",
          label: "Parties communes",
        },
        {
          value: "recurring-contract",
          label: "Service régulier",
        },
        {
          value: "deep-cleaning",
          label: "Nettoyage approfondi",
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
        "Demande de nettoyage de bureaux ou de commerces.",
        "Définition des tâches par zone et fréquence.",
        "Demande de proposition pour une prestation régulière.",
      ],
      excluded: [
        "Les protocoles médicaux, industriels ou liés aux déchets dangereux nécessitent une étude spécialisée.",
        "Consommables, matériel et nettoyage en hauteur sont à détailler séparément.",
        "Une demande de proposition ne vaut pas attribution de contrat.",
      ],
      priceFactors: [
        "Surface, usage et fréquentation des locaux.",
        "Fréquence, tâches et créneaux d’accès.",
        "Fournitures, matériel et exigences de l’établissement.",
      ],
      steps: [
        "Décrivez les travaux, votre quartier et la période souhaitée.",
        "La disponibilité d’un prestataire adapté doit être vérifiée ; la demande ne confirme pas de mise en relation.",
        "Convenez avec le prestataire des travaux et du devis, puis du rendez-vous.",
      ],
      faq: [
        {
          q: "Quelles informations dois-je fournir ?",
          a: "Décrivez l’activité, les zones à nettoyer et les horaires d’accès. Signalez tout protocole particulier afin que le prestataire puisse évaluer sa capacité à le respecter.",
        },
        {
          q: "De quoi dépend le devis ?",
          a: "Surface, usage et fréquentation des locaux. Fréquence, tâches et créneaux d’accès. Fournitures, matériel et exigences de l’établissement. Le prestataire doit expliquer les travaux et leur prix avant votre accord. Cette page ne publie pas de tarif fixe.",
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
      name: "Limpieza comercial",
      headline: "Conecte con negocios que buscan limpieza comercial",
      subhead:
        "Indique los tipos de locales que atiende, su capacidad y los horarios disponibles. Los contratos y sus condiciones se negocian por separado con cada cliente.",
      cta: "Postularme para limpieza comercial",
      fit: [
        "Equipos y empresas de limpieza comercial.",
        "Capacidad para coordinar personal, materiales y acceso.",
        "Experiencia declarada en los tipos de establecimiento seleccionados.",
      ],
      exampleLead: {
        area: "Ejemplo ficticio — Santo Domingo Este",
        service: "Limpieza comercial",
        urgency: "Fecha flexible; disponibilidad sin confirmar",
        scope:
          "Una oficina solicita una propuesta de limpieza recurrente fuera de su horario de atención. Las tareas, el acceso y la frecuencia aún deben acordarse.",
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
          a: "Equipos y empresas de limpieza comercial. Capacidad para coordinar personal, materiales y acceso. Experiencia declarada en los tipos de establecimiento seleccionados. Declare únicamente las competencias y los documentos que pueda respaldar. La revisión no equivale a un sello de verificación ni garantiza la aprobación.",
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
      name: "Commercial cleaning",
      headline: "Find businesses seeking commercial cleaning",
      subhead:
        "State the premises you serve, your capacity and available hours. Contracts and their terms are negotiated separately with each customer.",
      cta: "Apply for contract leads",
      fit: [
        "Commercial cleaning teams and businesses.",
        "Capacity to coordinate staff, supplies and access.",
        "Declared experience in the selected premises types.",
      ],
      exampleLead: {
        area: "Fictional example — Santo Domingo Este",
        service: "Commercial cleaning",
        urgency: "Flexible timing; availability unconfirmed",
        scope:
          "An office requests a recurring-cleaning proposal outside its opening hours. Tasks, access and frequency remain to be agreed.",
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
          a: "Commercial cleaning teams and businesses. Capacity to coordinate staff, supplies and access. Declared experience in the selected premises types. Declare only skills and documentation you can substantiate. Review is not a verification badge and does not guarantee approval.",
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
      name: "Nettoyage professionnel",
      headline:
        "Rencontrez des entreprises qui recherchent un service de nettoyage",
      subhead:
        "Précisez les types de locaux, vos capacités et vos horaires. Les contrats et leurs conditions se négocient séparément avec chaque client.",
      cta: "Proposer un service de nettoyage",
      fit: [
        "Équipes et entreprises de nettoyage professionnel.",
        "Capacité à coordonner personnel, fournitures et accès.",
        "Expérience déclarée dans les établissements sélectionnés.",
      ],
      exampleLead: {
        area: "Exemple fictif — Santo Domingo Este",
        service: "Nettoyage professionnel",
        urgency: "Date flexible ; disponibilité non confirmée",
        scope:
          "Un bureau demande une proposition de nettoyage régulier hors ouverture. Les tâches, l’accès et la fréquence restent à convenir.",
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
          a: "Équipes et entreprises de nettoyage professionnel. Capacité à coordonner personnel, fournitures et accès. Expérience déclarée dans les établissements sélectionnés. Déclarez seulement les compétences et justificatifs que vous pouvez étayer. L’examen ne constitue pas un label de vérification et ne garantit pas l’admission.",
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
      trigger: "premises-opening-or-contract-review",
      customer: {
        es: "Para una apertura o revisión de contrato, prepare una lista de áreas, tareas y horarios. La propuesta debe ajustarse a las necesidades reales del local.",
        en: "For an opening or contract review, prepare a list of areas, tasks and hours. The proposal should reflect the premises’ actual needs.",
        fr: "Pour une ouverture ou une révision de contrat, préparez les zones, tâches et horaires. La proposition doit correspondre aux besoins réels des locaux.",
      },
      provider: {
        es: "Antes de proponer un servicio recurrente, confirme el alcance, el acceso y los recursos necesarios con el negocio.",
        en: "Before proposing recurring service, confirm scope, access and resource needs with the business.",
        fr: "Avant de proposer une prestation régulière, confirmez le périmètre, l’accès et les moyens nécessaires avec l’entreprise.",
      },
    },
  ],
  features: {
    serviceSelector: true,
    whatsappButton: false,
  },
});
