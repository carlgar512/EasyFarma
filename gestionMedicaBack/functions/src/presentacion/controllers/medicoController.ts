import { onRequest } from "firebase-functions/https";
import { MedicoService } from "../../negocio/services/medicoService";
import { MapaFiltrosService } from "../../negocio/services/mapaFiltrosService";
import { CentroService } from "../../negocio/services/centroService";
import { EspecialidadService } from "../../negocio/services/especialidadService";

/**
 * 🔹 Guardar lista de médicos
 */
export const guardarMedicosHandler = onRequest(async (req, res) => {
  try {
    const medicosData = req.body;

    if (!Array.isArray(medicosData)) {
      throw new Error("El cuerpo debe ser un array de médicos");
    }

    await MedicoService.guardarMedicos(medicosData);

    res.status(201).json({
      success: true,
      message: "Médicos guardados correctamente"
    });
  } catch (error: any) {
    console.error("❌ Error en guardarMedicosHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
* 🔹 Obtener todos los médicos
*/
export const obtenerMedicosHandler = onRequest(async (_req, res) => {
  try {
    const medicos = await MedicoService.obtenerTodosLosMedicos();

    res.status(200).json({
      success: true,
      medicos
    });
  } catch (error: any) {
    console.error("❌ Error en obtenerMedicosHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
* 🔹 Obtener un médico por ID
*/
export const obtenerMedicoPorIdHandler = onRequest(async (req, res) => {
  try {
    const { idMedico } = req.query;

    if (!idMedico || typeof idMedico !== "string") {
      throw new Error("idMedico no válido");
    }

    const medico = await MedicoService.obtenerMedicoPorId(idMedico);

    if (!medico) {
      res.status(404).json({
        success: false,
        message: "Médico no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      medico
    });
  } catch (error: any) {
    console.error("❌ Error en obtenerMedicoPorIdHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
* 🔹 Obtener el mapa estructurado de filtros
*/
export const mapaFiltrosHandler = onRequest(async (req, res) => {
  try {
    const data = await MapaFiltrosService.construirMapa();

    res.status(200).json({
      success: true,
      data
    });

  } catch (error: any) {
    console.error("❌ Error en mapaFiltrosHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


export const getInfoMedicoHandler = onRequest(async (req, res) => {
  try {
    const idMedico = req.query.idMedico as string;

    if (!idMedico) {
      res.status(400).json({
        success: false,
        message: "El parámetro 'idMedico' es requerido.",
      });
    }

    const medico = await MedicoService.obtenerMedicoPorId(idMedico);

    if (!medico) {
      res.status(404).json({
        success: false,
        message: `No se encontró médico con ID ${idMedico}`,
      });
    }

    const centro = await CentroService.obtenerCentroPorId(medico.idCentro);
    const especialidad = await EspecialidadService.obtenerEspecialidadPorId(medico.idEspecialidad);

    res.status(200).json({
      success: true,
      data: {
        medico,
        centro,
        especialidad
      },
    });

  } catch (error: any) {
    console.error("❌ Error en getInfoMedicoHandler:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * 🔹 Obtener IDs de médicos recientes de un usuario
 */
export const medicosRecientesHandler = onRequest(async (req, res) => {
  try {
    const idUsuario = req.query.idUsuario as string;

    if (!idUsuario) {
      res.status(400).json({
        success: false,
        message: "Falta el parámetro 'idUsuario'"
      });
      return;
    }

    const idsMedicos = await MedicoService.obtenerMedicosRecientes(idUsuario);

    res.status(200).json({
      success: true,
      data: idsMedicos
    });

  } catch (error: any) {
    console.error("❌ Error en medicosRecientesHandler:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

