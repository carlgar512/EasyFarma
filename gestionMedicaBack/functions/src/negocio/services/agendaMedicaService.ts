import { deleteAgendaMedicaById, deleteAgendasAntiguasFromFirestore, deleteAllAgendasMedicasByMedicoId, getAgendaByMedicoYFecha, getAgendaMedicaById, getAgendasMedicasByMedicoId, saveAgendaMedicaToFirestore, updateAgendaMedicaHorarios } from "../../persistencia/repositorios/agendaMedicaDAO";
import { logger } from "../../presentacion/config/logger";
import { AgendaMedica } from "../modelos/AgendaMedica";



export class AgendaMedicaService {

  /**
   * Recupera todas las agendas médicas asociadas a un médico
   */
  static async obtenerAgendasDeMedico(idMedico: string): Promise<any[]> {
    logger.info(`🔍 Obteniendo agendas médicas del médico con UID: ${idMedico}`);

    const rawData = await getAgendasMedicasByMedicoId(idMedico);
    if (!rawData || rawData.length === 0) {
      logger.warn(`⚠️ No se encontraron agendas para el médico: ${idMedico}`);
      return [];
    }

    logger.info(`✅ Se encontraron ${rawData.length} agendas para el médico ${idMedico}`);
    return rawData.map((data: any) => AgendaMedica.fromFirestore(data.uid, data).toFrontDTO());
  }

  /**
   * Guarda una lista de agendas médicas en Firestore
   */
  static async guardarAgendas(agendasData: any[]): Promise<void> {
    logger.info(`💾 Recibidas ${agendasData.length} agendas médicas para guardar`);

    for (const agendaRaw of agendasData) {
      const agenda = new AgendaMedica(
        agendaRaw.fecha,
        agendaRaw.idMedico,
        agendaRaw.horarios
      );

      await saveAgendaMedicaToFirestore(agenda.toFirestoreObject());
      logger.info(`✅ Agenda médica para el médico ${agenda.getIdMedico()} en fecha ${agenda.getFecha()} guardada correctamente`);
    }
  }

  /**
   * Elimina todas las agendas médicas asociadas a un médico
   */
  static async eliminarAgendasMedico(idMedico: string): Promise<void> {
    logger.info(`🗑️ Eliminando todas las agendas médicas del médico: ${idMedico}`);

    await deleteAllAgendasMedicasByMedicoId(idMedico);

    logger.info(`✅ Agendas médicas del médico ${idMedico} eliminadas correctamente`);
  }

  /**
   * Elimina una agenda médica específica por su ID
   */
  static async eliminarAgendaPorId(idAgenda: string): Promise<void> {
    logger.info(`🗑️ Eliminando agenda médica con ID: ${idAgenda}`);

    await deleteAgendaMedicaById(idAgenda);

    logger.info(`✅ Agenda médica con ID ${idAgenda} eliminada correctamente`);
  }

  /**
 * Elimina todas las agendas médicas con fecha anterior a hoy
 */
  static async eliminarAgendasAntiguas(): Promise<void> {
    logger.info("🗑️ Eliminando todas las agendas médicas con fecha anterior a hoy desde el DAO");

    await deleteAgendasAntiguasFromFirestore();

    logger.info(`✅ Agendas médicas antiguas eliminadas correctamente desde el DAO`);
  }

  /**
 * Actualiza los horarios de una agenda médica específica.
 * @param idAgenda UID de la agenda médica.
 * @param nuevosHorarios Objeto con los nuevos horarios (ej: {"08:00-08:30": true, "08:30-09:00": false})
 */
  static async actualizarHorariosAgenda(idAgenda: string, nuevoEstado: boolean, horarioActualizar: string): Promise<void> {
    logger.info(`🔄 Validando y actualizando el horario '${horarioActualizar}' de la agenda médica con ID: ${idAgenda}`);
  
    const agendaData = await getAgendaMedicaById(idAgenda);
  
    if (!agendaData) {
      throw new Error("Agenda no encontrada");
    }
  
    const agenda = AgendaMedica.fromFirestore(idAgenda, agendaData);
    const horariosActuales = agenda.getHorarios();
  
    const valorActual = horariosActuales?.[horarioActualizar];
  
    if (typeof valorActual !== "boolean") {
      throw new Error(`El horario '${horarioActualizar}' no existe en la agenda`);
    }
  
    // 🔍 Verificación de conflicto de concurrencia
    if (nuevoEstado === false && valorActual === false) {
      throw new Error(`El horario '${horarioActualizar}' ya no está disponible. Por favor, seleccione otro.`);
    }
  
    await updateAgendaMedicaHorarios(idAgenda, horarioActualizar, nuevoEstado);

    logger.info(`✅ Horario '${horarioActualizar}' de la agenda ${idAgenda} actualizado correctamente`);
  }


  static async liberarHorario( idMedico: string, fecha: string, horario: string ): Promise<void> {
    const agenda = await getAgendaByMedicoYFecha(idMedico, fecha);
  
    if (!agenda) {
      throw new Error("Agenda médica no encontrada para ese médico y fecha");
    }
  
    const agendaModel = AgendaMedica.fromFirestore(agenda.uid, agenda.data);
    const horarios = agendaModel.getHorarios();
  
    if (!(horario in horarios)) {
      throw new Error(`El horario '${horario}' no existe en esta agenda`);
    }
  
    await updateAgendaMedicaHorarios(agenda.uid, horario, true);
  
    logger.info(`🟢 Horario '${horario}' liberado correctamente en la agenda ${agenda.uid}`);
  }
}