import { getTutelasByIdTutelado, getTutelasByIdTutor, saveTutelaToFirestore, updateTutelaInFirestore } from "../../persistencia/repositorios/tutelaDAO";
import { logger } from "../../presentacion/config/logger";
import { Tutela } from "../modelos/Tutela";

export class TutelaService {
    /**
     * Guarda una o varias tutelas en Firestore
     */
    static async guardarTutelas(tutelasData: any[]): Promise<void> {
      logger.info(`💾 Recibidas ${tutelasData.length} tutelas para guardar`);
  
      for (const data of tutelasData) {
        const tutela = new Tutela(
          data.fechaVinculacion,
          data.fechaDesvinculacion ?? null,
          data.idTutor,
          data.idTutelado
        );
  
        await saveTutelaToFirestore(tutela.toFirestoreObject());
  
        logger.info(`✅ Tutela entre tutor "${tutela.getIdTutor()}" y tutelado "${tutela.getIdTutelado()}" guardada.`);
      }
    }
  
    /**
     * Obtiene todas las tutelas de un tutor
     */
    static async obtenerTutelasPorIdTutor(idTutor: string): Promise<any[]> {
      logger.info(`🔍 Obteniendo tutelas del tutor con ID: ${idTutor}`);
  
      const rawData = await getTutelasByIdTutor(idTutor);
  
      const tutelas = rawData.map((t: any) =>
        Tutela.fromFirestore(t.id, t).toFrontDTO()
      );
  
      logger.info(`✅ Se encontraron ${tutelas.length} tutelas del tutor.`);
      return tutelas;
    }
  
    /**
     * Obtiene todas las tutelas de un tutelado
     */
    static async obtenerTutelasPorIdTutelado(idTutelado: string): Promise<any[]> {
      logger.info(`🔍 Obteniendo tutelas del tutelado con ID: ${idTutelado}`);
  
      const rawData = await getTutelasByIdTutelado(idTutelado);
  
      const tutelas = rawData.map((t: any) =>
        Tutela.fromFirestore(t.id, t).toFrontDTO()
      );
  
      logger.info(`✅ Se encontraron ${tutelas.length} tutelas del tutelado.`);
      return tutelas;
    }
  
    /**
     * Actualiza una tutela por su ID
     */
    static async actualizarTutela(idTutela: string, updatedData: any): Promise<void> {
      logger.info(`✏️ Actualizando tutela con ID: ${idTutela}`);
  
      await updateTutelaInFirestore(idTutela, updatedData);
  
      logger.info(`✅ Tutela con ID ${idTutela} actualizada.`);
    }
  }