import { onRequest } from "firebase-functions/https";
import { AlergiaService } from "../../negocio/services/alergiaService";


export const getAlergiasHandler = onRequest(async (req, res) => {
  try {
    const { idUsuario } = req.query;
    if (!idUsuario || typeof idUsuario !== "string") {
      throw new Error("idUsuario no válido");
    }

    const alergias = await AlergiaService.obtenerAlergiasUsuario(idUsuario);
    res.status(200).json({ success: true, alergias });
  } catch (error: any) {
    console.error("❌ Error en getAlergiasHandler:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export const saveAlergiasHandler = onRequest(async (req, res) => {
    try {
      const data = req.body;
  
      if (!Array.isArray(data)) {
        throw new Error("El cuerpo de la solicitud debe ser un array de alergias.");
      }
  
      await AlergiaService.guardarAlergias(data); // 👈 Pasamos los datos crudos directamente
  
      res.status(201).json({
        success: true,
        message: "Alergias guardadas correctamente.",
      });
    } catch (error: any) {
      console.error("❌ Error en saveAlergiasHandler:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
export const deleteAlergiasByUsuarioHandler = onRequest(async (req, res) => {
  try {
    const { idUsuario } = req.body;
    if (!idUsuario || typeof idUsuario !== "string") {
      throw new Error("idUsuario no válido");
    }

    await AlergiaService.eliminarAlergiasUsuario(idUsuario);
    res.status(200).json({
      success: true,
      message: "Alergias del usuario eliminadas correctamente.",
    });
  } catch (error: any) {
    console.error("❌ Error en deleteAlergiasByUsuarioHandler:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export const deleteAlergiaByIdHandler = onRequest(async (req, res) => {
  try {
    const { idAlergia } = req.body;
    if (!idAlergia || typeof idAlergia !== "string") {
      throw new Error("idAlergia no válido");
    }

    await AlergiaService.eliminarAlergiaPorId(idAlergia);
    res.status(200).json({
      success: true,
      message: `Alergia con ID ${idAlergia} eliminada correctamente.`,
    });
  } catch (error: any) {
    console.error("❌ Error en deleteAlergiaByIdHandler:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
