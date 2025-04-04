import { DocumentData } from "firebase-admin/firestore";
import { CodigoExpiracion } from "../../negocio/modelos/CodigoExpiracion";
import { db } from "../../presentacion/config/firebaseConfig";


export const saveExpirationCodeToFirestore = async (expirationCode: CodigoExpiracion) => {

    try {
        console.log("📄 [DAO] Guardando en Firestore:", expirationCode.getDni());
        const userRef = db.collection("expirationCodes").doc(expirationCode.getDni());
        await userRef.set(expirationCode.toFirestoreObject());
        console.log("✅ [DAO] Guardado exitoso:", expirationCode.getDni());
    } catch (error: any) {
        console.error("❌ [DAO] Error guardando en Firestore:", error.message);
        throw error;
    }
};


export const getExpirationCode = async (dni: string): Promise<DocumentData | false | undefined> => {
    try {
        console.log(`🔍 Buscando código de expiración para el DNI: ${dni}`);

        // Referencia a Firestore
        const userRef = db.collection("expirationCodes").doc(dni);
        const doc = await userRef.get(); // Obtiene el documento de Firestore

        if (doc.exists && doc.data()) {
            console.log(`⚠️ El código de expiración ya existe para el DNI: ${dni}`);
            return doc.data(); // Existe un código para ese DNI y tiene datos
        } else {
            console.log(`✅ No se encontró un código de expiración para el DNI: ${dni}`);
            return false; // No existe o está vacío
        }
    } catch (error: any) {
        console.error("❌ Error al buscar el código de expiración:", error.message);
        throw error;
    }
};


export const deleteExpirationCode = async (dni: string): Promise<void> => {
    try {
        console.log(`🗑️ Intentando eliminar el código de expiración para el DNI: ${dni}`);
        // Referencia al documento en Firestore
        const userRef = db.collection("expirationCodes").doc(dni);
        // Eliminar el documento
        await userRef.delete();
        console.log(`✅ Código de expiración eliminado para el DNI: ${dni}`);
    } catch (error: any) {
        console.error("❌ Error al eliminar el código de expiración:", error.message);
        throw error;
    }
};