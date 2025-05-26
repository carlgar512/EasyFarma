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
export const updateAgendaMedicaHorarios = async (
    uid: string,
    horario: string,
    estado: boolean
): Promise<void> => {
    try {
        await db.collection(COLLECTION_NAME).doc(uid).update({
            [`horarios.${horario}`]: estado,
        });

        console.log(`✅ [DAO AgendaMedica] Horario '${horario}' actualizado a '${estado}' para la agenda ${uid}.`);
    } catch (error: any) {
        console.error("❌ [DAO AgendaMedica] Error al actualizar un horario de la agenda médica:", error.message);
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


export const getAgendaMedicaById = async (idAgenda: string): Promise<any | null> => {
    try {
        const docRef = db.collection(COLLECTION_NAME).doc(idAgenda);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            console.warn(`⚠️ [DAO AgendaMedica] Agenda con ID '${idAgenda}' no encontrada.`);
            return null;
        }

        return docSnap.data(); // Devuelves solo los datos planos
    } catch (error: any) {
        console.error(`❌ [DAO AgendaMedica] Error al obtener la agenda '${idAgenda}':`, error.message);
        throw error;
    }
};



export const getAgendaByMedicoYFecha = async (idMedico: string, fecha: string): Promise<{ uid: string; data: any } | null> => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME)
            .where("idMedico", "==", idMedico)
            .where("fecha", "==", fecha)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return {
            uid: doc.id,
            data: doc.data(),
        };
    } catch (error) {
        console.error("❌ [DAO AgendaMedica] Error al buscar agenda por médico y fecha:", error);
        throw new Error("No se pudo recuperar la agenda médica.");
    }
};
