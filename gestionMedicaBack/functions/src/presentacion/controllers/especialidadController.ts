import { onRequest } from "firebase-functions/https";
import { EspecialidadService } from "../../negocio/services/especialidadService";

/**
 * 🔹 Guardar lista de especialidades
 */
export const guardarEspecialidadesHandler = onRequest(async (req, res) => {
    try {
      const especialidadesData = req.body;
  
      if (!Array.isArray(especialidadesData)) {
        throw new Error("El cuerpo debe ser un array de especialidades");
      }
  
      await EspecialidadService.guardarEspecialidades(especialidadesData);
  
      res.status(201).json({
        success: true,
        message: "Especialidades guardadas correctamente",
      });
    } catch (error: any) {
      console.error("❌ Error en guardarEspecialidadesHandler:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

  /**
 * 🔹 Obtener todas las especialidades
 */
export const obtenerEspecialidadesHandler = onRequest(async (_req, res) => {
    try {
      const especialidades = await EspecialidadService.obtenerTodasLasEspecialidades();
  
      res.status(200).json({
        success: true,
        especialidades,
      });
    } catch (error: any) {
      console.error("❌ Error en obtenerEspecialidadesHandler:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });
  
  