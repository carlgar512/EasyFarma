// 📁 medicoDAO.ts
import { db } from "../../presentacion/config/firebaseConfig";

const MEDICO_COLLECTION = "medicos";

// 🔹 1. Guardar un médico en Firestore
export const saveMedicoToFirestore = async (medicoData: any) => {
  try {
    await db.collection(MEDICO_COLLECTION).add(medicoData);
    console.log("✅ [DAO Médico] Médico guardado correctamente.");
  } catch (error: any) {
    console.error("❌ [DAO Médico] Error al guardar médico:", error.message);
    throw error;
  }
};

// 🔹 2. Obtener médicos por ID de especialidad
export const getMedicosByEspecialidadFromFirestore = async (idEspecialidad: string) => {
  try {
    const snapshot = await db
      .collection(MEDICO_COLLECTION)
      .where("idEspecialidad", "==", idEspecialidad)
      .get();

    if (snapshot.empty) {
      console.log("🔍 [DAO Médico] No se encontraron médicos para esta especialidad.");
      return [];
    }

    const medicos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO Médico] Se encontraron ${medicos.length} médicos para la especialidad ${idEspecialidad}.`);
    return medicos;
  } catch (error: any) {
    console.error("❌ [DAO Médico] Error al obtener médicos por especialidad:", error.message);
    throw error;
  }
};

// 🔹 3. Obtener médicos por ID de centro
export const getMedicosByCentroFromFirestore = async (idCentro: string) => {
  try {
    const snapshot = await db
      .collection(MEDICO_COLLECTION)
      .where("idCentro", "==", idCentro)
      .get();

    if (snapshot.empty) {
      console.log("🔍 [DAO Médico] No se encontraron médicos para este centro.");
      return [];
    }

    const medicos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO Médico] Se encontraron ${medicos.length} médicos para el centro ${idCentro}.`);
    return medicos;
  } catch (error: any) {
    console.error("❌ [DAO Médico] Error al obtener médicos por centro:", error.message);
    throw error;
  }
};

// 🔹 4. Obtener todos los médicos
export const getAllMedicosFromFirestore = async () => {
  try {
    const snapshot = await db.collection(MEDICO_COLLECTION).get();

    if (snapshot.empty) {
      console.log("🔍 [DAO Médico] No se encontraron médicos.");
      return [];
    }

    const medicos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO Médico] Se encontraron ${medicos.length} médicos en total.`);
    return medicos;
  } catch (error: any) {
    console.error("❌ [DAO Médico] Error al obtener todos los médicos:", error.message);
    throw error;
  }
};

// 🔹 5. Obtener médico por ID
export const getMedicoByIdFromFirestore = async (idMedico: string) => {
  try {
    const doc = await db.collection(MEDICO_COLLECTION).doc(idMedico).get();

    if (!doc.exists) {
      console.log(`🔍 [DAO Médico] No se encontró médico con ID ${idMedico}.`);
      return null;
    }

    console.log(`✅ [DAO Médico] Médico con ID ${idMedico} encontrado.`);
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error: any) {
    console.error("❌ [DAO Médico] Error al obtener médico:", error.message);
    throw error;
  }
};

// 🔹 6. Eliminar todos los médicos
export const deleteAllMedicosFromFirestore = async () => {
  try {
    const snapshot = await db.collection(MEDICO_COLLECTION).get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`🗑️ [DAO Médico] Se eliminaron ${snapshot.size} médicos.`);
  } catch (error: any) {
    console.error("❌ [DAO Médico] Error al eliminar todos los médicos:", error.message);
    throw error;
  }
};

// 🔹 7. Eliminar médico por ID
export const deleteMedicoByIdFromFirestore = async (idMedico: string) => {
  try {
    await db.collection(MEDICO_COLLECTION).doc(idMedico).delete();
    console.log(`🗑️ [DAO Médico] Médico con ID ${idMedico} eliminado correctamente.`);
  } catch (error: any) {
    console.error("❌ [DAO Médico] Error al eliminar médico:", error.message);
    throw error;
  }
};
