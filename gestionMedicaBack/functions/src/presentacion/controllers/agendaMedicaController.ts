import { onRequest } from "firebase-functions/https";
import { AgendaMedicaService } from "../../negocio/services/agendaMedicaService";

/**
 * 🔹 GET agendas médicas de un médico
 */
export const getAgendasMedicoHandler = onRequest(async (req, res) => {
  try {
    const { idMedico } = req.query;
    if (!idMedico || typeof idMedico !== "string") {
      throw new Error("idMedico no válido");
    }

    const agendas = await AgendaMedicaService.obtenerAgendasDeMedico(idMedico);
    res.status(200).json({ success: true, agendas });
  } catch (error: any) {
    console.error("❌ Error en getAgendasMedicoHandler:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 POST guardar nuevas agendas médicas
 */
export const guardarAgendasHandler = onRequest(async (req, res) => {
  try {
    const agendasData = req.body;

    if (!Array.isArray(agendasData)) {
      throw new Error("El body debe ser un array de agendas");
    }

    await AgendaMedicaService.guardarAgendas(agendasData);
    res.status(200).json({ success: true, message: "Agendas guardadas correctamente" });
  } catch (error: any) {
    console.error("❌ Error en guardarAgendasHandler:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 DELETE eliminar todas las agendas de un médico
 */
export const eliminarAgendasMedicoHandler = onRequest(async (req, res) => {
  try {
    const { idMedico } = req.query;
    if (!idMedico || typeof idMedico !== "string") {
      throw new Error("idMedico no válido");
    }

    await AgendaMedicaService.eliminarAgendasMedico(idMedico);
    res.status(200).json({ success: true, message: "Agendas del médico eliminadas correctamente" });
  } catch (error: any) {
    console.error("❌ Error en eliminarAgendasMedicoHandler:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 DELETE eliminar una agenda médica específica
 */
export const eliminarAgendaPorIdHandler = onRequest(async (req, res) => {
  try {
    const { idAgenda } = req.query;
    if (!idAgenda || typeof idAgenda !== "string") {
      throw new Error("idAgenda no válido");
    }

    await AgendaMedicaService.eliminarAgendaPorId(idAgenda);
    res.status(200).json({ success: true, message: "Agenda eliminada correctamente" });
  } catch (error: any) {
    console.error("❌ Error en eliminarAgendaPorIdHandler:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 DELETE eliminar agendas antiguas (opcional manual)
 */
export const eliminarAgendasAntiguasHandler = onRequest(async (req, res) => {
  try {
    await AgendaMedicaService.eliminarAgendasAntiguas();
    res.status(200).json({ success: true, message: "Agendas antiguas eliminadas correctamente" });
  } catch (error: any) {
    console.error("❌ Error en eliminarAgendasAntiguasHandler:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
* 🔹 PUT actualizar horarios de una agenda médica específica
*/
export const actualizarHorariosAgendaHandler = onRequest(async (req, res) => {
  try {
    const { idAgenda } = req.query;
    const { nuevoEstado, horarioActualizar } = req.body;

    // 🔐 Validaciones básicas
    if (!idAgenda || typeof idAgenda !== "string") {
      throw new Error("Parámetro 'idAgenda' no válido");
    }

    if (typeof nuevoEstado !== "boolean" || typeof horarioActualizar !== "string") {
      throw new Error("Body inválido: se requieren 'nuevoEstado' (boolean) y 'horarioActualizar' (string)");
    }

    // 🚀 Lógica principal
    await AgendaMedicaService.actualizarHorariosAgenda(idAgenda, nuevoEstado, horarioActualizar);

    res.status(200).json({
      success: true,
      message: `Horario '${horarioActualizar}' actualizado correctamente`,
    });

  } catch (error: any) {
    console.error("❌ Error en actualizarHorariosAgendaHandler:", error.message);

    const esConflicto = error.message?.includes("ya no está disponible");

    res.status(esConflicto ? 409 : 400).json({
      success: false,
      message: error.message || "Error al actualizar el horario",
    });
  }
});

/**
 * Libera un horario previamente reservado en una agenda médica.
 * 
 * Esta función busca una agenda usando el `idMedico` y la `fecha`,
 * valida que el horario exista en esa agenda, y lo marca como disponible (`true`).
 * 
 * Se utiliza principalmente al cancelar una cita, para que el horario vuelva a estar disponible.
 * 
 * @param idMedico UID del médico al que pertenece la agenda.
 * @param fecha Fecha de la agenda (formato "DD-MM-YYYY").
 * @param horario Horario específico a liberar (ej: "09:00").
 * @throws Error si la agenda no existe o el horario no se encuentra.
 */
export const liberarHorarioHandler = onRequest(async (req, res) => {
  try {
    if (req.method !== "PUT") {
      res.status(405).json({ success: false, message: "Método no permitido" });
    }

    const { idMedico, fecha, horario } = req.body;

    if (
      typeof idMedico !== "string" ||
      typeof fecha !== "string" ||
      typeof horario !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Body inválido: se requieren 'idMedico', 'fecha' y 'horario' como strings.",
      });
    }

    await AgendaMedicaService.liberarHorario(idMedico, fecha, horario);

    res.status(200).json({
      success: true,
      message: `Horario '${horario}' liberado correctamente para el médico '${idMedico}'`,
    });
  } catch (error: any) {
    console.error("❌ Error en liberarHorarioHandler:", error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Error al liberar el horario",
    });
  }
});
