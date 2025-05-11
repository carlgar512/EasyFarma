import { onRequest } from "firebase-functions/v2/https";
import { TutelaService } from "../../negocio/services/tutelaService";


/**
 * 🔹 Guardar una o varias tutelas
 */
export const guardarTutelasHandler = onRequest(async (req, res) => {
  try {
    const tutelasData = req.body;

    if (!Array.isArray(tutelasData)) {
      throw new Error("El cuerpo debe ser un array de tutelas");
    }

    await TutelaService.guardarTutelas(tutelasData);

    res.status(201).json({
      success: true,
      message: "Tutelas guardadas correctamente"
    });
  } catch (error: any) {
    console.error("❌ Error en guardarTutelasHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 🔹 Obtener tutelas por ID de tutor
 */
export const obtenerTutelasPorIdTutorHandler = onRequest(async (req, res) => {
  try {
    const idTutor = req.query.idTutor as string;

    if (!idTutor) {
      throw new Error("Falta el parámetro 'idTutor'");
    }

    const tutelas = await TutelaService.obtenerTutelasPorIdTutor(idTutor);

    res.status(200).json({
      success: true,
      tutelas
    });
  } catch (error: any) {
    console.error("❌ Error en obtenerTutelasPorIdTutorHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 🔹 Obtener tutelas por ID de tutelado
 */
export const obtenerTutelasPorIdTuteladoHandler = onRequest(async (req, res) => {
  try {
    const idTutelado = req.query.idTutelado as string;

    if (!idTutelado) {
      throw new Error("Falta el parámetro 'idTutelado'");
    }

    const tutelas = await TutelaService.obtenerTutelasPorIdTutelado(idTutelado);

    res.status(200).json({
      success: true,
      tutelas
    });
  } catch (error: any) {
    console.error("❌ Error en obtenerTutelasPorIdTuteladoHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 🔹 Actualizar tutela por ID
 */
export const actualizarTutelaHandler = onRequest(async (req, res) => {
  try {
    const idTutela = req.query.idTutela as string;
    const updatedData = req.body;

    if (!idTutela) {
      throw new Error("Falta el parámetro 'idTutela'");
    }

    if (!updatedData || typeof updatedData !== "object") {
      throw new Error("Datos de actualización no válidos");
    }

    await TutelaService.actualizarTutela(idTutela, updatedData);

    res.status(200).json({
      success: true,
      message: `Tutela con ID ${idTutela} actualizada correctamente`
    });
  } catch (error: any) {
    console.error("❌ Error en actualizarTutelaHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});
