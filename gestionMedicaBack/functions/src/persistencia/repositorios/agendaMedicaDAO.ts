import { db } from "../../presentacion/config/firebaseConfig";

const COLLECTION_NAME = "agendasMedicas";

/**
 * Guarda una nueva agenda médica en Firestore.
 * @param agendaMedicaData Objeto con los datos de la agenda a guardar.
 */
export const saveAgendaMedicaToFirestore = async (agendaMedicaData: any) => {
    try {
        await db.collection(COLLECTION_NAME).add(agendaMedicaData);
        console.log("✅ [DAO AgendaMedica] Agenda médica guardada correctamente.");
    } catch (error: any) {
        console.error("❌ [DAO AgendaMedica] Error al guardar agenda médica:", error.message);
        throw error;
    }
};

/**
* Obtiene todas las agendas médicas almacenadas en Firestore.
* @returns Array de agendas médicas.
*/
export const getAllAgendasMedicasFromFirestore = async () => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).get();
        const agendas = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));
        console.log("✅ [DAO AgendaMedica] Agendas médicas obtenidas correctamente.");
        return agendas;
    } catch (error: any) {
        console.error("❌ [DAO AgendaMedica] Error al obtener agendas médicas:", error.message);
        throw error;
    }
};


/**
* Obtiene todas las agendas médicas asociadas a un médico específico.
* @param idMedico UID del médico.
* @returns Array de agendas médicas del médico indicado.
*/
export const getAgendasMedicasByMedicoId = async (idMedico: string) => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME)
            .where("idMedico", "==", idMedico)
            .get();

        const agendas = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));

        console.log(`✅ [DAO AgendaMedica] Agendas médicas del médico ${idMedico} obtenidas correctamente.`);
        return agendas;
    } catch (error: any) {
        console.error("❌ [DAO AgendaMedica] Error al obtener agendas médicas por médico:", error.message);
        throw error;
    }
};

/**
* Actualiza los horarios de una agenda médica existente en Firestore.
* @param uid UID de la agenda médica.
* @param nuevosHorarios Objeto con los nuevos horarios.
*/
export const updateAgendaMedicaHorarios = async (uid: string, nuevosHorarios: Record<string, boolean>) => {
    try {
        await db.collection(COLLECTION_NAME).doc(uid).update({
            horarios: nuevosHorarios
        });
        console.log(`✅ [DAO AgendaMedica] Horarios actualizados para la agenda ${uid}.`);
    } catch (error: any) {
        console.error("❌ [DAO AgendaMedica] Error al actualizar horarios de la agenda médica:", error.message);
        throw error;
    }
};

/**
 * Elimina una agenda médica específica de Firestore por su UID.
 * @param uid UID de la agenda médica.
 */
export const deleteAgendaMedicaById = async (uid: string) => {
    try {
        await db.collection(COLLECTION_NAME).doc(uid).delete();
        console.log(`✅ [DAO AgendaMedica] Agenda médica ${uid} eliminada correctamente.`);
    } catch (error: any) {
        console.error("❌ [DAO AgendaMedica] Error al eliminar agenda médica:", error.message);
        throw error;
    }
};

/**
 * Elimina todas las agendas médicas asociadas a un médico específico.
 * @param idMedico UID del médico.
 */
export const deleteAllAgendasMedicasByMedicoId = async (idMedico: string) => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME)
            .where("idMedico", "==", idMedico)
            .get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`✅ [DAO AgendaMedica] Todas las agendas médicas del médico ${idMedico} eliminadas correctamente.`);
    } catch (error: any) {
        console.error("❌ [DAO AgendaMedica] Error al eliminar todas las agendas médicas del médico:", error.message);
        throw error;
    }
};

/**
 * Elimina todas las agendas médicas de la colección.
 */
export const deleteAllAgendasMedicas = async () => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log("✅ [DAO AgendaMedica] Todas las agendas médicas eliminadas correctamente.");
    } catch (error: any) {
        console.error("❌ [DAO AgendaMedica] Error al eliminar todas las agendas médicas:", error.message);
        throw error;
    }
};


/**
 * Elimina todas las agendas médicas cuya fecha sea anterior a hoy.
 */
/**
 * Elimina todas las agendas médicas cuya fecha sea anterior a hoy.
 * Formato de fecha esperado: "DD-MM-YYYY"
 */
export const deleteAgendasAntiguasFromFirestore = async () => {
    try {
      const hoy = new Date();
      
      const snapshot = await db.collection(COLLECTION_NAME).get();
  
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.fecha) {
          const partes = data.fecha.split("-"); // ["DD", "MM", "YYYY"]
          const fechaAgenda = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`); // "YYYY-MM-DD"
  
          if (fechaAgenda < hoy) {
            batch.delete(doc.ref);
          }
        }
      });
  
      await batch.commit();
      console.log(`✅ [DAO AgendaMedica] Agendas médicas antiguas eliminadas correctamente.`);
    } catch (error: any) {
      console.error("❌ [DAO AgendaMedica] Error al eliminar agendas antiguas:", error.message);
      throw error;
    }
  };
  