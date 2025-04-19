import { onRequest } from "firebase-functions/https";
import { CentroService } from "../../negocio/services/centroService";

/**
 * 🔹 Guardar lista de centros
 */
export const guardarCentrosHandler = onRequest(async (req, res) => {
    try {
      const centrosData = req.body;
  
      if (!Array.isArray(centrosData)) {
        throw new Error("El cuerpo debe ser un array de centros");
      }
  
      await CentroService.guardarCentros(centrosData);
  
      res.status(201).json({
        success: true,
        message: "Centros guardados correctamente",
      });
    } catch (error: any) {
      console.error("❌ Error en guardarCentrosHandler:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });
  
  /**
 * 🔹 Obtener todos los centros
 */
export const obtenerCentrosHandler = onRequest(async (_req, res) => {
    try {
      const centros = await CentroService.obtenerTodosLosCentros();
  
      res.status(200).json({
        success: true,
        centros,
      });
    } catch (error: any) {
      console.error("❌ Error en obtenerCentrosHandler:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });
  