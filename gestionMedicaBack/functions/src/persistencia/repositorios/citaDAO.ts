
import { db } from "../../presentacion/config/firebaseConfig";

const COLLECTION_NAME = "citas";

/**
 * 🔹 Guarda una nueva cita en Firestore
 */
export const saveCitaToFirestore = async (citaData: any): Promise<void> => {
  try {
    await db.collection(COLLECTION_NAME).add(citaData);
    console.log("✅ [DAO Cita] Cita guardada correctamente.");
  } catch (error: any) {
    console.error("❌ [DAO Cita] Error al guardar cita:", error.message);
    throw error;
  }
};

/**
 * 🔹 Obtiene todas las citas de un usuario por su ID
 */
export const getCitasUsuarioFromFirestore = async (idUsuario: string): Promise<any[]> => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where("idUsuario", "==", idUsuario)
      .get();

    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error("❌ [DAO Cita] Error al obtener citas de usuario:", error.message);
    throw error;
  }
};


/**
 * 🔹 Obtiene todas las citas NO archivadas de un usuario
 */
export const getCitasNoArchivadasUsuarioFromFirestore = async (idUsuario: string): Promise<any[]> => {
    try {
      const snapshot = await db.collection(COLLECTION_NAME)
        .where("idUsuario", "==", idUsuario)
        .where("archivado", "==", false)
        .get();
  
      return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ [DAO Cita] Error al obtener citas no archivadas del usuario:", error.message);
      throw error;
    }
  };
  
  /**
   * 🔹 Obtiene todas las citas ARCHIVADAS de un usuario
   */
  export const getCitasArchivadasUsuarioFromFirestore = async (idUsuario: string): Promise<any[]> => {
    try {
      const snapshot = await db.collection(COLLECTION_NAME)
        .where("idUsuario", "==", idUsuario)
        .where("archivado", "==", true)
        .get();
  
      return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ [DAO Cita] Error al obtener citas archivadas del usuario:", error.message);
      throw error;
    }
  };
  
  /**
   * 🔹 Obtiene todas las citas PENDIENTES de un usuario
   */
  export const getCitasPendientesUsuarioFromFirestore = async (idUsuario: string): Promise<any[]> => {
    try {
      const snapshot = await db.collection(COLLECTION_NAME)
        .where("idUsuario", "==", idUsuario)
        .where("estadoCita", "==", "Pendiente") // 👈 Buscando solo las pendientes
        .get();
  
      return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("❌ [DAO Cita] Error al obtener citas pendientes del usuario:", error.message);
      throw error;
    }
  };

/**
 * 🔹 Obtiene todas las citas de un médico por su ID
 */
export const getCitasMedicoFromFirestore = async (idMedico: string): Promise<any[]> => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where("idMedico", "==", idMedico)
      .get();

    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error("❌ [DAO Cita] Error al obtener citas de médico:", error.message);
    throw error;
  }
};

/**
 * 🔹 Obtiene una cita por su UID
 */
export const getCitaByIdFromFirestore = async (idCita: string): Promise<any> => {
  try {
    const doc = await db.collection(COLLECTION_NAME).doc(idCita).get();

    if (!doc.exists) {
      throw new Error("No se encontró la cita.");
    }

    return { uid: doc.id, ...doc.data() };
  } catch (error: any) {
    console.error("❌ [DAO Cita] Error al obtener cita por ID:", error.message);
    throw error;
  }
};

/**
 * 🔹 Actualiza una cita completa por su UID
 */
export const updateCitaInFirestore = async (idCita: string, updatedData: any): Promise<void> => {
  try {
    await db.collection(COLLECTION_NAME).doc(idCita).update(updatedData);
    console.log("✅ [DAO Cita] Cita actualizada correctamente.");
  } catch (error: any) {
    console.error("❌ [DAO Cita] Error al actualizar cita:", error.message);
    throw error;
  }
};

/**
 * 🔹 Elimina todas las citas de un usuario
 */
export const deleteCitasUsuarioFromFirestore = async (idUsuario: string): Promise<void> => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME)
      .where("idUsuario", "==", idUsuario)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("✅ [DAO Cita] Citas del usuario eliminadas correctamente.");
  } catch (error: any) {
    console.error("❌ [DAO Cita] Error al eliminar citas de usuario:", error.message);
    throw error;
  }
};

/**
 * 🔹 Elimina una cita específica por su UID
 */
export const deleteCitaByIdFromFirestore = async (idCita: string): Promise<void> => {
  try {
    await db.collection(COLLECTION_NAME).doc(idCita).delete();
    console.log("✅ [DAO Cita] Cita eliminada correctamente.");
  } catch (error: any) {
    console.error("❌ [DAO Cita] Error al eliminar cita por ID:", error.message);
    throw error;
  }
};
