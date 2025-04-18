// 🔹 1. Añadir un tratamiento a la base de datos
import { db } from "../../presentacion/config/firebaseConfig";
const TRATAMIENTO_COLLECTION = "tratamientos";


export const saveTratamientoToFirestore = async (tratamientoData: any) => {
    try {
      await db.collection(TRATAMIENTO_COLLECTION).add(tratamientoData);
      console.log("✅ [DAO Tratamiento] Tratamiento guardado correctamente.");
    } catch (error: any) {
      console.error("❌ [DAO Tratamiento] Error al guardar tratamiento:", error.message);
      throw error;
    }
  };
  
  // 🔹 2. Obtener tratamientos por idUsuario
  export const getTratamientosFromFirestore = async (idUsuario: string) => {
    try {
      const snapshot = await db
        .collection(TRATAMIENTO_COLLECTION)
        .where("idUsuario", "==", idUsuario)
        .get();
  
      if (snapshot.empty) {
        console.log("🔍 [DAO Tratamiento] No se encontraron tratamientos para este usuario.");
        return [];
      }
  
      const tratamientos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log(`✅ [DAO Tratamiento] Se encontraron ${tratamientos.length} tratamientos.`);
      return tratamientos;
    } catch (error: any) {
      console.error("❌ [DAO Tratamiento] Error al obtener tratamientos:", error.message);
      throw error;
    }
  };
  
  // 🔹 3. Eliminar todos los tratamientos de un usuario
  export const deleteTratamientosFromFirestore = async (idUsuario: string) => {
    try {
      const snapshot = await db
        .collection(TRATAMIENTO_COLLECTION)
        .where("idUsuario", "==", idUsuario)
        .get();
  
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
      console.log(`🗑️ [DAO Tratamiento] Se eliminaron ${snapshot.size} tratamientos.`);
    } catch (error: any) {
      console.error("❌ [DAO Tratamiento] Error al eliminar tratamientos:", error.message);
      throw error;
    }
  };
  
  // 🔹 4. Eliminar un tratamiento por ID
  export const deleteTratamientoByIdFromFirestore = async (idTratamiento: string) => {
    try {
      await db.collection(TRATAMIENTO_COLLECTION).doc(idTratamiento).delete();
      console.log(`🗑️ [DAO Tratamiento] Tratamiento con ID ${idTratamiento} eliminado correctamente.`);
    } catch (error: any) {
      console.error("❌ [DAO Tratamiento] Error al eliminar tratamiento:", error.message);
      throw error;
    }
  };
  
  // 🔹 5. Cambiar estado "archivado" de un tratamiento por ID
  export const toggleArchivadoTratamiento = async (
    idTratamiento: string,
    nuevoEstado: boolean
  ) => {
    try {
      await db.collection(TRATAMIENTO_COLLECTION).doc(idTratamiento).update({
        archivado: nuevoEstado,
      });
      console.log(`📦 [DAO Tratamiento] Tratamiento ${idTratamiento} archivado = ${nuevoEstado}`);
    } catch (error: any) {
      console.error("❌ [DAO Tratamiento] Error al actualizar archivado:", error.message);
      throw error;
    }
  };