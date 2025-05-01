// 📁 especialidadService.ts
import { saveEspecialidadToFirestore, getAllEspecialidadesFromFirestore, getEspecialidadByIdFromFirestore } from "../../persistencia/repositorios/especialidadDAO";
import { logger } from "../../presentacion/config/logger";
import { Especialidad } from "../modelos/Especialidad";

export class EspecialidadService {
  /**
   * Guarda una lista de especialidades en Firestore
   */
  static async guardarEspecialidades(especialidadesData: any[]): Promise<void> {
    logger.info(`💾 Recibidas ${especialidadesData.length} especialidades para guardar`);

    for (const data of especialidadesData) {
      const especialidad = new Especialidad(data.nombre);
      await saveEspecialidadToFirestore(especialidad.toFirestoreObject());

      logger.info(`✅ Especialidad ${especialidad.getNombre()} guardada.`);
    }
  }

  /**
   * Obtiene todas las especialidades desde Firestore
   */
  static async obtenerTodasLasEspecialidades(): Promise<any[]> {
    logger.info("📚 Obteniendo todas las especialidades...");

    const rawData = await getAllEspecialidadesFromFirestore();

    const especialidades = rawData.map((e: any) =>
      Especialidad.fromFirestore(e.id, e).toFrontDTO()
    );

    logger.info(`✅ Se encontraron ${especialidades.length} especialidades.`);
    return especialidades;
  }

  /**
 * Obtiene una especialidad por su ID
 */
static async obtenerEspecialidadPorId(idEspecialidad: string): Promise<any> {
  logger.info(`🔍 Obteniendo especialidad con ID: ${idEspecialidad}`);

  const doc = await getEspecialidadByIdFromFirestore(idEspecialidad);

  if (!doc) {
    logger.warn(`⚠️ No se encontró especialidad con ID ${idEspecialidad}`);
    return null;
  }

  const especialidad = Especialidad.fromFirestore(doc.id, doc).toFrontDTO();

  logger.info(`✅ Especialidad "${especialidad.nombreEspecialidad}" encontrada.`);
  return especialidad;
}

}