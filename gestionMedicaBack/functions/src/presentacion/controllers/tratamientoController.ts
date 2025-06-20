import { onRequest } from "firebase-functions/v2/https";
import { TratamientoService } from "../../negocio/services/tratamientoService";
import { generarPdfCifrado } from "../../negocio/services/pdfService";
import { AuthService } from "../../negocio/services/authService";
import { eventBus } from "../../serviciosComunes/event/event-emiter";


/**
 * 🔹 Guardar un tratamiento
 */
export const saveTratamientoHandler = onRequest(async (req, res) => {
    try {
      const tratamientos = req.body;
  
      if (!Array.isArray(tratamientos)) {
        throw new Error("El cuerpo de la solicitud debe ser un array de tratamientos.");
      }
  
      await TratamientoService.guardarTratamientos(tratamientos);
  
      res.status(201).json({
        success: true,
        message: "Tratamientos guardados correctamente.",
      });
    } catch (error: any) {
      console.error("❌ Error en saveTratamientoHandler:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
/**
 * 🔹 Obtener tratamientos archivados
 */
export const getTratamientosArchivadosHandler = onRequest(async (req, res) => {
  try {
    const { idUsuario } = req.query;

    if (!idUsuario || typeof idUsuario !== "string") {
      throw new Error("idUsuario no válido");
    }

    const tratamientos = await TratamientoService.obtenerTratamientosArchivados(idUsuario);

    res.status(200).json({ success: true, tratamientos });
  } catch (error: any) {
    console.error("❌ Error en getTratamientosArchivadosHandler:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 Obtener tratamientos activos
 */
export const getTratamientosActivosHandler = onRequest(async (req, res) => {
  try {
    const { idUsuario } = req.query;

    if (!idUsuario || typeof idUsuario !== "string") {
      throw new Error("idUsuario no válido");
    }

    const tratamientos = await TratamientoService.obtenerTratamientosActivos(idUsuario);

    res.status(200).json({ success: true, tratamientos });
  } catch (error: any) {
    console.error("❌ Error en getTratamientosActivosHandler:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 Eliminar todos los tratamientos de un usuario
 */
export const deleteTratamientosByUsuarioHandler = onRequest(async (req, res) => {
  try {
    const { idUsuario } = req.body;

    if (!idUsuario || typeof idUsuario !== "string") {
      throw new Error("idUsuario no válido");
    }

    await TratamientoService.eliminarTratamientosUsuario(idUsuario);

    res.status(200).json({
      success: true,
      message: "Tratamientos del usuario eliminados correctamente.",
    });
  } catch (error: any) {
    console.error("❌ Error en deleteTratamientosByUsuarioHandler:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 Eliminar un tratamiento por ID
 */
export const deleteTratamientoByIdHandler = onRequest(async (req, res) => {
  try {
    const { idTratamiento } = req.body;

    if (!idTratamiento || typeof idTratamiento !== "string") {
      throw new Error("idTratamiento no válido");
    }

    await TratamientoService.eliminarTratamientoPorId(idTratamiento);

    res.status(200).json({
      success: true,
      message: `Tratamiento con ID ${idTratamiento} eliminado correctamente.`,
    });
  } catch (error: any) {
    console.error("❌ Error en deleteTratamientoByIdHandler:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 Cambiar estado de "archivado" de un tratamiento
 */
export const updateArchivadoTratamientoHandler = onRequest(async (req, res) => {
  try {
    const { idTratamiento, nuevoEstado } = req.body;

    if (!idTratamiento || typeof idTratamiento !== "string") {
      throw new Error("idTratamiento no válido");
    }
    if (typeof nuevoEstado !== "boolean") {
      throw new Error("nuevoEstado debe ser booleano.");
    }

    await TratamientoService.actualizarEstadoArchivado(idTratamiento, nuevoEstado);

    res.status(200).json({
      success: true,
      message: `Estado 'archivado' del tratamiento actualizado a ${nuevoEstado}.`,
    });
  } catch (error: any) {
    console.error("❌ Error en updateArchivadoTratamientoHandler:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 🔹 Obtener tratamientos actuales (estado === true)
 */
export const getTratamientosActualesHandler = onRequest(async (req, res) => {
    try {
      const { idUsuario } = req.query;
  
      if (!idUsuario || typeof idUsuario !== "string") {
        throw new Error("idUsuario no válido");
      }
  
      const tratamientos = await TratamientoService.obtenerTratamientosActuales(idUsuario);
  
      res.status(200).json({ success: true, tratamientos });
    } catch (error: any) {
      console.error("❌ Error en getTratamientosActualesHandler:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
 * 🔹 Obtener un tratamiento completo (tratamiento + líneas + medicamentos + médico + centro + especialidad)
 */
export const obtenerTratamientoCompletoHandler = onRequest(async (req, res) => {
  try {
    const { idTratamiento } = req.query;

    if (!idTratamiento || typeof idTratamiento !== "string") {
      throw new Error("idTratamiento no válido");
    }

    const resultado = await TratamientoService.obtenerTratamientoCompleto(idTratamiento);

    res.status(200).json({
      success: true,
      tratamientoCompleto: resultado
    });
  } catch (error: any) {
    console.error("❌ Error en obtenerTratamientoCompletoHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


export const generarPdfCifradoTratamientoHandler = onRequest(async (req, res) => {
  try {
    const { dni, idTratamiento } = req.body;

    if (!dni || typeof dni !== "string") {
      throw new Error("DNI no válido");
    }

    if (!idTratamiento || typeof idTratamiento !== "string") {
      throw new Error("idTratamiento no válido");
    }

    const usuario = await AuthService.getUserDataByDNI(dni);
    // Obtener los datos del tratamiento
    const resultado = await TratamientoService.obtenerTratamientoCompleto(idTratamiento);

    // Generar PDF cifrado
    const pdfPath = await generarPdfCifrado(dni, resultado, usuario);

    // Obtener el email del usuario por DNI
    const email = await AuthService.getEmailFromDNI(dni);

    // Emitir evento para enviar el PDF
    eventBus.emit("send.tratamiento.pdf", { email, pdfPath });

    // Confirmar en la respuesta
    res.status(200).json({
      success: true,
      message: `PDF generado y en proceso de envío a ${email}`
    });

  } catch (error: any) {
    console.error("❌ Error en generarPdfCifradoTratamientoHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});