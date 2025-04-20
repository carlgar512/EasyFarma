// 📁 lineaTratamientoService.ts
import {
    saveLineaTratamientoToFirestore,
    getAllLineasTratamientoFromFirestore,
    getLineaTratamientoByIdFromFirestore,
    getLineasByTratamientoFromFirestore
  } from "../../persistencia/repositorios/lineaTratamientoDAO";
  import { logger } from "../../presentacion/config/logger";
  import { LineaTratamiento } from "../modelos/LineaTratamiento";
  
  export class LineaTratamientoService {
    /**
     * Guarda una lista de líneas de tratamiento en Firestore
     */
    static async guardarLineasTratamiento(lineasData: any[]): Promise<void> {
      logger.info(`💾 Recibidas ${lineasData.length} líneas de tratamiento para guardar`);
  
      for (const data of lineasData) {
        const linea = new LineaTratamiento(
          null,
          data.cantidad,
          data.unidad,
          data.medida,
          data.frecuencia,
          data.duracion,
          data.descripcion,
          data.idTratamiento,
          data.idMedicamento
        );
  
        await saveLineaTratamientoToFirestore(linea.toFirestoreObject());
  
        logger.info(`✅ Línea de tratamiento para tratamiento ${linea.getIdTratamiento()} guardada.`);
      }
    }
  
    /**
     * Obtiene todas las líneas de tratamiento
     */
    static async obtenerTodasLasLineasTratamiento(): Promise<any[]> {
      logger.info("📚 Obteniendo todas las líneas de tratamiento...");
  
      const rawData = await getAllLineasTratamientoFromFirestore();
  
      const lineas = rawData.map((l: any) =>
        LineaTratamiento.fromFirestore(l.id, l).toFrontDTO()
      );
  
      logger.info(`✅ Se encontraron ${lineas.length} líneas de tratamiento.`);
      return lineas;
    }
  
    /**
     * Obtiene una línea de tratamiento por su ID
     */
    static async obtenerLineaTratamientoPorId(idLinea: string): Promise<any> {
      logger.info(`🔍 Obteniendo línea de tratamiento con ID: ${idLinea}`);
  
      const doc = await getLineaTratamientoByIdFromFirestore(idLinea);
  
      if (!doc) {
        logger.warn(`⚠️ No se encontró línea con ID ${idLinea}`);
        return null;
      }
  
      const linea = LineaTratamiento.fromFirestore(doc.id, doc).toFrontDTO();
  
      logger.info(`✅ Línea de tratamiento ${idLinea} encontrada.`);
      return linea;
    }
  
    /**
     * Obtiene todas las líneas de un tratamiento por su ID
     */
    static async obtenerLineasPorIdTratamiento(idTratamiento: string): Promise<any[]> {
      logger.info(`📋 Obteniendo líneas para tratamiento: ${idTratamiento}`);
  
      const rawData = await getLineasByTratamientoFromFirestore(idTratamiento);
  
      const lineas = rawData.map((l: any) =>
        LineaTratamiento.fromFirestore(l.id, l).toFrontDTO()
      );
  
      logger.info(`✅ Se encontraron ${lineas.length} líneas para el tratamiento ${idTratamiento}.`);
      return lineas;
    }
  }
  