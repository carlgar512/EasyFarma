// 📁 centroService.ts
import {
    saveCentroToFirestore,
    getAllCentrosFromFirestore
  } from "../../persistencia/repositorios/centroDAO";
  import { logger } from "../../presentacion/config/logger";
  import { Centro } from "../modelos/Centro";
  
  export class CentroService {
    /**
     * Guarda una lista de centros en Firestore
     */
    static async guardarCentros(centrosData: any[]): Promise<void> {
      logger.info(`💾 Recibidos ${centrosData.length} centros para guardar`);
  
      for (const data of centrosData) {
        const centro = new Centro(
          data.nombreCentro,
          data.ubicacion ?? null,
          data.telefono ?? null
        );
  
        await saveCentroToFirestore(centro.toFirestoreObject());
  
        logger.info(`✅ Centro "${centro.getNombreCentro()}" guardado.`);
      }
    }
  
    /**
     * Obtiene todos los centros desde Firestore
     */
    static async obtenerTodosLosCentros(): Promise<any[]> {
      logger.info("📚 Obteniendo todos los centros...");
  
      const rawData = await getAllCentrosFromFirestore();
  
      const centros = rawData.map((c: any) =>
        Centro.fromFirestore(c.id, c).toFrontDTO()
      );
  
      logger.info(`✅ Se encontraron ${centros.length} centros.`);
      return centros;
    }
  }
  