// 📁 especialidadService.ts
import { saveEspecialidadToFirestore, getAllEspecialidadesFromFirestore } from "../../persistencia/repositorios/especialidadDAO";
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
}