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
      const nuevosHorarios = req.body;
  
      if (!idAgenda || typeof idAgenda !== "string") {
        throw new Error("idAgenda no válido");
      }
  
      if (!nuevosHorarios || typeof nuevosHorarios !== "object") {
        throw new Error("Body inválido: se requiere un objeto con los horarios nuevos");
      }
  
      await AgendaMedicaService.actualizarHorariosAgenda(idAgenda, nuevosHorarios);
  
      res.status(200).json({ success: true, message: "Horarios actualizados correctamente" });
    } catch (error: any) {
      console.error("❌ Error en actualizarHorariosAgendaHandler:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  });