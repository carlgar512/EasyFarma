// 📁 medicamentoDAO.ts
import { db } from "../../presentacion/config/firebaseConfig";

const MEDICAMENTO_COLLECTION = "medicamentos";

// 🔹 1. Guardar un medicamento en Firestore
export const saveMedicamentoToFirestore = async (medicamentoData: any) => {
  try {
    await db.collection(MEDICAMENTO_COLLECTION).add(medicamentoData);
    console.log("✅ [DAO Medicamento] Medicamento guardado correctamente.");
  } catch (error: any) {
    console.error("❌ [DAO Medicamento] Error al guardar medicamento:", error.message);
    throw error;
  }
};

// 🔹 2. Obtener todos los medicamentos
export const getAllMedicamentosFromFirestore = async () => {
  try {
    const snapshot = await db.collection(MEDICAMENTO_COLLECTION).get();

    if (snapshot.empty) {
      console.log("🔍 [DAO Medicamento] No se encontraron medicamentos.");
      return [];
    }

    const medicamentos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [DAO Medicamento] Se encontraron ${medicamentos.length} medicamentos.`);
    return medicamentos;
  } catch (error: any) {
    console.error("❌ [DAO Medicamento] Error al obtener medicamentos:", error.message);
    throw error;
  }
};

// 🔹 3. Obtener un medicamento por ID
export const getMedicamentoByIdFromFirestore = async (idMedicamento: string) => {
  try {
    const doc = await db.collection(MEDICAMENTO_COLLECTION).doc(idMedicamento).get();

    if (!doc.exists) {
      console.log(`🔍 [DAO Medicamento] No se encontró medicamento con ID ${idMedicamento}.`);
      return null;
    }

    console.log(`✅ [DAO Medicamento] Medicamento con ID ${idMedicamento} encontrado.`);
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error: any) {
    console.error("❌ [DAO Medicamento] Error al obtener medicamento:", error.message);
    throw error;
  }
};

// 🔹 4. Eliminar todos los medicamentos
export const deleteAllMedicamentosFromFirestore = async () => {
  try {
    const snapshot = await db.collection(MEDICAMENTO_COLLECTION).get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`🗑️ [DAO Medicamento] Se eliminaron ${snapshot.size} medicamentos.`);
  } catch (error: any) {
    console.error("❌ [DAO Medicamento] Error al eliminar todos los medicamentos:", error.message);
    throw error;
  }
};

// 🔹 5. Eliminar un medicamento por ID
export const deleteMedicamentoByIdFromFirestore = async (idMedicamento: string) => {
  try {
    await db.collection(MEDICAMENTO_COLLECTION).doc(idMedicamento).delete();
    console.log(`🗑️ [DAO Medicamento] Medicamento con ID ${idMedicamento} eliminado correctamente.`);
  } catch (error: any) {
    console.error("❌ [DAO Medicamento] Error al eliminar medicamento:", error.message);
    throw error;
  }
};
