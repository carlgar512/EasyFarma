import { db } from "../../presentacion/config/firebaseConfig";

/**
 * Genera un número de tarjeta único utilizando un contador global almacenado en Firestore.
 * Cada vez que se llama, incrementa el contador en 1 y devuelve el número con formato "0000 0000 0000 0001".
 * Esto asegura que cada tarjeta generada sea única y secuencial.
 */

export const generarTarjetaConContador = async (): Promise<string> => {
    try {

        const contadorRef = db.doc("counters/tarjeta");

        const numero = await db.runTransaction( async (transaction) => {
            const snapshot = await transaction.get(contadorRef);
            const actual = snapshot.exists ? snapshot.data()?.actual ?? 0 : 0;
            const nuevo = actual + 1;
            transaction.set(contadorRef, { actual: nuevo });
            return nuevo;
        });

        // 👉 Formatear a tipo "0000 0000 0000 0001"
        const numeroStr = numero.toString().padStart(16, "0");
        return numeroStr.match(/.{1,4}/g)!.join(" ");
    } catch (error: any) {
        console.error("❌ [DAO contadorTarjeta] Error guardando en Firestore:", error.message);
        throw error;
    }
};
