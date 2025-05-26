// 📁 lineaTratamientoDAO.ts
import { db } from "../../presentacion/config/firebaseConfig";

const LINEA_COLLECTION = "lineasTratamiento";

// 🔹 1. Guardar una línea de tratamiento
export const saveLineaTratamientoToFirestore = async (lineaData: any) => {
  try {
    await db.collection(LINEA_COLLECTION).add(lineaData);
    console.log("✅ [DAO LíneaTratamiento] Línea de tratamiento guardada correctamente.");
  } catch (error: any) {
    console.error("❌ [DAO LíneaTratamiento] Error al guardar línea:", error.message);
    throw error;
  }
};

// 🔹 2. Obtener líneas por ID de tratamiento
export const getLineasByTratamientoFromFirestore = async (idTratamiento: string) => {
  try {
    const snapshot = await db
      .collection(LINEA_COLLECTION)
      .where("idTratamiento", "==", idTratamiento)
      .get();

    if (snapshot.empty) {
      console.log("🔍 [DAO LíneaTratamiento] No se encontraron líneas para este tratamiento.");
      return [];
    }

    const lineas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO LíneaTratamiento] Se encontraron ${lineas.length} líneas para el tratamiento ${idTratamiento}.`);
    return lineas;
  } catch (error: any) {
    console.error("❌ [DAO LíneaTratamiento] Error al obtener líneas por tratamiento:", error.message);
    throw error;
  }
};

// 🔹 3. Obtener todas las líneas de tratamiento
export const getAllLineasTratamientoFromFirestore = async () => {
  try {
    const snapshot = await db.collection(LINEA_COLLECTION).get();

    if (snapshot.empty) {
      console.log("🔍 [DAO LíneaTratamiento] No se encontraron líneas de tratamiento.");
      return [];
    }

    const lineas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO LíneaTratamiento] Se encontraron ${lineas.length} líneas de tratamiento.`);
    return lineas;
  } catch (error: any) {
    console.error("❌ [DAO LíneaTratamiento] Error al obtener todas las líneas:", error.message);
    throw error;
  }
};

// 🔹 4. Obtener línea de tratamiento por ID
export const getLineaTratamientoByIdFromFirestore = async (idLinea: string) => {
  try {
    const doc = await db.collection(LINEA_COLLECTION).doc(idLinea).get();

    if (!doc.exists) {
      console.log(`🔍 [DAO LíneaTratamiento] No se encontró línea con ID ${idLinea}.`);
      return null;
    }

    console.log(`✅ [DAO LíneaTratamiento] Línea con ID ${idLinea} encontrada.`);
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error: any) {
    console.error("❌ [DAO LíneaTratamiento] Error al obtener línea por ID:", error.message);
    throw error;
  }
};

// 🔹 5. Eliminar línea de tratamiento por ID
export const deleteLineaTratamientoByIdFromFirestore = async (idLinea: string) => {
  try {
    await db.collection(LINEA_COLLECTION).doc(idLinea).delete();
    console.log(`🗑️ [DAO LíneaTratamiento] Línea con ID ${idLinea} eliminada correctamente.`);
  } catch (error: any) {
    console.error("❌ [DAO LíneaTratamiento] Error al eliminar línea:", error.message);
    throw error;
  }
};

// 🔹 6. Eliminar líneas por ID de tratamiento
export const deleteLineasByTratamientoFromFirestore = async (idTratamiento: string) => {
  try {
    const snapshot = await db
      .collection(LINEA_COLLECTION)
      .where("idTratamiento", "==", idTratamiento)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`🗑️ [DAO LíneaTratamiento] Se eliminaron ${snapshot.size} líneas para el tratamiento ${idTratamiento}.`);
  } catch (error: any) {
    console.error("❌ [DAO LíneaTratamiento] Error al eliminar líneas por tratamiento:", error.message);
    throw error;
  }
};

// 🔹 7. Eliminar todas las líneas de tratamiento
export const deleteAllLineasTratamientoFromFirestore = async () => {
  try {
    const snapshot = await db.collection(LINEA_COLLECTION).get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`🗑️ [DAO LíneaTratamiento] Se eliminaron ${snapshot.size} líneas de tratamiento.`);
  } catch (error: any) {
    console.error("❌ [DAO LíneaTratamiento] Error al eliminar todas las líneas:", error.message);
    throw error;
  }
};
