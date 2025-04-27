import { deleteAgendaMedicaById, deleteAgendasAntiguasFromFirestore, deleteAllAgendasMedicasByMedicoId, getAgendasMedicasByMedicoId, saveAgendaMedicaToFirestore, updateAgendaMedicaHorarios } from "../../persistencia/repositorios/agendaMedicaDAO";
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
static async actualizarHorariosAgenda(idAgenda: string, nuevosHorarios: Record<string, boolean>): Promise<void> {
    logger.info(`🔄 Actualizando horarios de la agenda médica con ID: ${idAgenda}`);
  
    await updateAgendaMedicaHorarios(idAgenda, nuevosHorarios);
  
    logger.info(`✅ Horarios de la agenda ${idAgenda} actualizados correctamente`);
  }
}
