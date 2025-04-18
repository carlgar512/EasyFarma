import { db } from "../../presentacion/config/firebaseConfig";


const COLLECTION_NAME = "alergias";
// 🔹 1. Guardar una alergia
export const saveAlergiaToFirestore = async (alergiaData: any) => {
    try {
        await db.collection(COLLECTION_NAME).add(alergiaData);
        console.log("✅ [DAO Alergia] Alergia guardada correctamente.");
    } catch (error: any) {
        console.error("❌ [DAO Alergia] Error al guardar alergia:", error.message);
        throw error;
    }
};

// 🔹 2. Obtener alergias por usuario
export const getAlergiasFromFirestore = async (uidUsuario: string) => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).where("uidUsuario", "==", uidUsuario).get();

        if (snapshot.empty) {
            console.log("🔍 [DAO Alergia] No se encontraron alergias para este usuario.");
            return [];
        }

        const alergias = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`✅ [DAO Alergia] Se recuperaron ${alergias.length} alergias.`);
        return alergias;
    } catch (error: any) {
        console.error("❌ [DAO Alergia] Error al recuperar alergias:", error.message);
        throw error;
    }
};

// 🔹 3. Eliminar todas las alergias de un usuario
export const deleteAlergiasFromFirestore = async (uidUsuario: string) => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).where("uidUsuario", "==", uidUsuario).get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`🗑️ [DAO Alergia] Se eliminaron ${snapshot.size} alergias.`);
    } catch (error: any) {
        console.error("❌ [DAO Alergia] Error al eliminar alergias:", error.message);
        throw error;
    }
};

// 🔹 4. Elimina una alergia por su id de doc
export const deleteAlergiaByIdFromFirestore = async (alergiaId: string) => {
    try {
        await db.collection(COLLECTION_NAME).doc(alergiaId).delete();
        console.log(`🗑️ [DAO Alergia] Alergia con ID ${alergiaId} eliminada correctamente.`);
    } catch (error: any) {
        console.error("❌ [DAO Alergia] Error al eliminar la alergia:", error.message);
        throw error;
    }
};
