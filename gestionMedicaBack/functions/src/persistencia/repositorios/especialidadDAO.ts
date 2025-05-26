// 📁 EspecialidadDAO.ts
import { db } from "../../presentacion/config/firebaseConfig";

const ESPECIALIDAD_COLLECTION = "especialidades";

// 🔹 1. Guardar una especialidad en Firestore
export const saveEspecialidadToFirestore = async (especialidadData: any) => {
  try {
    await db.collection(ESPECIALIDAD_COLLECTION).add(especialidadData);
    console.log("✅ [DAO Especialidad] Especialidad guardada correctamente.");
  } catch (error: any) {
    console.error("❌ [DAO Especialidad] Error al guardar especialidad:", error.message);
    throw error;
  }
};

// 🔹 2. Obtener todas las especialidades
export const getAllEspecialidadesFromFirestore = async () => {
  try {
    const snapshot = await db.collection(ESPECIALIDAD_COLLECTION).get();

    if (snapshot.empty) {
      console.log("🔍 [DAO Especialidad] No se encontraron especialidades.");
      return [];
    }

    const especialidades = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO Especialidad] Se encontraron ${especialidades.length} especialidades.`);
    return especialidades;
  } catch (error: any) {
    console.error("❌ [DAO Especialidad] Error al obtener especialidades:", error.message);
    throw error;
  }
};

// 🔹 3. Eliminar una especialidad por ID
export const deleteEspecialidadByIdFromFirestore = async (idEspecialidad: string) => {
  try {
    await db.collection(ESPECIALIDAD_COLLECTION).doc(idEspecialidad).delete();
    console.log(`🗑️ [DAO Especialidad] Especialidad con ID ${idEspecialidad} eliminada correctamente.`);
  } catch (error: any) {
    console.error("❌ [DAO Especialidad] Error al eliminar especialidad:", error.message);
    throw error;
  }
};

// 🔹 4. Eliminar todas las especialidades
export const deleteAllEspecialidadesFromFirestore = async () => {
  try {
    const snapshot = await db.collection(ESPECIALIDAD_COLLECTION).get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`🗑️ [DAO Especialidad] Se eliminaron ${snapshot.size} especialidades.`);
  } catch (error: any) {
    console.error("❌ [DAO Especialidad] Error al eliminar todas las especialidades:", error.message);
    throw error;
  }
};

// 🔹 5. Obtener una especialidad por ID
export const getEspecialidadByIdFromFirestore = async (idEspecialidad: string) => {
  try {
    const doc = await db.collection(ESPECIALIDAD_COLLECTION).doc(idEspecialidad).get();

    if (!doc.exists) {
      console.log(`🔍 [DAO Especialidad] No se encontró especialidad con ID ${idEspecialidad}.`);
      return null;
    }

    console.log(`✅ [DAO Especialidad] Especialidad con ID ${idEspecialidad} encontrada.`);
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error: any) {
    console.error("❌ [DAO Especialidad] Error al obtener especialidad:", error.message);
    throw error;
  }
};
