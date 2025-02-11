import { Operation } from "./Operation";

export const operations: Operation[] = [
  {
    id: "profile_settings",
    title: "Ajustes de perfil",
    type: "perfil",
    icon: "⚙️",
  },
  {
    id: "favorite_doctors",
    title: "Ver médicos favoritos",
    type: "medicos",
    icon: "❤️",
  },
  {
    id: "appointments",
    title: "Registro de citas",
    type: "citas",
    icon: "📅",
  },
  {
    id: "search_doctor",
    title: "Buscar Médico",
    type: "medicos",
    icon: "🔍",
  },
  {
    id: "book_appointment",
    title: "Reservar Cita",
    type: "citas",
    icon: "🗓️",
  },
  {
    id: "current_treatment",
    title: "Tratamiento Actual",
    type: "tratamientos",
    icon: "💊",
  },
  {
    id: "allergies",
    title: "Alergias del paciente",
    type: "tratamientos",
    icon: "🚨",
  },
  {
    id: "treatment_history",
    title: "Historial de tratamientos",
    type: "tratamientos",
    icon: "📜",
  },
  {
    id: "family_accounts",
    title: "Gestionar cuentas de Familia",
    type: "familia",
    icon: "👨‍👩‍👧‍👦",
  }
];
