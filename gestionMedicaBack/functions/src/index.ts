/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {
    bajaUsuarioHandler,
    checkCodeHandler,
    getEmailByDniHandler,
    getUserInfoHandler,
    passwordResetHandler,
    recoveryRequestHandler,
    registerHandler,
    updateUserInfoHandler
} from "./presentacion/controllers/authController";
import "./negocio/services/ListenerService";
import {
    getAlergiasHandler,
    saveAlergiasHandler,
    deleteAlergiasByUsuarioHandler,
    deleteAlergiaByIdHandler
} from "./presentacion/controllers/alergiaController";

import {
    saveTratamientoHandler,
    getTratamientosArchivadosHandler,
    getTratamientosActivosHandler,
    deleteTratamientosByUsuarioHandler,
    deleteTratamientoByIdHandler,
    updateArchivadoTratamientoHandler,
    getTratamientosActualesHandler,
    obtenerTratamientoCompletoHandler
} from "./presentacion/controllers/tratamientoController";
import {
    guardarEspecialidadesHandler,
    obtenerEspecialidadesHandler
} from "./presentacion/controllers/especialidadController";
import {
    guardarCentrosHandler,
    obtenerCentrosHandler
} from "./presentacion/controllers/centroController";
import {
    guardarMedicamentosHandler,
    obtenerMedicamentoPorIdHandler,
    obtenerMedicamentosHandler
} from "./presentacion/controllers/medicamentoController";
import {
    guardarMedicosHandler,
    obtenerMedicoPorIdHandler,
    obtenerMedicosHandler
} from "./presentacion/controllers/medicoController";
import {
    guardarLineasTratamientoHandler,
    obtenerLineasPorIdTratamientoHandler,
    obtenerLineaTratamientoPorIdHandler,
    obtenerTodasLasLineasHandler
} from "./presentacion/controllers/lineaTratamientoController";



// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Exportación de funciones Auth
export const getEmailByDni = getEmailByDniHandler;
export const register = registerHandler;
export const recoveryRequest = recoveryRequestHandler;
export const checkCode = checkCodeHandler;
export const passwordReset = passwordResetHandler;
export const bajaUsuario = bajaUsuarioHandler;
export const getUserInfo = getUserInfoHandler;
export const updateUserInfo = updateUserInfoHandler;

// Exportación de funciones Alergia
export const getAlergias = getAlergiasHandler;
export const saveAlergias = saveAlergiasHandler;
export const deleteAlergiasByUsuario = deleteAlergiasByUsuarioHandler;
export const deleteAlergiaById = deleteAlergiaByIdHandler;

// Exportación de funciones Tratamiento
export const saveTratamiento = saveTratamientoHandler;
export const getTratamientosArchivados = getTratamientosArchivadosHandler;
export const getTratamientosActivos = getTratamientosActivosHandler;
export const deleteTratamientosByUsuario = deleteTratamientosByUsuarioHandler;
export const deleteTratamientoById = deleteTratamientoByIdHandler;
export const updateArchivadoTratamiento = updateArchivadoTratamientoHandler;
export const getTratamientosActuales = getTratamientosActualesHandler;
export const obtenerTratamientoCompleto = obtenerTratamientoCompletoHandler;

// Exportación de funciones Especialidad
export const guardarEspecialidades = guardarEspecialidadesHandler;
export const obtenerEspecialidades = obtenerEspecialidadesHandler;

// Exportación de funciones Centro
export const guardarCentros = guardarCentrosHandler;
export const obtenerCentros = obtenerCentrosHandler;

// Exportación de funciones Medicamento
export const guardarMedicamentos = guardarMedicamentosHandler;
export const obtenerMedicamentos = obtenerMedicamentosHandler;
export const obtenerMedicamentoPorId = obtenerMedicamentoPorIdHandler;

// Exportación de funciones Medico
export const guardarMedicos = guardarMedicosHandler;
export const obtenerMedicos = obtenerMedicosHandler;
export const obtenerMedicoPorId = obtenerMedicoPorIdHandler;

// Exportación de funciones LineaTratamiento
export const guardarLineasTratamiento = guardarLineasTratamientoHandler;
export const obtenerTodasLasLineasTratamiento = obtenerTodasLasLineasHandler;
export const obtenerLineaTratamientoPorId = obtenerLineaTratamientoPorIdHandler;
export const obtenerLineasPorIdTratamiento = obtenerLineasPorIdTratamientoHandler;

