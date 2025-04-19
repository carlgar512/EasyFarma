// 📁 CentroDAO.ts
import { db } from "../../presentacion/config/firebaseConfig";

const CENTRO_COLLECTION = "centros";

// 🔹 1. Guardar un centro en Firestore
export const saveCentroToFirestore = async (centroData: any) => {
  try {
    await db.collection(CENTRO_COLLECTION).add(centroData);
    console.log("✅ [DAO Centro] Centro guardado correctamente.");
  } catch (error: any) {
    console.error("❌ [DAO Centro] Error al guardar centro:", error.message);
    throw error;
  }
};

// 🔹 2. Obtener todos los centros
export const getAllCentrosFromFirestore = async () => {
  try {
    const snapshot = await db.collection(CENTRO_COLLECTION).get();

    if (snapshot.empty) {
      console.log("🔍 [DAO Centro] No se encontraron centros.");
      return [];
    }

    const centros = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO Centro] Se encontraron ${centros.length} centros.`);
    return centros;
  } catch (error: any) {
    console.error("❌ [DAO Centro] Error al obtener centros:", error.message);
    throw error;
  }
};

// 🔹 3. Eliminar todos los centros
export const deleteAllCentrosFromFirestore = async () => {
  try {
    const snapshot = await db.collection(CENTRO_COLLECTION).get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`🗑️ [DAO Centro] Se eliminaron ${snapshot.size} centros.`);
  } catch (error: any) {
    console.error("❌ [DAO Centro] Error al eliminar todos los centros:", error.message);
    throw error;
  }
};

// 🔹 4. Obtener un centro por ID
export const getCentroByIdFromFirestore = async (idCentro: string) => {
  try {
    const doc = await db.collection(CENTRO_COLLECTION).doc(idCentro).get();

    if (!doc.exists) {
      console.log(`🔍 [DAO Centro] No se encontró centro con ID ${idCentro}.`);
      return null;
    }

    console.log(`✅ [DAO Centro] Centro con ID ${idCentro} encontrado.`);
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error: any) {
    console.error("❌ [DAO Centro] Error al obtener centro:", error.message);
    throw error;
  }
};

// 🔹 5. Eliminar un centro por ID
export const deleteCentroByIdFromFirestore = async (idCentro: string) => {
  try {
    await db.collection(CENTRO_COLLECTION).doc(idCentro).delete();
    console.log(`🗑️ [DAO Centro] Centro con ID ${idCentro} eliminado correctamente.`);
  } catch (error: any) {
    console.error("❌ [DAO Centro] Error al eliminar centro:", error.message);
    throw error;
  }
};
