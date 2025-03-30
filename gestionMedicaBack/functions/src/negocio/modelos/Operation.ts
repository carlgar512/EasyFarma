
export interface Operation {
    id: number;  // Identificador único
    title: string;  // Nombre de la operación
    description: string;  // Descripción de la operación
    type: "Perfil" | "Citas" | "Medicos" | "Familia" | "Tratamientos";  // Categoría
    icon:  string;  // Icono representado con IonIcon
    url: string;  // Ruta en inglés basada en el título
    img: string;
}

/**
 * Ordena una lista de operaciones por tipo o alfabéticamente por título.
 * @param operations - Lista de operaciones a ordenar.
 * @param orderBy - "type" para ordenar por tipo, "title" para ordenar alfabéticamente.
 * @returns Lista de operaciones ordenadas.
 */
export const sortOperations = (operations: Operation[], orderBy: "type" | "title"): Operation[] => {
    return [...operations].sort((a, b) => {
      if (orderBy === "type") {
        return a.type.localeCompare(b.type);
      } else if (orderBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };