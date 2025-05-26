import { Operation } from "../../../gestionMedicaBack/functions/src/negocio/modelos/Operation.js";

export const operations: Operation[] = [
    {
        id: 1,
        title: "Mi Perfil & Preferencias",
        description: "Personaliza tu experiencia ajustando tu información, preferencias y detalles personales. Mantén tu perfil siempre actualizado para una atención más rápida y eficiente.",
        type: "Perfil",
        icon: "settingsOutline",
        url: "/profile",
        img: "perfil.svg"
    },
    {
        id: 2,
        title: "Mis Médicos de Confianza",
        description: "Accede rápidamente a tu lista de médicos favoritos. Consulta su información, agenda citas con facilidad y gestiona tu lista añadiendo o eliminando profesionales según tus necesidades.",
        type: "Medicos",
        icon: "starOutline",
        url: "/search-doctor?favoritos=true",
        img: "misMedicos.svg"
    },
    {
        id: 15,
        title: "Mis citas",
        description: "Consulta tus próximas citas médicas fácilmente. Accede a la información del especialista, fecha, hora y centro médico. Mantén un control eficiente de tus visitas médicas programadas.",
        type: "Citas",
        icon: "calendarOutline",
        url: "/appointment-history?tipo=actuales",
        img: "misCitas.svg"
    },
    {
        id: 5,
        title: "Agendar Cita Médica",
        description: "Reserva tu próxima cita médica de manera rápida y sencilla. Elige la fecha, el especialista y el horario que mejor se adapte a tu disponibilidad. ¡Gestiona tu salud sin complicaciones!",
        type: "Citas",
        icon: "calendarNumberOutline",
        url: "/new-appointment",
        img: "agendaCita.svg"
    },
    {
        id: 3,
        title: "Historial de Citas",
        description: "Consulta el historial de tus citas médicas en un solo lugar. Revisa fechas, detalles y médicos atendidos para un mejor control de tu salud. ¡Mantente siempre organizado.",
        type: "Citas",
        icon: "calendarOutline",
        url: "/appointment-history?tipo=todos",
        img: "historialCitas.svg"
    },

    {
        id: 4,
        title: "Encuentra a tu Médico Ideal",
        description: "Busca y encuentra médicos según especialidad, ubicación o disponibilidad. Accede a perfiles detallados, consulta valoraciones y agenda tu cita con el especialista que mejor se adapte a tus necesidades.",
        type: "Medicos",
        icon: "searchCircleOutline",
        url: "/search-doctor",
        img: "encuentraMedico.svg"
    },
   
    {
        id: 6,
        title: "Mis Tratamientos en Curso",
        description: "Sigue tu tratamiento en tiempo real y accede a toda la información relevante sobre tu progreso y próximos pasos.",
        type: "Tratamientos",
        icon: "fitnessOutline",
        url: "/treatment-history?tipo=actuales",
        img: "miTratamiento.svg"
    },
    {
        id: 7,
        title: "Alergias del paciente",
        description: "Consulta y gestiona tu tratamiento actual en un solo lugar. Accede a medicamentos recetados, indicaciones médicas y recordatorios para seguir tu plan de salud de manera efectiva.",
        type: "Tratamientos",
        icon: "nutritionOutline",
        url: "/my-allergies",
        img: "alergias.svg"
    },
    {
        id: 8,
        title: "Mi Historial de Tratamientos",
        description: "Accede a un registro completo de todos tus tratamientos médicos pasados. Consulta medicamentos recetados, fechas y duración de cada tratamiento para un mejor seguimiento de tu salud.",
        type: "Tratamientos",
        icon: "fileTrayFullOutline",
        url: "/treatment-history?tipo=todos",
        img: "miHistorial.svg"
    },
    {
        id: 9,
        title: "Gestión Familiar de Salud",
        description: "Administra la salud de toda tu familia desde un solo lugar. Agrega y gestiona perfiles de familiares, programa citas médicas y mantén un control eficiente del bienestar de tus seres queridos.",
        type: "Familia",
        icon: "peopleOutline",
        url: "/family-management",
        img: "familia.svg"
    }
];

export const perfilOperations: Operation[] = [
    {
        id: 10,
        title: "Mi cuenta",
        description: "Modificá tus datos de usuario registrados y mantené tu perfil actualizado.",
        type: "Perfil",
        icon: "optionsOutline",
        url: "/editProfile",
        img: "editPerfil.svg"
    },
    {
        id: 11,
        title: "Preferencias de accesibilidad",
        description: "Elige tu modo de interfaz preferido y adapta la aplicación a tus necesidades.",
        type: "Perfil",
        icon: "constructOutline",
        url: "/preferences",
        img: "preferencias.svg"
    },
    {
        id: 12,
        title: "Tarjeta del asegurado",
        description: "Consulta y accede a tu tarjeta digital de asegurado de forma rápida y segura.",
        type: "Perfil",
        icon: "cardOutline",
        url: "/insured-card",
        img: "creditCard.svg"
    },
    {
        id: 13,
        title: "Cerrar sesión",
        description: "Cierra tu sesión actual y protege tu información personal.",
        type: "Perfil",
        icon: "exitOutline",
        url: "/logout",
        img: "cerrarSesion.svg"
    },
    {
        id: 14,
        title: "Baja de cuenta",
        description: "Elimina tu cuenta de forma permanente y borra todos tus datos registrados.",
        type: "Perfil",
        icon: "trashOutline",
        url: "/account-delete",
        img: "bajaCuenta.svg"
    },
];
