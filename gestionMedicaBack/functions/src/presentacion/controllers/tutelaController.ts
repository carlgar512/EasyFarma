import { onRequest } from "firebase-functions/v2/https";
import { TutelaService } from "../../negocio/services/tutelaService";
import { AuthService } from "../../negocio/services/authService";


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


export const getUsuariosTuteladosHandler = onRequest(async (req, res) => {
  try {
    const idTutor = req.query.idTutor as string;

    if (!idTutor) {
      res.status(400).json({
        success: false,
        error: "Falta el parámetro idTutor.",
      });
    }

    // 1. Obtener todas las tutelas del tutor
    const todasLasTutelas = await TutelaService.obtenerTutelasPorIdTutor(idTutor);

    // 2. Filtrar solo las activas (sin fechaDesvinculacion)
    const tutelasActivas = todasLasTutelas.filter(
      (tutela) => !tutela.fechaDesvinculacion
    );

    // 3. Obtener los datos de cada usuario tutelado
    const usuariosTutelados: any[] = [];

    for (const tutela of tutelasActivas) {
      try {
        const usuario = await AuthService.getCurrentUser(tutela.idTutelado);
        usuariosTutelados.push(usuario);
      } catch (error) {
        console.warn(`⚠ No se pudo obtener el usuario con ID ${tutela.idTutelado}`);
        // Puedes omitir o manejar el error por usuario individual aquí
      }
    }

    // 4. Devolver la lista de usuarios tutelados
    res.status(200).json({
      success: true,
      data: usuariosTutelados,
    });
  } catch (error) {
    console.error("❌ Error en getUsuariosTutelados:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener los usuarios tutelados.",
    });
  }
});


export const getTutoresPorTuteladoHandler = onRequest(async (req, res) => {
  try {
    const idTutelado = req.query.idTutelado as string;

    if (!idTutelado) {
      res.status(400).json({
        success: false,
        error: "Falta el parámetro idTutelado.",
      });
    }

    // 1. Obtener todas las tutelas del tutelado
    const todasLasTutelas = await TutelaService.obtenerTutelasPorIdTutelado(idTutelado);

    // 2. Filtrar tutelas activas (sin fechaDesvinculacion)
    const tutelasActivas = todasLasTutelas.filter(
      (tutela) => !tutela.fechaDesvinculacion
    );

    // 3. Obtener los datos de cada tutor
    const tutores: any[] = [];

    for (const tutela of tutelasActivas) {
      try {
        const tutor = await AuthService.getCurrentUser(tutela.idTutor);
        tutores.push(tutor);
      } catch (error) {
        console.warn(`⚠ No se pudo obtener el tutor con ID ${tutela.idTutor}`);
        // Puedes omitir o manejar el error individual aquí
      }
    }

    // 4. Devolver la lista de tutores
    res.status(200).json({
      success: true,
      data: tutores,
    });
  } catch (error) {
    console.error("❌ Error en getTutoresPorTuteladoHandler:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener los tutores del usuario.",
    });
  }
});

export const finalizarTutelaHandler = onRequest(async (req, res) => {
  try {
    const idTutela = req.query.idTutela as string;

    if (!idTutela) {
      res.status(400).json({
        success: false,
        message: "Falta el parámetro 'idTutela'.",
      });
    }

    await TutelaService.finalizarTutela(idTutela);

    res.status(200).json({
      success: true,
      message: `Tutela con ID ${idTutela} finalizada correctamente.`,
    });
  } catch (error: any) {
    console.error("❌ Error en finalizarTutelaHandler:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Error al finalizar la tutela.",
    });
  }
});


export const getTutelaActivaEntreDosHandler = onRequest(async (req, res) => {
  try {
    const idTutor = req.query.idTutor as string;
    const idTutelado = req.query.idTutelado as string;

    if (!idTutor || !idTutelado) {
      res.status(400).json({
        success: false,
        message: "Faltan los parámetros 'idTutor' o 'idTutelado'.",
      });
    }

    const tutela = await TutelaService.obtenerTutelaActivaEntreTutorYTutelado(idTutor, idTutelado);

    res.status(200).json({
      success: true,
      data: tutela, // puede ser un objeto o null
    });
  } catch (error: any) {
    console.error("❌ Error en getTutelaActivaEntreDosHandler:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Error al obtener la tutela activa.",
    });
  }
});

