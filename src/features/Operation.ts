export interface Operation {
    id: string;            // Identificador único
    title: string;         // Nombre de la operación
    type: "perfil" | "citas" | "medicos" | "familia" | "tratamientos";  // Categoría
    icon: string;          // Representación visual (puede ser un emoji o un icono)
  }
  