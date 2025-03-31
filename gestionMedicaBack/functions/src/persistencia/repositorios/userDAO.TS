
import { UsuarioDTO } from "../../negocio/dtos/UsuarioDTO";
import { Usuario } from "../../negocio/modelos/Usuario";
import { db } from "../../presentacion/config/firebaseConfig";

/**
 * Guarda un usuario en Firestore
 */
export const saveUserToFirestore = async (user: Usuario) => {
  try {
    console.log("📄 [DAO] Guardando en Firestore:", user.getIdUsuario());
    const userRef = db.collection("users").doc(user.getIdUsuario());
    await userRef.set(user.toFirestoreObject());
    console.log("✅ [DAO] Guardado exitoso:", user.getIdUsuario());
  } catch (error: any) {
    console.error("❌ [DAO] Error guardando en Firestore:", error.message);
    throw error;
  }
};

/**
 * Busca el email de un usuario por su DNI
 */
export const getEmailByDNI = async (dni: string): Promise<string | null> => {
  const cleanDni = String(dni).trim();
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("dni", "==", cleanDni).get();

  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    return data.email;
  }

  return null;
};

/**
 * Obtiene un usuario por su UID
 */
export const getUserById = async (uid: string): Promise<UsuarioDTO | null> => {
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  return userDoc.exists ? (userDoc.data() as UsuarioDTO) : null;
};
