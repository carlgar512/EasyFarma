
import {
  saveCitaToFirestore,
  getCitasNoArchivadasUsuarioFromFirestore,
  getCitasArchivadasUsuarioFromFirestore,
  getCitasPendientesUsuarioFromFirestore,
  getCitasMedicoFromFirestore,
  getCitaByIdFromFirestore,
  updateCitaInFirestore,
  deleteCitasUsuarioFromFirestore,
  deleteCitaByIdFromFirestore
} from "../../persistencia/repositorios/citaDAO";
import { logger } from "../../presentacion/config/logger";
import { Cita } from "../modelos/Cita";
// Ajusta si tienes logger

export class CitaService {

  /**
   * 🔹 Guarda una nueva cita
   */
  static async guardarCita(citaData: any): Promise<void> {
    logger.info("💾 Guardando una nueva cita...");

    const cita = new Cita(
        citaData.fechaCita,
        citaData.horaCita,
        citaData.estadoCita,
        citaData.archivado,
        citaData.idUsuario,
        citaData.idMedico,
    );
    await saveCitaToFirestore(cita.toFirestoreObject());

    logger.info(`✅ Cita guardada correctamente para usuario ${cita.getIdUsuario()}`);
  }

  /**
   * 🔹 Obtiene las citas NO archivadas de un usuario
   */
  static async obtenerCitasNoArchivadasUsuario(idUsuario: string): Promise<any[]> {
    logger.info(`🔍 Buscando citas NO archivadas del usuario: ${idUsuario}`);

    const citasRaw = await getCitasNoArchivadasUsuarioFromFirestore(idUsuario);
    return citasRaw.map(c => Cita.fromFirestore(c.uid, c).toFrontDTO());
  }

  /**
   * 🔹 Obtiene las citas ARCHIVADAS de un usuario
   */
  static async obtenerCitasArchivadasUsuario(idUsuario: string): Promise<any[]> {
    logger.info(`🔍 Buscando citas ARCHIVADAS del usuario: ${idUsuario}`);

    const citasRaw = await getCitasArchivadasUsuarioFromFirestore(idUsuario);
    return citasRaw.map(c => Cita.fromFirestore(c.uid, c).toFrontDTO());
  }

  /**
   * 🔹 Obtiene las citas PENDIENTES de un usuario
   */
  static async obtenerCitasPendientesUsuario(idUsuario: string): Promise<any[]> {
    logger.info(`🔍 Buscando citas PENDIENTES del usuario: ${idUsuario}`);

    const citasRaw = await getCitasPendientesUsuarioFromFirestore(idUsuario);
    return citasRaw.map(c => Cita.fromFirestore(c.uid, c).toFrontDTO());
  }

  /**
   * 🔹 Obtiene todas las citas de un médico
   */
  static async obtenerCitasMedico(idMedico: string): Promise<any[]> {
    logger.info(`🔍 Buscando citas del médico: ${idMedico}`);

    const citasRaw = await getCitasMedicoFromFirestore(idMedico);
    return citasRaw.map(c => Cita.fromFirestore(c.uid, c).toFrontDTO());
  }

  /**
   * 🔹 Obtiene una cita específica por su ID
   */
  static async obtenerCitaPorId(idCita: string): Promise<any> {
    logger.info(`🔍 Buscando cita con ID: ${idCita}`);

    const citaRaw = await getCitaByIdFromFirestore(idCita);
    return Cita.fromFirestore(citaRaw.uid, citaRaw).toFrontDTO();
  }

  /**
   * 🔹 Actualiza los datos de una cita existente
   */
  static async actualizarCita(idCita: string, updatedData: any): Promise<void> {
    logger.info(`🔄 Actualizando cita con ID: ${idCita}`);

    await updateCitaInFirestore(idCita, updatedData);

    logger.info(`✅ Cita ${idCita} actualizada correctamente`);
  }

  /**
   * 🔹 Elimina todas las citas de un usuario
   */
  static async eliminarCitasUsuario(idUsuario: string): Promise<void> {
    logger.info(`🗑️ Eliminando todas las citas del usuario: ${idUsuario}`);

    await deleteCitasUsuarioFromFirestore(idUsuario);

    logger.info(`✅ Citas del usuario ${idUsuario} eliminadas correctamente`);
  }

  /**
   * 🔹 Elimina una cita específica por su ID
   */
  static async eliminarCitaPorId(idCita: string): Promise<void> {
    logger.info(`🗑️ Eliminando cita con ID: ${idCita}`);

    await deleteCitaByIdFromFirestore(idCita);

    logger.info(`✅ Cita con ID ${idCita} eliminada correctamente`);
  }
}
