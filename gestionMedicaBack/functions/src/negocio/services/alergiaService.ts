import { deleteAlergiaByIdFromFirestore, deleteAlergiasFromFirestore, getAlergiasFromFirestore, saveAlergiaToFirestore } from "../../persistencia/repositorios/alergiaDAO";
import { logger } from "../../presentacion/config/logger";
import { Alergia } from "../modelos/Alergia";



export class AlergiaService {
  /**
   * Recupera las alergias asociadas a un usuario
   */

  static async obtenerAlergiasUsuario(uidUsuario: string):Promise<any>{
    logger.info(`🔍 Obteniendo alergias del usuario con UID: ${uidUsuario}`);
  
    const rawData = await getAlergiasFromFirestore(uidUsuario);
    if (!rawData || rawData.length === 0) {
      logger.warn(`⚠️ No se encontraron alergias para el usuario: ${uidUsuario}`);
      return [];
    }
  
    logger.info(`✅ Se encontraron ${rawData.length} alergias para el usuario ${uidUsuario}`);
    return rawData.map((data: any) => Alergia.fromFirestore(data).toFrontDTO());
  }
  

  /**
   * Guarda una lista de alergias en Firestore
   */
  static async guardarAlergias(alergiasData: any[]): Promise<void> {
    logger.info(`💾 Recibidas ${alergiasData.length} alergias para guardar`);
  
    for (const alergiaRaw of alergiasData) {
      const alergia = Alergia.fromFirestore(alergiaRaw); // Creamos modelo desde los datos planos
  
      await saveAlergiaToFirestore(alergia.toFirestoreObject());
      logger.info(`✅ Alergia "${alergia.getTitulo()}" guardada para el usuario ${alergia.getUidUsuario()}`);
    }
  }
  
  /**
   * Elimina todas las alergias de un usuario
   */
  static async eliminarAlergiasUsuario(uidUsuario: string): Promise<void> {
    logger.info(`🗑️ Eliminando todas las alergias del usuario: ${uidUsuario}`);

    await deleteAlergiasFromFirestore(uidUsuario);

    logger.info(`✅ Alergias del usuario ${uidUsuario} eliminadas correctamente`);
  }

  /**
   * Elimina una alergia específica por su ID
   */
  static async eliminarAlergiaPorId(idAlergia: string): Promise<void> {
    logger.info(`🗑️ Eliminando alergia con ID: ${idAlergia}`);

    await deleteAlergiaByIdFromFirestore(idAlergia);

    logger.info(`✅ Alergia con ID ${idAlergia} eliminada correctamente`);
  }
}
