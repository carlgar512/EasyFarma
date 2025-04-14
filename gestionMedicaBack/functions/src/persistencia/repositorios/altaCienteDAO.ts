
import { db } from "../../presentacion/config/firebaseConfig";

/**
 * Guarda el objeto de alta de cliente directamente en Firestore.
 * Este objeto ya debe estar convertido con `toFirestoreObject()`
 */
export const saveAltaClienteToFirestore = async (altaData: any) => {
    try {

        await db.collection("altasCliente").add(altaData);
        console.log("✅ [DAO Altacliente] Guardado exitoso:");
    }
    catch (error: any) {
        console.error("❌ [DAO Altacliente] Error guardando en Firestore:", error.message);
        throw error;
    }
};

