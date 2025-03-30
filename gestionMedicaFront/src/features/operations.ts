import { Operation } from "./Operation";

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
        url: "/favorite-doctors",
        img: "misMedicos.svg"
    },
    {
        id: 3,
        title: "Historial de Citas",
        description: "Consulta el historial de tus citas médicas en un solo lugar. Revisa fechas, detalles y médicos atendidos para un mejor control de tu salud. ¡Mantente siempre organizado.",
        type: "Citas",
        icon: "calendarOutline",
        url: "/appointment-history",
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
        id: 5,
        title: "Agendar Cita Médica",
        description: "Reserva tu próxima cita médica de manera rápida y sencilla. Elige la fecha, el especialista y el horario que mejor se adapte a tu disponibilidad. ¡Gestiona tu salud sin complicaciones!",
        type: "Citas",
        icon: "calendarNumberOutline",
        url: "/new-appointment",
        img: "agendaCita.svg"
    },
    {
        id: 6,
        title: "Mi Tratamiento en Curso",
        description: "Sigue tu tratamiento en tiempo real y accede a toda la información relevante sobre tu progreso y próximos pasos.",
        type: "Tratamientos",
        icon: "fitnessOutline",
        url: "/current-treatment",
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
        url: "/treatment-history",
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
