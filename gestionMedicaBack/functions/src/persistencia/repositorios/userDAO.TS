import { auth } from "../../presentacion/config/firebaseConfig";
import { Usuario } from "../../negocio/modelos/Usuario";
import { db } from "../../presentacion/config/firebaseConfig";
import { UserRecord } from "firebase-admin/auth";

const USERS_COLLECTION = "users";
/**
 * Guarda un usuario en Firestore
 */
export const saveUserToFirestore = async (user: Usuario) => {
  try {
    console.log("📄 [DAO] Guardando en Firestore:", user.getIdUsuario());
    const userRef = db.collection(USERS_COLLECTION).doc(user.getIdUsuario());
    await userRef.set(user.toFirestoreObject());
    console.log("✅ [DAO] Guardado exitoso:", user.getIdUsuario());
  } catch (error: any) {
    console.error("❌ [DAO] Error guardando en Firestore:", error.message);
    throw error;
  }
};

/**
 * Guarda un usuario infantil en Firestore (Firestore genera el ID automáticamente)
 */
export const saveChildUserToFirestore = async (user: Usuario): Promise<string> => {
  try {
    console.log("📄 [DAO] Guardando usuario infantil en Firestore (ID autogenerado)");
    const userRef = await db.collection(USERS_COLLECTION).add(user.toFirestoreObject());
    console.log("✅ [DAO] Usuario infantil guardado con ID:", userRef.id);
    return userRef.id;
  } catch (error: any) {
    console.error("❌ [DAO] Error guardando usuario infantil en Firestore:", error.message);
    throw error;
  }
};

/**
 * Busca el email de un usuario por su DNI
 */
export const getEmailByDNI = async (dni: string): Promise<string | null> => {
  const cleanDni = String(dni).trim();
  const usersRef = db.collection(USERS_COLLECTION);
  const snapshot = await usersRef.where("dni", "==", cleanDni).get();

  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    return data.email;
  }

  return null;
};

/**
 * Busca el email de un usuario por su DNI
 */
export const getUIDByDNI = async (dni: string): Promise<string | null> => {
  const cleanDni = String(dni).trim();
  const usersRef = db.collection(USERS_COLLECTION);
  const snapshot = await usersRef.where("dni", "==", cleanDni).get();

  if (!snapshot.empty) {
    return snapshot.docs[0].id; // ✅ Devuelve el ID del documento (Firestore ID)
  }

  return null;
};

/**
 * Obtiene un usuario por su UID
 */
export const getUserById = async (uid: string) => {
  try {
    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(`🔍 [DAO Usuario] No se encontró usuario con ID ${uid}.`);
      return null;
    }

    console.log(`✅ [DAO Usuario] Usuario con ID ${uid} encontrado.`);
    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error: any) {
    console.error("❌ [DAO Usuario] Error al obtener usuario:", error.message);
    throw error;
  }
};

export const updateUserPassword = async (email: string, password: string): Promise<void> => {
  try {
    // Actualizar la contraseña del usuario en Firebase Authentication
    await auth.updateUser(email, {
      password: password, // Cambiar la contraseña
    });

    console.log(`✅ Contraseña actualizada correctamente para el usuario con email: ${email}`);
  } catch (error: any) {
    console.error(`❌ Error al actualizar la contraseña para el usuario con email: ${email}:`, error.message);
    throw new Error(`Error al actualizar la contraseña para el usuario con email: ${email}`);
  }
}

export const createUserInAuth = async (email: string, password: string): Promise<UserRecord> => {
  try {
    // Crear el usuario en Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    console.log(`✅ Usuario creado con éxito con email: ${email}`);
    return userRecord; // Devuelve el record del usuario creado
  } catch (error: any) {
    console.error(`❌ Error al crear el usuario con email: ${email}`, error.message);
    throw new Error(`Error al crear el usuario con email: ${email}`);
  }
};

export const getUserByEmailFromAuth = async (email: string): Promise<UserRecord | null> => {
  try {
    // Obtiene el usuario de Firebase Authentication utilizando el correo
    const userRecord = await auth.getUserByEmail(email);

    console.log(`✅ Usuario encontrado con el correo: ${email}`);
    return userRecord; // Devuelve el objeto del usuario si se encuentra
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ No se encontró un usuario con el correo: ${email}`);
    } else {
      console.error(`❌ Error al obtener el usuario con el correo: ${email}`, error.message);
    }
    return null; // Si el usuario no se encuentra, retorna null
  }
};

export const updateUserInFirestore = async (uid: string, userData:any) => {
  try {
    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    await userRef.update(userData);
  } catch (error) {
    console.error("❌ [DAO User] Error al actualizar en Firestore:", error);
    throw error;
  }
};
