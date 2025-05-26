import { db } from "../../presentacion/config/firebaseConfig";

const TUTELA_COLLECTION = "tutelas";

// 🔸 Añadir tutela
export const saveTutelaToFirestore = async (tutelaData: any) => {
  try {
    const docRef = await db.collection(TUTELA_COLLECTION).add(tutelaData);
    console.log(`✅ [DAO Tutela] Tutela guardada con ID: ${docRef.id}`);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ [DAO Tutela] Error al guardar tutela:", error.message);
    throw error;
  }
};

// 🔸 Obtener tutela por ID
export const getTutelaById = async (idTutela: string) => {
  try {
    const doc = await db.collection(TUTELA_COLLECTION).doc(idTutela).get();

    if (!doc.exists) {
      console.log("🔍 [DAO Tutela] No se encontró la tutela.");
      return null;
    }

    const data = { id: doc.id, ...doc.data() };
    console.log("✅ [DAO Tutela] Tutela obtenida por ID.");
    return data;
  } catch (error: any) {
    console.error("❌ [DAO Tutela] Error al obtener tutela:", error.message);
    throw error;
  }
};

// 🔸 Obtener tutelas por idTutor
export const getTutelasByIdTutor = async (idTutor: string) => {
  try {
    const snapshot = await db
      .collection(TUTELA_COLLECTION)
      .where("idTutor", "==", idTutor)
      .get();

    if (snapshot.empty) {
      console.log("🔍 [DAO Tutela] No se encontraron tutelas para este tutor.");
      return [];
    }

    const tutelas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO Tutela] Se encontraron ${tutelas.length} tutelas del tutor.`);
    return tutelas;
  } catch (error: any) {
    console.error("❌ [DAO Tutela] Error al obtener tutelas del tutor:", error.message);
    throw error;
  }
};

// 🔸 Obtener tutelas por idTutelado
export const getTutelasByIdTutelado = async (idTutelado: string) => {
  try {
    const snapshot = await db
      .collection(TUTELA_COLLECTION)
      .where("idTutelado", "==", idTutelado)
      .get();

    if (snapshot.empty) {
      console.log("🔍 [DAO Tutela] No se encontraron tutelas para este tutelado.");
      return [];
    }

    const tutelas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO Tutela] Se encontraron ${tutelas.length} tutelas del tutelado.`);
    return tutelas;
  } catch (error: any) {
    console.error("❌ [DAO Tutela] Error al obtener tutelas del tutelado:", error.message);
    throw error;
  }
};

// 🔸 Actualizar tutela por ID
export const updateTutelaInFirestore = async (idTutela: string, updatedData: any) => {
  try {
    await db.collection(TUTELA_COLLECTION).doc(idTutela).update(updatedData);
    console.log(`✅ [DAO Tutela] Tutela actualizada con ID: ${idTutela}`);
  } catch (error: any) {
    console.error("❌ [DAO Tutela] Error al actualizar tutela:", error.message);
    throw error;
  }
};

// 🔸 Eliminar tutela por ID
export const deleteTutelaById = async (idTutela: string) => {
  try {
    await db.collection(TUTELA_COLLECTION).doc(idTutela).delete();
    console.log(`🗑️ [DAO Tutela] Tutela eliminada con ID: ${idTutela}`);
  } catch (error: any) {
    console.error("❌ [DAO Tutela] Error al eliminar tutela:", error.message);
    throw error;
  }
};

// 🔸 Eliminar todas las tutelas
export const deleteAllTutelas = async () => {
  try {
    const snapshot = await db.collection(TUTELA_COLLECTION).get();
    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`🗑️ [DAO Tutela] Todas las tutelas eliminadas correctamente.`);
  } catch (error: any) {
    console.error("❌ [DAO Tutela] Error al eliminar todas las tutelas:", error.message);
    throw error;
  }
};


export const getTutelasPorTutorYTutelado = async (idTutor: string, idTutelado: string) => {
  const snapshot = await db.collection("tutelas")
    .where("idTutor", "==", idTutor)
    .where("idTutelado", "==", idTutelado)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};