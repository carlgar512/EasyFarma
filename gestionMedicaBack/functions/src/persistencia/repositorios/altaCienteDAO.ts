
import { db } from "../../presentacion/config/firebaseConfig";

/**
 * Guarda el objeto de alta de cliente directamente en Firestore.
 * Este objeto ya debe estar convertido con `toFirestoreObject()`
 */
export const saveAltaClienteToFirestore = async (altaData: any) => {
    try {

        await db.collection("altasCliente").add(altaData);
        console.log("✅ [DAO Altacliente] Guardado exitoso:");
    }
    catch (error: any) {
        console.error("❌ [DAO Altacliente] Error guardando en Firestore:", error.message);
        throw error;
    }
};

export const getAltasClienteFromFirestore = async (idUsuario: string) => {
    try {
        const snapshot = await db
          .collection("altasCliente")
          .where("idUsuario", "==", idUsuario)
          .get();
    
        if (snapshot.empty) {
          console.log(`ℹ️ [DAO AltaCliente] No se encontraron registros para el usuario: ${idUsuario}`);
          return [];
        }
    
        const resultados = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
    
        return resultados;
      } catch (error: any) {
        console.error("❌ [DAO AltaCliente] Error al obtener datos de Firestore:", error.message);
        throw error;
      }
};

export const getAltaActivaFromFirestore = async (idUsuario: string) => {
    try {
      const snapshot = await db
        .collection("altasCliente")
        .where("idUsuario", "==", idUsuario)
        .where("fechaBaja", "==", null)
        .limit(1) // Solo uno, porque solo puede haber un alta activa
        .get();
  
      if (snapshot.empty) {
        console.log(`ℹ️ [DAO AltaCliente] No hay alta activa para el usuario: ${idUsuario}`);
        return null;
      }
  
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error: any) {
      console.error("❌ [DAO AltaCliente] Error al obtener alta activa de Firestore:", error.message);
      throw error;
    }
  };
