import { onRequest } from "firebase-functions/https";
import { CitaService } from "../../negocio/services/citaService";

/**
 * 🔹 POST guardar una nueva cita
 */
export const guardarCitaHandler = onRequest(async (req, res) => {
    try {
      const citaData = req.body;
  
      if (!citaData) {
        throw new Error("Datos de la cita no válidos.");
      }
  
      await CitaService.guardarCita(citaData);
      res.status(200).json({ success: true, message: "Cita guardada correctamente" });
    } catch (error: any) {
      console.error("❌ Error en guardarCitaHandler:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
   * 🔹 GET citas no archivadas de un usuario
   */
  export const obtenerCitasNoArchivadasUsuarioHandler = onRequest(async (req, res) => {
    try {
      const { idUsuario } = req.query;
      if (!idUsuario || typeof idUsuario !== "string") {
        throw new Error("idUsuario no válido");
      }
  
      const citas = await CitaService.obtenerCitasNoArchivadasUsuario(idUsuario);
      res.status(200).json({ success: true, citas });
    } catch (error: any) {
      console.error("❌ Error en obtenerCitasNoArchivadasUsuarioHandler:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
   * 🔹 GET citas archivadas de un usuario
   */
  export const obtenerCitasArchivadasUsuarioHandler = onRequest(async (req, res) => {
    try {
      const { idUsuario } = req.query;
      if (!idUsuario || typeof idUsuario !== "string") {
        throw new Error("idUsuario no válido");
      }
  
      const citas = await CitaService.obtenerCitasArchivadasUsuario(idUsuario);
      res.status(200).json({ success: true, citas });
    } catch (error: any) {
      console.error("❌ Error en obtenerCitasArchivadasUsuarioHandler:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
   * 🔹 GET citas pendientes de un usuario
   */
  export const obtenerCitasPendientesUsuarioHandler = onRequest(async (req, res) => {
    try {
      const { idUsuario } = req.query;
      if (!idUsuario || typeof idUsuario !== "string") {
        throw new Error("idUsuario no válido");
      }
  
      const citas = await CitaService.obtenerCitasPendientesUsuario(idUsuario);
      res.status(200).json({ success: true, citas });
    } catch (error: any) {
      console.error("❌ Error en obtenerCitasPendientesUsuarioHandler:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
   * 🔹 GET citas de un médico
   */
  export const obtenerCitasMedicoHandler = onRequest(async (req, res) => {
    try {
      const { idMedico } = req.query;
      if (!idMedico || typeof idMedico !== "string") {
        throw new Error("idMedico no válido");
      }
  
      const citas = await CitaService.obtenerCitasMedico(idMedico);
      res.status(200).json({ success: true, citas });
    } catch (error: any) {
      console.error("❌ Error en obtenerCitasMedicoHandler:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
   * 🔹 GET una cita por su ID
   */
  export const obtenerCitaPorIdHandler = onRequest(async (req, res) => {
    try {
      const { idCita } = req.query;
      if (!idCita || typeof idCita !== "string") {
        throw new Error("idCita no válido");
      }
  
      const cita = await CitaService.obtenerCitaPorId(idCita);
      res.status(200).json({ success: true, cita });
    } catch (error: any) {
      console.error("❌ Error en obtenerCitaPorIdHandler:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
   * 🔹 PUT actualizar todos los datos de una cita
   */
  export const actualizarCitaHandler = onRequest(async (req, res) => {
    try {
      const { idCita } = req.query;
      const updatedData = req.body;
  
      if (!idCita || typeof idCita !== "string") {
        throw new Error("idCita no válido");
      }
  
      if (!updatedData || typeof updatedData !== "object") {
        throw new Error("Datos de actualización no válidos.");
      }
  
      await CitaService.actualizarCita(idCita, updatedData);
      res.status(200).json({ success: true, message: "Cita actualizada correctamente" });
    } catch (error: any) {
      console.error("❌ Error en actualizarCitaHandler:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
   * 🔹 DELETE eliminar todas las citas de un usuario
   */
  export const eliminarCitasUsuarioHandler = onRequest(async (req, res) => {
    try {
      const { idUsuario } = req.query;
      if (!idUsuario || typeof idUsuario !== "string") {
        throw new Error("idUsuario no válido");
      }
  
      await CitaService.eliminarCitasUsuario(idUsuario);
      res.status(200).json({ success: true, message: "Citas del usuario eliminadas correctamente" });
    } catch (error: any) {
      console.error("❌ Error en eliminarCitasUsuarioHandler:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
   * 🔹 DELETE eliminar una cita por su ID
   */
  export const eliminarCitaPorIdHandler = onRequest(async (req, res) => {
    try {
      const { idCita } = req.query;
      if (!idCita || typeof idCita !== "string") {
        throw new Error("idCita no válido");
      }
  
      await CitaService.eliminarCitaPorId(idCita);
      res.status(200).json({ success: true, message: "Cita eliminada correctamente" });
    } catch (error: any) {
      console.error("❌ Error en eliminarCitaPorIdHandler:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });